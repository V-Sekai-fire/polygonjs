import {Vector3, Triangle} from 'three';
import {MeshWithBVHGeometry} from '../../bvh/ThreeMeshBVHHelper';
import {TetGeometry} from '../TetGeometry';
import {TET_VERTICES_V_BASE, TetNeighbourDataWithSource} from '../TetCommon';
import {findTetContainingPosition} from './findTetContainingPosition';
import {tetCenter} from './tetCenter';
import {findNonDelaunayTetsFromSinglePointCheck} from './findNonDelaunayTets';
import {isPositionInsideMesh} from './tetInsideMesh';
import {setFirstValue} from '../../../SetUtils';

const _v = new Vector3();
const _triangle = new Triangle();
const _faceNormal = new Vector3();
const _newPtDelta = new Vector3();
const _containingTetSearchRayOrigin = new Vector3();
const sharedFacesNeighbourData: Set<TetNeighbourDataWithSource> = new Set();
const invalidTets: number[] = [];

export type TetEdge = [number, number, number, number];

export enum PointsTraversalMethod {
	MERGE = 'merge',
	MESH_FIRST = 'mesh first',
	ADDITIONAL_FIRST = 'additional first',
}
export const POINTS_TRAVERSAL_METHODS: PointsTraversalMethod[] = [
	PointsTraversalMethod.MERGE,
	PointsTraversalMethod.MESH_FIRST,
	PointsTraversalMethod.ADDITIONAL_FIRST,
];

interface TetrahedralizeOptions {
	traversalMethod: PointsTraversalMethod;
	axisSort: Vector3;
	mesh: MeshWithBVHGeometry;
	additionalPoints: Vector3[];
	stage: number | null;
	deleteOutsideTets: boolean;
}

function addPoint(
	tetGeometry: TetGeometry,
	newPointPosition: Vector3,
	searchStartPosition: Vector3,
	tetIdOrigin: number,
	stage: number | null
) {
	// 1. find tetrahedron containing the point
	const tetId = findTetContainingPosition(tetGeometry, newPointPosition, searchStartPosition, tetIdOrigin);
	if (tetId == null) {
		return;
	}

	// 2. find tetrahedrons that violate delaunay condition
	findNonDelaunayTetsFromSinglePointCheck(tetGeometry, tetId, newPointPosition, invalidTets);

	// 3. remove tetrahedrons
	tetGeometry.removeTets(invalidTets, sharedFacesNeighbourData, newPointPosition);
	_stage++;
	if (stage != null && _stage > stage) {
		return tetGeometry;
	}

	// 4. replace with new tetrahedrons
	const pointId = tetGeometry.addPoint(newPointPosition.x, newPointPosition.y, newPointPosition.z);

	sharedFacesNeighbourData.forEach((sharedFacesNeighbourData) => {
		_stage++;
		if (stage != null && _stage > stage) {
			return tetGeometry;
		}
		const id0 = sharedFacesNeighbourData.pointIds[0];
		const id1 = sharedFacesNeighbourData.pointIds[1];
		const id2 = sharedFacesNeighbourData.pointIds[2];
		const pt0 = tetGeometry.points.get(id0);
		const pt1 = tetGeometry.points.get(id1);
		const pt2 = tetGeometry.points.get(id2);
		// check that we orient the tetrahedron correctly
		if (pt0 && pt1 && pt2) {
			_triangle.a.copy(pt0.position);
			_triangle.b.copy(pt1.position);
			_triangle.c.copy(pt2.position);
			_triangle.getNormal(_faceNormal);
			_newPtDelta.copy(newPointPosition).sub(_triangle.a);
			const dot = _newPtDelta.dot(_faceNormal);
			if (dot > 0) {
				tetGeometry.addTetrahedron(id0, id1, id2, pointId);
			} else {
				tetGeometry.addTetrahedron(pointId, id0, id1, id2);
			}
		}
	});
	if (stage != null && _stage > stage) {
		return tetGeometry;
	}
}

const _outsideTestPos = new Vector3();
function removeOutsideTets(
	tetGeometry: TetGeometry,
	mesh: MeshWithBVHGeometry,
	deleteOutsideTets: boolean
): TetGeometry {
	if (!deleteOutsideTets) {
		return tetGeometry;
	}
	const outsideIds: number[] = [];
	tetGeometry.tetrahedrons.forEach((tet, tetId) => {
		tetCenter(tetGeometry, tetId, _outsideTestPos);
		const isInside = isPositionInsideMesh(_outsideTestPos, mesh, 0.001);
		if (!isInside) {
			outsideIds.push(tetId);
		}
	});
	tetGeometry.removeTets(outsideIds);
	return tetGeometry;
}

function prepareInputPoints(options: TetrahedralizeOptions): Vector3[] {
	const {traversalMethod, mesh, additionalPoints} = options;
	const {geometry} = mesh;
	const inputPoints: Vector3[] = [];

	switch (traversalMethod) {
		case PointsTraversalMethod.MERGE: {
			const geoPositionAttribute = geometry.attributes.position;
			const pointsCount = geoPositionAttribute.count;
			for (let i = 0; i < pointsCount; i++) {
				const newPos = new Vector3();
				newPos.fromBufferAttribute(geoPositionAttribute, i);
				inputPoints.push(newPos);
			}
			inputPoints.push(...additionalPoints);
			break;
		}
		case PointsTraversalMethod.MESH_FIRST: {
			const geoPositionAttribute = geometry.attributes.position;
			const pointsCount = geoPositionAttribute.count;
			for (let i = 0; i < pointsCount; i++) {
				const newPos = new Vector3();
				newPos.fromBufferAttribute(geoPositionAttribute, i);
				inputPoints.push(newPos);
			}
			//
			inputPoints.push(...additionalPoints);
			break;
		}
		case PointsTraversalMethod.ADDITIONAL_FIRST: {
			inputPoints.push(...additionalPoints);
			//
			const geoPositionAttribute = geometry.attributes.position;
			const pointsCount = geoPositionAttribute.count;
			for (let i = 0; i < pointsCount; i++) {
				const newPos = new Vector3();
				newPos.fromBufferAttribute(geoPositionAttribute, i);
				inputPoints.push(newPos);
			}

			break;
		}
	}

	return inputPoints;
}
function getNearestPoint(inputPoints: Set<Vector3>, inputPoint: Vector3) {
	let nearestPoint: Vector3 | undefined;
	let nearestDistance = Infinity;
	inputPoints.forEach((point) => {
		const distance = point.distanceTo(inputPoint);
		if (distance < nearestDistance) {
			nearestDistance = distance;
			nearestPoint = point;
		}
	});
	return nearestPoint;
}

let _stage = 0;
export function tetrahedralize(options: TetrahedralizeOptions): TetGeometry {
	_stage = 0;
	const {mesh, stage, deleteOutsideTets} = options;
	const {geometry} = mesh;
	const tetGeometry = new TetGeometry();

	geometry.computeBoundingSphere();
	const radius = geometry.boundingSphere?.radius || 1;

	// 1. add encompassing tet
	const s = 5.0 * radius;
	_v.copy(TET_VERTICES_V_BASE[0]).multiplyScalar(s);
	const id0 = tetGeometry.addPoint(_v.x, _v.y, _v.z);
	_v.copy(TET_VERTICES_V_BASE[1]).multiplyScalar(s);
	const id1 = tetGeometry.addPoint(_v.x, _v.y, _v.z);
	_v.copy(TET_VERTICES_V_BASE[2]).multiplyScalar(s);
	const id2 = tetGeometry.addPoint(_v.x, _v.y, _v.z);
	_v.copy(TET_VERTICES_V_BASE[3]).multiplyScalar(s);
	const id3 = tetGeometry.addPoint(_v.x, _v.y, _v.z);
	const firstTetId = tetGeometry.addTetrahedron(id0, id1, id2, id3);
	if (firstTetId == null) {
		return tetGeometry;
	}
	_stage++;
	if (stage != null && _stage > stage) {
		return removeOutsideTets(tetGeometry, mesh, deleteOutsideTets);
	}

	// 2. sort input points
	const inputPoints = new Set(prepareInputPoints(options));

	// 3. add points inside
	tetCenter(tetGeometry, firstTetId, _containingTetSearchRayOrigin);
	let tetIdOrigin = firstTetId;

	let inputPoint = setFirstValue(inputPoints);
	while (inputPoint != null) {
		addPoint(tetGeometry, inputPoint, _containingTetSearchRayOrigin, tetIdOrigin, stage);

		// use center of last added tet as ray origin for next search
		const lastAddedTetId = tetGeometry.lastAddedTetId();
		if (lastAddedTetId != null) {
			tetCenter(tetGeometry, lastAddedTetId, _containingTetSearchRayOrigin);
			tetIdOrigin = lastAddedTetId;
		}

		_stage++;
		if (stage != null && _stage > stage) {
			return removeOutsideTets(tetGeometry, mesh, deleteOutsideTets);
		}
		// get nearest point
		inputPoints.delete(inputPoint);
		inputPoint = getNearestPoint(inputPoints, inputPoint);
	}

	return removeOutsideTets(tetGeometry, mesh, deleteOutsideTets);
}
