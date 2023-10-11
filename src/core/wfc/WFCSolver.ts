import {WFCTilesCollection} from './WFCTilesCollection';
import {configTilesStats, TileConfigStats, solidTilesStats} from './WFCCommon';
import {EMPTY_TILE_ID, GRID_BORDER_ID, GRID_BORDER_SIDE_NAME} from './WFCConstant';
import {TileConfig, tileConfigToString, ERRORED_TILE_CONFIG, tileConfigsToString} from './WFCTileConfig';
import {CoreWFCTileAttribute, WFCQuadAttribute} from './WFCAttributes';
import {Object3D} from 'three';
import {NeighbourData} from '../geometry/modules/quad/graph/QuadGraph';
import {QuadNode} from '../geometry/modules/quad/graph/QuadNode';
import {Attribute} from '../geometry/Attribute';
import {pushOnArrayAtEntry, popFromArrayAtEntry, addToSetAtEntry} from '../MapUtils';
import {arrayUniq, sample, spliceSample} from '../ArrayUtils';
import {setToArray} from '../SetUtils';
import {NeighbourIndex, CCW_HALF_EDGE_SIDES} from '../geometry/modules/quad/graph/QuadGraphCommon';
import {mod} from '../math/_Module';
import {QuadObject} from '../geometry/modules/quad/QuadObject';
import {WFCFloorGraph} from './WFCFloorGraph';
import {isQuadNodeSolveAllowed, quadPrimitiveFloorIndex} from './WFCUtils';
import {QuadPrimitive} from '../geometry/modules/quad/QuadPrimitive';
import {WFCTileConfigSampler} from './WFCTileConfigSampler';
import {PrimitiveStringAttribute} from '../geometry/entities/primitive/PrimitiveAttribute';

const _neighbourData: NeighbourData = {
	quadNode: null,
	neighbourIndex: null,
};
const _configStats: TileConfigStats = {
	solid: 0,
	empty: 0,
};
const _entropiesSet: Set<number> = new Set();
const _sortedEntropies: number[] = [];

interface WFCSolverOptions {
	tileAndRuleObjects: Object3D[];
	quadObject: QuadObject;
	// height: number;
	maxResolvedQuadsCount: number;
}
interface WFCSolverProcessOptions {
	stepsCount: number;

	quadSeed: number;
	configSeed: number;
}
const _tileConfigSampler = new WFCTileConfigSampler();
export class WFCSolver {
	private _resolvedQuadsCount: number = 0;
	private _maxResolvedQuadsCount: number;
	private _stepsCount: number = 0;
	private _tilesCollection: WFCTilesCollection;
	private _quadPositionArrays: number[][] = [];
	private _lowestEntropy: number = Number.POSITIVE_INFINITY;
	private _quadNodeByEntropy: Map<number, QuadNode[]> = new Map();
	private _floorGraphs: WFCFloorGraph[] = [];
	private _quadIndicesByFloorIndex: Map<number, Set<number>> = new Map();
	private _floorGraphIndexByQuadNode: Map<QuadNode, number> = new Map();
	private _samplingWithWeightRequired: boolean = false;
	private _solvedTileIds: string[];
	//
	constructor(options: WFCSolverOptions) {
		const {quadObject} = options;
		// this._height = options.height;
		this._maxResolvedQuadsCount = options.maxResolvedQuadsCount;
		// get tile configs
		this._tilesCollection = new WFCTilesCollection(options);
		const tiles = this._tilesCollection.tiles();
		const allTileConfigs: TileConfig[] = [];
		for (const tile of tiles) {
			const tileId = CoreWFCTileAttribute.getTileId(tile);
			if (tileId == EMPTY_TILE_ID) {
				allTileConfigs.push({tileId, rotation: 0});
			} else {
				allTileConfigs.push({tileId, rotation: 0});
				allTileConfigs.push({tileId, rotation: 1});
				allTileConfigs.push({tileId, rotation: 2});
				allTileConfigs.push({tileId, rotation: 3});
			}
		}
		// check if the tiles have different weights
		const weights: number[] = [];
		arrayUniq(
			tiles.map((tile) => CoreWFCTileAttribute.getWeight(tile)),
			weights
		);
		if (weights.length > 1) {
			this._samplingWithWeightRequired = true;
		}

		// get floors count
		const primitivesCount = QuadPrimitive.entitiesCount(quadObject);
		for (let i = 0; i < primitivesCount; i++) {
			const floorIndex = quadPrimitiveFloorIndex(quadObject, i);
			addToSetAtEntry(this._quadIndicesByFloorIndex, floorIndex, i);
			// console.log('floorIndex', {i, floorIndex});
		}

		// create quad object attributes
		this._solvedTileIds = new Array(primitivesCount).fill('');
		const solvedTileIdsAttribute: PrimitiveStringAttribute = {
			isString: true,
			array: this._solvedTileIds,
			itemSize: 1,
		};
		QuadPrimitive.addAttribute(quadObject, WFCQuadAttribute.SOLVED_TILE_CONFIGS, solvedTileIdsAttribute);

		// create graphs
		this._quadIndicesByFloorIndex.forEach((quadIndices, floorIndex) => {
			this._quadPositionArrays[floorIndex] = quadObject.geometry.attributes[Attribute.POSITION].array as number[];
			const floorGraph = new WFCFloorGraph(quadObject, floorIndex);
			this._floorGraphs.push(floorGraph);
			for (const quadIndex of quadIndices) {
				this._setupQuadNode(floorGraph, quadIndex, allTileConfigs);
			}
		});
	}
	// objects(): Object3D[] {
	// 	return this._objects;
	// }
	private _setupQuadNode(floorGraph: WFCFloorGraph, quadIndex: number, allTileConfigs: TileConfig[]) {
		if (!isQuadNodeSolveAllowed(floorGraph.quadObject, quadIndex)) {
			return;
		}

		const {quadNode, quadTileConfigs} = floorGraph.setupQuadNode(quadIndex, allTileConfigs);
		this._floorGraphIndexByQuadNode.set(quadNode, floorGraph.floorIndex);
		const entropy = quadTileConfigs.length;
		pushOnArrayAtEntry(this._quadNodeByEntropy, entropy, quadNode);
		if (entropy < this._lowestEntropy) {
			this._lowestEntropy = entropy;
		}
	}
	process(options: WFCSolverProcessOptions) {
		const {stepsCount, quadSeed, configSeed} = options;
		if (stepsCount < 0) {
			let result = this.step(quadSeed, configSeed);
			while (result != false) {
				result = this.step(quadSeed, configSeed);
			}
		} else {
			for (let i = 0; i < stepsCount; i++) {
				const result = this.step(quadSeed, configSeed);
				if (result == false) {
					// stop loop if step has no quad to continue
					break;
				}
			}
		}
		this._addUnresolvedTileObjects();
	}
	private step(quadSeed: number, configSeed: number): boolean | undefined {
		// const isFirstStep = this._stepsCount == 0;
		this._stepsCount++;
		const quadNode = this._quadNodeWithLowestEntropy(quadSeed + this._stepsCount);
		if (!quadNode) {
			// console.warn('no quad left');
			return false;
		}
		const floorGraph = this._floorGraph(quadNode);
		const allowedConfigs = floorGraph.allowedTileConfigsForQuadNode(quadNode); //this._allowedTileConfigsByQuadId.get(quadNode.id);
		if (!(allowedConfigs && allowedConfigs.length > 0)) {
			// console.warn('no allowed config for quad', quadNode.id);
			return;
		}
		const updatedEntropy = this._reduceEntropyWithCache(quadNode, allowedConfigs);
		if (!(allowedConfigs && allowedConfigs.length > 0)) {
			// console.warn('no allowed config for quad', quadNode.id);
			popFromArrayAtEntry(this._quadNodeByEntropy, updatedEntropy, quadNode);
			this._placeErrorTileObject(quadNode);
			return;
		}
		configTilesStats(allowedConfigs, _configStats);

		const config =
			_configStats.solid == 0
				? allowedConfigs[0]
				: this._selectConfig(allowedConfigs, configSeed + this._stepsCount);
		floorGraph.setAllowedTileConfigsForQuadNode(quadNode, [config]); //this._allowedTileConfigsByQuadId.set(quadNode.id, [config]);
		this._approveConfigForQuad(quadNode, config);
		this._updateNeighboursEntropy(quadNode);
	}
	private _solveReachMaxCount() {
		return this._maxResolvedQuadsCount >= 0 && this._resolvedQuadsCount >= this._maxResolvedQuadsCount;
	}
	private _selectConfig(allowedConfigs: TileConfig[], seed: number): TileConfig {
		if (this._samplingWithWeightRequired) {
			_tileConfigSampler.setItemsAndWeights(
				allowedConfigs,
				allowedConfigs.map((config) =>
					CoreWFCTileAttribute.getWeight(this._tilesCollection.tile(config.tileId)!)
				)
			);
			return _tileConfigSampler.sample(seed);
		} else {
			return sample(solidTilesStats(allowedConfigs), seed)!;
		}
	}
	protected _addUnresolvedTileObjects() {
		this._quadNodeByEntropy.forEach((quadNodes, entropy) => {
			for (const quadNode of quadNodes) {
				const floorGraph = this._floorGraph(quadNode);
				const allowedConfigs = floorGraph.allowedTileConfigsForQuadNode(quadNode);
				if (allowedConfigs) {
					this._commitConfigsAttributeToQuadPrimitive(quadNode, allowedConfigs);
				}
			}
		});
	}
	private _placeErrorTileObject(quadNode: QuadNode) {
		this._commitConfigAttributeToQuadPrimitive(quadNode, ERRORED_TILE_CONFIG);
		this._resolvedQuadsCount++;
	}
	private _approveConfigForQuad(quadNode: QuadNode, config: TileConfig) {
		this._commitConfigAttributeToQuadPrimitive(quadNode, config);
		this._resolvedQuadsCount++;
	}
	private _commitConfigsAttributeToQuadPrimitive(quadNode: QuadNode, tileConfigs: TileConfig[]) {
		this._solvedTileIds[quadNode.id] = tileConfigsToString(tileConfigs);
	}
	private _commitConfigAttributeToQuadPrimitive(quadNode: QuadNode, tileConfig: TileConfig) {
		this._solvedTileIds[quadNode.id] = tileConfigToString(tileConfig);
	}

	private _updateNeighboursEntropy(startQuadNode: QuadNode) {
		const stack: QuadNode[] = [startQuadNode];

		while (stack.length > 0 && !this._solveReachMaxCount()) {
			const currentQuad = stack.pop()!;
			const floorIndex = this._floorGraphIndexByQuadNode.get(currentQuad)!;
			const floorGraph = this._floorGraphs[floorIndex];

			// update horizontal neighbours
			for (let i: NeighbourIndex = 0; i < 4; i++) {
				floorGraph.neighbourData(currentQuad.id, i as NeighbourIndex, _neighbourData);
				if (
					_neighbourData.quadNode &&
					floorGraph.allowedTileConfigsForQuadNode(_neighbourData.quadNode)!.length > 1
				) {
					this._updateQuadEntropy(_neighbourData.quadNode, stack);
				}
			}
			// update above
			const floorGraphAbove = this._floorGraphs[floorIndex + 1];
			if (floorGraphAbove) {
				const aboveQuad = floorGraphAbove.quadNode(currentQuad);
				if (aboveQuad) {
					if (floorGraphAbove.allowedTileConfigsForQuadNode(aboveQuad)!.length > 1) {
						this._updateQuadEntropy(aboveQuad, stack);
					}
				}
			}
			// update below
			const floorGraphBelow = this._floorGraphs[floorIndex - 1];
			if (floorGraphBelow) {
				const belowQuad = floorGraphBelow.quadNode(currentQuad);
				if (belowQuad) {
					if (floorGraphBelow.allowedTileConfigsForQuadNode(belowQuad)!.length > 1) {
						this._updateQuadEntropy(belowQuad, stack);
					}
				}
			}
		}
	}
	private _reduceEntropyWithCache(quadNode: QuadNode, allowedTileConfigs: TileConfig[]): number | undefined {
		const previousEntropy: number = allowedTileConfigs.length;
		this._reduceEntropy(quadNode, allowedTileConfigs);
		const updatedEntropy: number = allowedTileConfigs.length;

		if (updatedEntropy == previousEntropy) {
			return;
		}
		popFromArrayAtEntry(this._quadNodeByEntropy, previousEntropy, quadNode);
		pushOnArrayAtEntry(this._quadNodeByEntropy, updatedEntropy, quadNode);
		if (updatedEntropy <= this._lowestEntropy /*&& updatedEntropy > 1*/) {
			this._lowestEntropy = updatedEntropy;
		}

		return updatedEntropy;
	}
	private _updateQuadEntropy(quadNode: QuadNode, stack: QuadNode[]) {
		if (this._solveReachMaxCount()) {
			return;
		}
		const floorGraph = this._floorGraph(quadNode);
		const allowedTileConfigs = floorGraph.allowedTileConfigsForQuadNode(quadNode)!;

		const updatedEntropy = this._reduceEntropyWithCache(quadNode, allowedTileConfigs);
		if (updatedEntropy === undefined) {
			return;
		}

		stack.push(quadNode);
		switch (updatedEntropy) {
			case 0: {
				popFromArrayAtEntry(this._quadNodeByEntropy, updatedEntropy, quadNode);
				this._placeErrorTileObject(quadNode);
				return;
			}
			case 1: {
				popFromArrayAtEntry(this._quadNodeByEntropy, updatedEntropy, quadNode);
				const config = allowedTileConfigs[0];
				this._approveConfigForQuad(quadNode, config);
				return;
			}
			default: {
			}
		}
	}

	private _reduceEntropy(quadNode: QuadNode, allowedTileConfigs: TileConfig[]) {
		let i = 0;
		while (i < allowedTileConfigs.length) {
			const allowed = this._checkConfigAgainstNeighbours(quadNode, allowedTileConfigs[i]);
			if (allowed) {
				i++;
			} else {
				allowedTileConfigs.splice(i, 1);
			}
		}
		// if the allowedTileConfigs contain a single solid tile and empty tiles, remove the empty tiles
		if (allowedTileConfigs.length > 1) {
			configTilesStats(allowedTileConfigs, _configStats);
			switch (_configStats.solid) {
				case 0: {
					// if none is solid, we keep the first empty
					allowedTileConfigs.splice(1, allowedTileConfigs.length - 1);
					return;
				}
				case 1: {
					// if one is solid, we keep this one
					const _getIndex = () => {
						let index = 0;
						for (const tileConfig of allowedTileConfigs) {
							if (tileConfig.tileId != EMPTY_TILE_ID) {
								return index;
							}
							index++;
						}
						return index;
					};
					const index = _getIndex();
					allowedTileConfigs.splice(index + 1, allowedTileConfigs.length).splice(index - 1, index);
				}
			}
		}
	}
	private _checkConfigAgainstNeighbours(quadNode: QuadNode, tileConfig: TileConfig): boolean {
		// const id = `${this._floorGraphIndexByQuadNode.get(quadNode)}:${quadNode.id}, tileId:${tileConfig.tileId},rot:${
		// 	tileConfig.rotation
		// }`;
		// const doDebug = quadNode.id == 21;
		if (!this._isConfigAllowedWithNeighbour(quadNode, tileConfig, 0)) {
			// if (doDebug) console.log('_checkConfigAgainstNeighbours 0', id, false);
			return false;
		}
		if (!this._isConfigAllowedWithNeighbour(quadNode, tileConfig, 1)) {
			// if (doDebug) console.log('_checkConfigAgainstNeighbours 1', id, false);
			return false;
		}
		if (!this._isConfigAllowedWithNeighbour(quadNode, tileConfig, 2)) {
			// if (doDebug) console.log('_checkConfigAgainstNeighbours 2', id, false);
			return false;
		}
		if (!this._isConfigAllowedWithNeighbour(quadNode, tileConfig, 3)) {
			// if (doDebug) console.log('_checkConfigAgainstNeighbours 3', id, false);
			return false;
		}
		if (!this._isConfigAllowedWithVerticalNeighbour(quadNode, tileConfig, -1)) {
			// if (doDebug) console.log('_checkConfigAgainstNeighbours BELOW', id, false);
			return false;
		}
		if (!this._isConfigAllowedWithVerticalNeighbour(quadNode, tileConfig, +1)) {
			// if (doDebug) console.log('_checkConfigAgainstNeighbours ABOVE', id, false);
			return false;
		}
		// if (doDebug) console.log('_checkConfigAgainstNeighbours C', id, true);
		return true;
	}
	protected _isConfigAllowedWithNeighbour(
		quadNode: QuadNode,
		tileConfig: TileConfig,
		neighbourIndex: NeighbourIndex
	): boolean {
		const presentedSide0 = CCW_HALF_EDGE_SIDES[mod(neighbourIndex - tileConfig.rotation, 4)];

		const floorGraph = this._floorGraph(quadNode);
		floorGraph.neighbourData(quadNode.id, neighbourIndex, _neighbourData);
		if (!_neighbourData.quadNode || _neighbourData.neighbourIndex == null) {
			// we are on the grid border
			const isAllowed = this._tilesCollection.allowedTileConfig(
				tileConfig.tileId,
				presentedSide0,
				GRID_BORDER_ID,
				GRID_BORDER_SIDE_NAME
			);

			return isAllowed;
		}
		const neighbourConfigs = floorGraph.allowedTileConfigsForQuadNode(_neighbourData.quadNode)!;
		if (neighbourConfigs.length == 0) {
			// if neighbour has no config, it is empty, so the config is allowed
			return true;
		}
		for (const neighbourConfig of neighbourConfigs) {
			const presentedSide1 =
				CCW_HALF_EDGE_SIDES[mod(_neighbourData.neighbourIndex - neighbourConfig.rotation, 4)];
			const isAllowed = this._tilesCollection.allowedTileConfig(
				tileConfig.tileId,
				presentedSide0,
				neighbourConfig.tileId,
				presentedSide1
			);
			if (isAllowed) {
				return true;
			}
		}
		return false;
	}
	protected _isConfigAllowedWithVerticalNeighbour(
		quadNode: QuadNode,
		tileConfig: TileConfig,
		floorOffset: 1 | -1
	): boolean {
		const floorIndex = this._floorGraphIndexByQuadNode.get(quadNode)!;
		const presentedSide0 = floorOffset > 0 ? 't' : 'b';
		const presentedSide1 = floorOffset > 0 ? 'b' : 't';

		const neighbourFloorIndex = floorIndex + floorOffset;
		const neighbourFloorGraph = this._floorGraphs[neighbourFloorIndex];
		if (!neighbourFloorGraph) {
			// we are on the grid border
			const isAllowed = this._tilesCollection.allowedTileConfig(
				tileConfig.tileId,
				presentedSide0,
				GRID_BORDER_ID,
				GRID_BORDER_SIDE_NAME
			);

			return isAllowed;
		}
		const neighbourQuadNode = neighbourFloorGraph.quadNode(quadNode);
		if (!neighbourQuadNode) {
			// we are on the grid border
			const isAllowed = this._tilesCollection.allowedTileConfig(
				tileConfig.tileId,
				presentedSide0,
				GRID_BORDER_ID,
				GRID_BORDER_SIDE_NAME
			);

			return isAllowed;
		}

		const neighbourConfigs = neighbourFloorGraph.allowedTileConfigsForQuadNode(neighbourQuadNode)!;
		if (neighbourConfigs.length == 0) {
			// if neighbour has no config, it is empty, so the config is allowed
			return true;
		}
		for (const neighbourConfig of neighbourConfigs) {
			const isAllowed = this._tilesCollection.allowedTileConfig(
				tileConfig.tileId,
				presentedSide0,
				neighbourConfig.tileId,
				presentedSide1
			);

			if (isAllowed) {
				// if the connection is allowed, and since we are only testing vertical connection,
				// we only take a config if it has the same rotation,
				// OR if one of the tiles is the empty tile or the grid border
				const isAllowedIfNeighbourEmptyOrSharesRotation =
					neighbourConfig.tileId == EMPTY_TILE_ID ||
					tileConfig.tileId == EMPTY_TILE_ID ||
					neighbourConfig.tileId == GRID_BORDER_ID ||
					tileConfig.tileId == GRID_BORDER_ID ||
					neighbourConfig.rotation == tileConfig.rotation;
				if (isAllowedIfNeighbourEmptyOrSharesRotation) {
					return true;
				}
			}
		}
		return false;
	}

	private _quadNodeWithLowestEntropy(seed: number) {
		if (this._solveReachMaxCount()) {
			return;
		}
		let quadNodes = this._quadNodeByEntropy.get(this._lowestEntropy);

		// update lowest entropy if needed
		while (quadNodes == null || quadNodes.length == 0) {
			this._quadNodeByEntropy.delete(this._lowestEntropy);
			_entropiesSet.clear();
			this._quadNodeByEntropy.forEach((quadNodes, entropy) => {
				_entropiesSet.add(entropy);
			});
			setToArray(_entropiesSet, _sortedEntropies);
			const sortedEntropies = _sortedEntropies.sort((a, b) => a - b);
			if (sortedEntropies.length == 0) {
				return;
			}
			this._lowestEntropy = sortedEntropies[0];

			quadNodes = this._quadNodeByEntropy.get(this._lowestEntropy);
		}
		if (!quadNodes) {
			return;
		}

		const quadNode = spliceSample(quadNodes, seed);
		if (!quadNode) {
			return;
		}

		return quadNode;
	}

	private _floorGraph(quadNode: QuadNode): WFCFloorGraph {
		const floorIndex = this._floorGraphIndexByQuadNode.get(quadNode)!;

		return this._floorGraphs[floorIndex];
	}
}
