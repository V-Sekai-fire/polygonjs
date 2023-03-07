import {BaseSopOperation} from './_Base';
import {CoreGroup, Object3DWithGeometry} from '../../../core/geometry/Group';
import {TypeAssert} from '../../../engine/poly/Assert';

import {
	CoreTransform,
	ROTATION_ORDERS,
	RotationOrder,
	TransformTargetType,
	TRANSFORM_TARGET_TYPES,
} from '../../../core/Transform';

import {InputCloneMode} from '../../../engine/poly/InputCloneMode';
import {coreObjectFactory} from '../../../core/geometry/CoreObjectFactory';
import {MathUtils, Vector3, Object3D, Matrix4, Euler, Quaternion} from 'three';
import {DefaultOperationParams} from '../../../core/operations/_Base';
import {
	OBJECT_TRANSFORM_SPACES,
	ObjectTransformSpace,
	applyTransformWithSpaceToObject,
} from '../../../core/TransformSpace';
import {CoreObjectType, isObject3D, ObjectContent} from '../../../core/geometry/ObjectContent';
// import type { CadCoreObject } from '../../../core/geometry/cad/CadCoreObject';
// import type{ CadGeometryType } from '../../../core/geometry/cad/CadCommon';
// import { cadTransform } from '../../../core/geometry/cad/operations/CadTransform';

// const _t = new Vector3();
const _r = new Vector3();
const _euler = new Euler();
const _q = new Quaternion();
const _s = new Vector3();
const _mat4 = new Matrix4();

export enum TransformObjectMode {
	SET = 'set matrix',
	MULT = 'multiply matrix',
}
export const TRANSFORM_OBJECT_MODES: TransformObjectMode[] = [TransformObjectMode.SET, TransformObjectMode.MULT];

interface TransformSopParams extends DefaultOperationParams {
	applyOn: number;
	objectMode: number;
	objectTransformSpace: number;
	group: string;
	rotationOrder: number;
	t: Vector3;
	r: Vector3;
	s: Vector3;
	scale: number;
	pivot: Vector3;
}

export class TransformSopOperation extends BaseSopOperation {
	static override readonly DEFAULT_PARAMS: TransformSopParams = {
		applyOn: TRANSFORM_TARGET_TYPES.indexOf(TransformTargetType.GEOMETRY),
		objectMode: TRANSFORM_OBJECT_MODES.indexOf(TransformObjectMode.SET),
		objectTransformSpace: OBJECT_TRANSFORM_SPACES.indexOf(ObjectTransformSpace.PARENT),
		group: '',
		rotationOrder: ROTATION_ORDERS.indexOf(RotationOrder.XYZ),
		t: new Vector3(0, 0, 0),
		r: new Vector3(0, 0, 0),
		s: new Vector3(1, 1, 1),
		scale: 1,
		pivot: new Vector3(0, 0, 0),
	};
	static override readonly INPUT_CLONED_STATE = InputCloneMode.FROM_NODE;
	static override type(): Readonly<'transform'> {
		return 'transform';
	}

	private _coreTransform = new CoreTransform();
	override cook(inputCoreGroups: CoreGroup[], params: TransformSopParams) {
		const coreGroup = inputCoreGroups[0];

		const inputObjects = coreGroup.allObjects();
		for (let inputObject of inputObjects) {
			this._applyTransform(inputObject, coreGroup, params);
		}
		// this._applyCadTransform(coreGroup.cadCoreObjects(), params);
		coreGroup.resetBoundingBox();
		return coreGroup;
	}
	private _applyTransform(object: ObjectContent<CoreObjectType>, coreGroup: CoreGroup, params: TransformSopParams) {
		if (isObject3D(object)) {
			this._applyTransformWithTransformTargetType(object, coreGroup, params);
		} else {
			this._applyTransformWithoutTransformTargetType(object, params);
		}
	}
	private _applyTransformWithoutTransformTargetType(
		object: ObjectContent<CoreObjectType>,
		params: TransformSopParams
	) {
		this._updateObject(object, params);
	}
	private _applyTransformWithTransformTargetType(object: Object3D, coreGroup: CoreGroup, params: TransformSopParams) {
		const mode = TRANSFORM_TARGET_TYPES[params.applyOn];
		switch (mode) {
			case TransformTargetType.GEOMETRY: {
				return this._updateGeometry(object, coreGroup, params);
			}
			case TransformTargetType.OBJECT: {
				return this._updateObject(object, params);
			}
		}
		TypeAssert.unreachable(mode);
	}
	// private _applyCadTransform(objects: CadCoreObject<CadGeometryType>[]|undefined, params: TransformSopParams) {
	// 	if(!objects){
	// 		return
	// 	}
	// 	for(let object of objects){
	// 		cadTransform(object, params.t, params.r, params.scale)
	// 	}
	// }

	private _point_pos = new Vector3();
	private _updateGeometry(object: Object3D, coreGroup: CoreGroup, params: TransformSopParams) {
		const matrix = this._matrix(params);

		if (params.group.trim() === '') {
			object.traverse((childObject) => {
				const geometry = (childObject as Object3DWithGeometry).geometry;
				if (geometry) {
					geometry.translate(-params.pivot.x, -params.pivot.y, -params.pivot.z);
					geometry.applyMatrix4(matrix);
					geometry.translate(params.pivot.x, params.pivot.y, params.pivot.z);
				}
			});
		} else {
			// const coreGroup = CoreGroup._fromObjects(objects);
			const points = coreGroup.pointsFromGroup(params.group);
			for (let point of points) {
				const position = point.getPosition(this._point_pos).sub(params.pivot);
				position.applyMatrix4(matrix);
				point.setPosition(position.add(params.pivot));
			}
		}
	}

	private _updateObject(object: ObjectContent<CoreObjectType>, params: TransformSopParams) {
		const objectMode = TRANSFORM_OBJECT_MODES[params.objectMode];
		switch (objectMode) {
			case TransformObjectMode.SET: {
				return this._setMatrix(object, params);
			}
			case TransformObjectMode.MULT: {
				return this._multMatrix(object, params);
			}
		}
		TypeAssert.unreachable(objectMode);
	}

	private _setMatrix(object: ObjectContent<CoreObjectType>, params: TransformSopParams) {
		const order = ROTATION_ORDERS[params.rotationOrder];
		_r.copy(params.r).multiplyScalar(MathUtils.DEG2RAD);
		_euler.set(_r.x, _r.y, _r.z, order);
		_q.setFromEuler(_euler);
		_s.copy(params.s).multiplyScalar(params.scale);
		_mat4.compose(params.t, _q, _s);
		coreObjectFactory(object).applyMatrix(
			object,
			_mat4,
			TRANSFORM_TARGET_TYPES[params.applyOn],
			ObjectTransformSpace.LOCAL
		);
	}

	// private _objectPosition = new Vector3();
	private _multMatrix(object: ObjectContent<CoreObjectType>, params: TransformSopParams) {
		const matrix = this._matrix(params);
		const transformSpace = OBJECT_TRANSFORM_SPACES[params.objectTransformSpace];
		// for (let object of objects) {
		applyTransformWithSpaceToObject(object, matrix, transformSpace);
		// // center to origin
		// // this._objectPosition.copy(object.position);
		// // object.position.set(0, 0, 0);
		// object.updateMatrix();
		// // apply matrix
		// // object.applyMatrix4(matrix);
		// object.matrix.multiply(matrix);
		// // revert to position
		// // object.position.add(this._objectPosition);
		// // object.updateMatrix();
		// object.matrix.decompose(object.position, object.quaternion, object.scale);
		// }
	}

	private _matrix(params: TransformSopParams) {
		return this._coreTransform.matrix(
			params.t,
			params.r,
			params.s,
			params.scale,
			ROTATION_ORDERS[params.rotationOrder]
		);
	}
}
