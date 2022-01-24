/**
 * Snaps points onto one another.
 *
 * @remarks
 * Based on a distance threshold.
 *
 */
import {TypedSopNode} from './_Base';
import {CoreGroup} from '../../../core/geometry/Group';
import {CoreObject} from '../../../core/geometry/Object';
import {CoreGeometry} from '../../../core/geometry/Geometry';
import {Vector3} from 'three/src/math/Vector3';
import {Mesh} from 'three/src/objects/Mesh';

import {NodeParamsConfig, ParamConfig} from '../utils/params/ParamsConfig';
import {InputCloneMode} from '../../poly/InputCloneMode';
import {CorePoint} from '../../../core/geometry/Point';
import {objectTypeFromConstructor} from '../../../core/geometry/Constant';
import {MapUtils} from '../../../core/MapUtils';
class FuseSopParamsConfig extends NodeParamsConfig {
	/** @param distance threshold */
	dist = ParamConfig.FLOAT(0.1, {
		range: [0, 1],
		rangeLocked: [true, false],
	});
}
const ParamsConfig = new FuseSopParamsConfig();

export class FuseSopNode extends TypedSopNode<FuseSopParamsConfig> {
	override paramsConfig = ParamsConfig;
	static override type() {
		return 'fuse';
	}

	static override displayedInputNames(): string[] {
		return ['points to fuse together'];
	}

	override initializeNode() {
		this.io.inputs.setCount(1);
		this.io.inputs.initInputsClonedState(InputCloneMode.FROM_NODE);
	}

	override cook(input_contents: CoreGroup[]) {
		const core_group = input_contents[0];

		const new_objects = [];
		let new_object;
		for (let core_object of core_group.coreObjects()) {
			new_object = this._fuse_core_object(core_object);
			if (new_object) {
				new_objects.push(new_object);
			}
		}

		this.setObjects(new_objects);
	}

	private _fuse_core_object(core_object: CoreObject) {
		const object = core_object.object();
		if (!object) {
			return;
		}
		const points = core_object.points();

		const precision = this.pv.dist;
		const pointsByPosition: Map<string, CorePoint[]> = new Map();
		for (let point of points) {
			const position = point.position();
			const rounded_position = new Vector3(
				Math.round(position.x / precision),
				Math.round(position.y / precision),
				Math.round(position.z / precision)
			);
			const key = rounded_position.toArray().join('-');
			MapUtils.pushOnArrayAtEntry(pointsByPosition, key, point);
		}

		const keptPoints: CorePoint[] = [];
		pointsByPosition.forEach((points, key) => {
			keptPoints.push(points[0]);
		});

		(object as Mesh).geometry.dispose();
		if (keptPoints.length > 0) {
			const geometry = CoreGeometry.geometryFromPoints(keptPoints, objectTypeFromConstructor(object.constructor));
			if (geometry) {
				(object as Mesh).geometry = geometry;
			}
			return object;
		} else {
			// if(object.material){ object.material.dispose() }
			// if(object.parent){ object.parent.remove(object) }
		}
	}
}
