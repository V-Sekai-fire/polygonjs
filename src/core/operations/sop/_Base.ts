import {CoreGroup} from '../../geometry/Group';
import {BaseOperation} from '../_Base';
import {NodeContext} from '../../../engine/poly/NodeContext';
import {BufferGeometry} from 'three/src/core/BufferGeometry';
import {ObjectType, ObjectByObjectType, OBJECT_CONSTRUCTOR_BY_OBJECT_TYPE, CoreConstant} from '../../geometry/Constant';
import {CoreGeometryIndexBuilder} from '../../geometry/util/IndexBuilder';
import {Material} from 'three/src/materials/Material';
import {Mesh} from 'three/src/objects/Mesh';
import {Object3D} from 'three/src/core/Object3D';
export class BaseSopOperation extends BaseOperation {
	static context() {
		return NodeContext.SOP;
	}
	cook(input_contents: CoreGroup[], params: any): CoreGroup | Promise<CoreGroup> | void {}

	//
	//
	// UTILS
	//
	//
	protected create_core_group_from_objects(objects: Object3D[]) {
		const core_group = new CoreGroup();
		core_group.set_objects(objects);
		return core_group;
	}
	protected create_core_group_from_geometry(geometry: BufferGeometry, type: ObjectType = ObjectType.MESH) {
		const object = BaseSopOperation.create_object(geometry, type);
		return this.create_core_group_from_objects([object]);
	}
	protected create_object<OT extends ObjectType>(
		geometry: BufferGeometry,
		type: OT,
		material?: Material
	): ObjectByObjectType[OT] {
		return BaseSopOperation.create_object(geometry, type, material);
	}
	static create_object<OT extends ObjectType>(
		geometry: BufferGeometry,
		type: OT,
		material?: Material
	): ObjectByObjectType[OT] {
		// ensure it has an index
		this.create_index_if_none(geometry);

		const object_constructor = OBJECT_CONSTRUCTOR_BY_OBJECT_TYPE[type] as any; //THREE[type];
		material = material || CoreConstant.MATERIALS[type].clone();
		const object: Mesh = new object_constructor(geometry, material);
		object.castShadow = true;
		object.receiveShadow = true;
		object.frustumCulled = false;
		object.matrixAutoUpdate = false;

		return object as ObjectByObjectType[OT];
	}
	protected create_index_if_none(geometry: BufferGeometry) {
		BaseSopOperation.create_index_if_none(geometry);
	}
	static create_index_if_none(geometry: BufferGeometry) {
		CoreGeometryIndexBuilder.create_index_if_none(geometry);
	}
}
