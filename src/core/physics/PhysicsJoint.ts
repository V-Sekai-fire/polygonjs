import type {
	RigidBody,
	World,
	ImpulseJoint,
	FixedImpulseJoint,
	PrismaticImpulseJoint,
	SphericalImpulseJoint,
	RevoluteImpulseJoint,
} from '@dimforge/rapier3d-compat';
import {Object3D, Vector4, Vector3, Vector2} from 'three';
import {PhysicsLib} from './CorePhysics';
import {physicsWorldNodeIdFromObject} from './PhysicsWorld';
import {TypeAssert} from './../../engine/poly/Assert';
import {CoreGraphNodeId} from '../graph/CoreGraph';
import {
	getObjectVector2,
	setObjectVector2,
	getObjectVector3,
	setObjectVector3,
	getObjectVector4,
	setObjectVector4,
	getObjectString,
	setObjectString,
} from '../geometry/AttributeUtils';
export enum PhysicsJointType {
	FIXED = 'fixed',
	SPHERICAL = 'spherical',
	REVOLUT = 'revolute',
	PRISMATIC = 'prismatic',
}
export const PHYSICS_JOINT_TYPES: PhysicsJointType[] = [
	PhysicsJointType.FIXED,
	PhysicsJointType.SPHERICAL,
	PhysicsJointType.REVOLUT,
	PhysicsJointType.PRISMATIC,
];
const ALLOWED_JOIN_TYPES = [PhysicsJointType.FIXED, PhysicsJointType.SPHERICAL];
export const PHYSICS_JOINT_TYPE_MENU_ENTRIES = ALLOWED_JOIN_TYPES.map((name, value) => ({name, value}));

export enum PhysicsJointAttribute {
	JOIN_TYPE = 'jointType',
	RBD_ID1 = 'rbdId1',
	RBD_ID2 = 'rbdId2',
	ANCHOR1 = 'anchor1',
	ANCHOR2 = 'anchor2',
	LIMIT = 'limit',
	AXIS = 'axis',
	FRAME1 = 'frame1',
	FRAME2 = 'frame2',
}
interface JointFixedData {
	frame1: Vector4;
	frame2: Vector4;
}
interface JointPrismaticData {
	axis: Vector3;
	limit: Vector2;
}
interface JointRevolutData {
	axis: Vector3;
	limit: Vector2;
}

export interface JointData {
	jointType: PhysicsJointType;
	rbdId1: string;
	rbdId2: string;
	anchor1: Vector3;
	anchor2: Vector3;
	data: {
		fixed?: JointFixedData;
		prismatic?: JointPrismaticData;
		revolut?: JointRevolutData;
	};
}

export class CorePhysicsJoinAttribute {
	// common
	static setJoinType(object: Object3D, value: PhysicsJointType) {
		setObjectString(object, PhysicsJointAttribute.JOIN_TYPE, value);
	}
	static getJoinType(object: Object3D): PhysicsJointType {
		return getObjectString(object, PhysicsJointAttribute.JOIN_TYPE) as PhysicsJointType;
	}
	static setRBDId1(object: Object3D, value: string) {
		setObjectString(object, PhysicsJointAttribute.RBD_ID1, value);
	}
	static getRBDId1(object: Object3D): string {
		return getObjectString(object, PhysicsJointAttribute.RBD_ID1) as string;
	}
	static setRBDId2(object: Object3D, value: string) {
		setObjectString(object, PhysicsJointAttribute.RBD_ID2, value);
	}
	static getRBDId2(object: Object3D): string {
		return getObjectString(object, PhysicsJointAttribute.RBD_ID2) as string;
	}
	static setAnchor1(object: Object3D, value: Vector3) {
		setObjectVector3(object, PhysicsJointAttribute.ANCHOR1, value);
	}
	static getAnchor1(object: Object3D, value: Vector3): void {
		return getObjectVector3(object, PhysicsJointAttribute.ANCHOR1, value);
	}
	static setAnchor2(object: Object3D, value: Vector3) {
		setObjectVector3(object, PhysicsJointAttribute.ANCHOR2, value);
	}
	static getAnchor2(object: Object3D, value: Vector3): void {
		return getObjectVector3(object, PhysicsJointAttribute.ANCHOR2, value);
	}
	static setLimit(object: Object3D, value: Vector2) {
		setObjectVector2(object, PhysicsJointAttribute.LIMIT, value);
	}
	static getLimit(object: Object3D, value: Vector2): void {
		return getObjectVector2(object, PhysicsJointAttribute.LIMIT, value);
	}
	static setAxis(object: Object3D, value: Vector3) {
		setObjectVector3(object, PhysicsJointAttribute.AXIS, value);
	}
	static getAxis(object: Object3D, value: Vector3): void {
		return getObjectVector3(object, PhysicsJointAttribute.AXIS, value);
	}
	static setFrame1(object: Object3D, value: Vector4) {
		setObjectVector4(object, PhysicsJointAttribute.FRAME1, value);
	}
	static getFrame1(object: Object3D, value: Vector4): void {
		return getObjectVector4(object, PhysicsJointAttribute.FRAME1, value);
	}
	static setFrame2(object: Object3D, value: Vector4) {
		setObjectVector4(object, PhysicsJointAttribute.FRAME2, value);
	}
	static getFrame2(object: Object3D, value: Vector4): void {
		return getObjectVector4(object, PhysicsJointAttribute.FRAME2, value);
	}
}

type JointDataListByWorldObject = Map<CoreGraphNodeId, JointData[]>;
const jointDataListByWorldObject: JointDataListByWorldObject = new Map();

export function setJointDataListForWorldObject(worldObject: Object3D) {
	const nodeId = physicsWorldNodeIdFromObject(worldObject);
	if (nodeId == null) {
		return;
	}
	const array: JointData[] = [];
	jointDataListByWorldObject.set(nodeId, array);
	const childrenToRemove: Object3D[] = [];
	worldObject.traverse((child) => {
		const jointData = createJointDataFromJoinObject(child);
		if (jointData) {
			childrenToRemove.push(child);
			array.push(jointData);
		}
	});
	for (let child of childrenToRemove) {
		child.parent?.remove(child);
	}
}

function createJointDataFromJoinObject(object: Object3D): JointData | undefined {
	const jointType = CorePhysicsJoinAttribute.getJoinType(object);
	if (!jointType) {
		return;
	}
	const rbdId1 = CorePhysicsJoinAttribute.getRBDId1(object);
	const rbdId2 = CorePhysicsJoinAttribute.getRBDId2(object);
	if (rbdId1 == null || rbdId2 == null) {
		return;
	}
	const anchor1 = new Vector3();
	const anchor2 = new Vector3();
	CorePhysicsJoinAttribute.getAnchor1(object, anchor1);
	CorePhysicsJoinAttribute.getAnchor2(object, anchor2);

	const jointData: JointData = {
		jointType,
		rbdId1,
		rbdId2,
		anchor1,
		anchor2,
		data: {},
	};
	switch (jointType) {
		case PhysicsJointType.FIXED: {
			const frame1 = new Vector4();
			const frame2 = new Vector4();
			CorePhysicsJoinAttribute.getFrame1(object, frame1);
			CorePhysicsJoinAttribute.getFrame1(object, frame1);
			jointData.data.fixed = {frame1, frame2};
			return jointData;
		}
		case PhysicsJointType.PRISMATIC: {
			const axis = new Vector3();
			const limit = new Vector2();
			CorePhysicsJoinAttribute.getAxis(object, axis);
			CorePhysicsJoinAttribute.getLimit(object, limit);
			jointData.data.prismatic = {axis, limit};
			return jointData;
		}
		case PhysicsJointType.REVOLUT: {
			const axis = new Vector3();
			const limit = new Vector2();
			CorePhysicsJoinAttribute.getAxis(object, axis);
			CorePhysicsJoinAttribute.getLimit(object, limit);
			jointData.data.revolut = {axis, limit};
			return jointData;
		}
		case PhysicsJointType.SPHERICAL: {
			return jointData;
		}
	}
	TypeAssert.unreachable(jointType);
}

const wakeUp = true;
// const _limit = new Vector2();
// const _anchor1 = new Vector3();
// const _anchor2 = new Vector3();
// const _axis = new Vector3();
// const _frame1 = new Vector4();
// const _frame2 = new Vector4();
export function physicsCreateJoints(
	PhysicsLib: PhysicsLib,
	world: World,
	worldObject: Object3D,
	rigidBodyById: Map<string, RigidBody>
) {
	const nodeId = physicsWorldNodeIdFromObject(worldObject);
	if (nodeId == null) {
		return;
	}
	const jointDataList = jointDataListByWorldObject.get(nodeId);
	if (!jointDataList) {
		return;
	}
	for (let jointData of jointDataList) {
		physicsCreateJointFromJointData(PhysicsLib, world, jointData, rigidBodyById);
	}
}
export function physicsCreateJointFromJointData(
	PhysicsLib: PhysicsLib,
	world: World,
	jointData: JointData,
	rigidBodyById: Map<string, RigidBody>
) {
	const {rbdId1, rbdId2} = jointData;

	const rbd1 = rigidBodyById.get(rbdId1);
	const rbd2 = rigidBodyById.get(rbdId2);
	if (!(rbd1 && rbd2)) {
		return;
	}

	const joint = _createJoint(world, PhysicsLib, jointData, rbd1, rbd2);

	// configureMotorPosition(targetPos, stiffness, damping)
	// configureMotorVelocity(targetVel, damping)
	// configureMotor(targetPos, targetVel, stiffness, damping)
	// configureMotorModel(model)
	// console.log(joint);
	// if ((joint as PrismaticImpulseJoint).configureMotorPosition) {
	// 	(joint as PrismaticImpulseJoint).configureMotorPosition(0, 1, 1);
	// } else {
	// 	console.warn('configureMotorPosition not available');
	// }
	// if ((joint as PrismaticImpulseJoint).configureMotorVelocity) {
	// 	(joint as PrismaticImpulseJoint).configureMotorVelocity(-10, 0.5);
	// } else {
	// 	console.warn('configureMotorVelocity not available');
	// }
	// if ((joint as PrismaticImpulseJoint).configureMotor) {
	// 	(joint as PrismaticImpulseJoint).configureMotor(0, 0.1, 1, 1);
	// } else {
	// 	console.warn('configureMotor not available');
	// }
	// console.log('create joint', jointType, joint);

	// remove object from hierarchy after joint creation,
	// so that it doesn't need to be parsed when traversing the scene
	// object.parent?.remove(object);

	return joint;
}
// export function physicsCreateJointFromObject(
// 	PhysicsLib: PhysicsLib,
// 	world: World,
// 	worldObject: Object3D,
// 	object: Object3D,
// 	rigidBodyById: Map<string, RigidBody>
// ) {
// 	const jointType = CorePhysicsJoinAttribute.getJoinType(object);
// 	if (!jointType) {
// 		return;
// 	}

// 	const rbdId1 = CorePhysicsJoinAttribute.getRBDId1(object);
// 	const rbdId2 = CorePhysicsJoinAttribute.getRBDId2(object);
// 	const rbd1 = rigidBodyById.get(rbdId1);
// 	const rbd2 = rigidBodyById.get(rbdId2);
// 	if (!(rbd1 && rbd2)) {
// 		return;
// 	}
// 	CorePhysicsJoinAttribute.getAnchor1(object, _anchor1);
// 	CorePhysicsJoinAttribute.getAnchor2(object, _anchor2);

// 	const joint = _createJoint(world, PhysicsLib, object, jointType, rbd1, rbd2, _anchor1, _anchor2);

// 	// configureMotorPosition(targetPos, stiffness, damping)
// 	// configureMotorVelocity(targetVel, damping)
// 	// configureMotor(targetPos, targetVel, stiffness, damping)
// 	// configureMotorModel(model)
// 	// console.log(joint);
// 	// if ((joint as PrismaticImpulseJoint).configureMotorPosition) {
// 	// 	(joint as PrismaticImpulseJoint).configureMotorPosition(0, 1, 1);
// 	// } else {
// 	// 	console.warn('configureMotorPosition not available');
// 	// }
// 	// if ((joint as PrismaticImpulseJoint).configureMotorVelocity) {
// 	// 	(joint as PrismaticImpulseJoint).configureMotorVelocity(-10, 0.5);
// 	// } else {
// 	// 	console.warn('configureMotorVelocity not available');
// 	// }
// 	// if ((joint as PrismaticImpulseJoint).configureMotor) {
// 	// 	(joint as PrismaticImpulseJoint).configureMotor(0, 0.1, 1, 1);
// 	// } else {
// 	// 	console.warn('configureMotor not available');
// 	// }
// 	// console.log('create joint', jointType, joint);

// 	// remove object from hierarchy after joint creation,
// 	// so that it doesn't need to be parsed when traversing the scene
// 	object.parent?.remove(object);

// 	return joint;
// }

function _createJoint(
	world: World,
	PhysicsLib: PhysicsLib,
	jointData: JointData,
	rbd1: RigidBody,
	rbd2: RigidBody
): ImpulseJoint | undefined {
	const {jointType, anchor1, anchor2} = jointData;
	switch (jointType) {
		case PhysicsJointType.FIXED: {
			const fixedData = jointData.data.fixed;
			if (!fixedData) {
				return;
			}
			// const rot1 = {w: 1.0, x: 0.0, y: 0.0, z: 0.0};
			// const rot2 = {w: 1.0, x: 0.0, y: 0.0, z: 0.0};
			// console.log(_frame1.toArray());
			// console.log(_frame2.toArray());
			const {frame1, frame2} = fixedData;
			const params = PhysicsLib.JointData.fixed(anchor1, frame1, anchor2, frame2);
			const joint = world.createImpulseJoint(params, rbd1, rbd2, wakeUp) as FixedImpulseJoint;
			return joint;
		}
		case PhysicsJointType.PRISMATIC: {
			const prismaticfixedData = jointData.data.prismatic;
			if (!prismaticfixedData) {
				return;
			}
			const {axis, limit} = prismaticfixedData;
			// const axis = {x: 1.0, y: 0.0, z: 0.0};
			const params = PhysicsLib.JointData.prismatic(anchor1, anchor2, axis);
			params.limitsEnabled = true;
			params.limits = [limit.x, limit.y];
			const joint = world.createImpulseJoint(params, rbd1, rbd2, wakeUp) as PrismaticImpulseJoint;
			joint.setLimits(limit.x, limit.y);
			return joint;
		}
		case PhysicsJointType.REVOLUT: {
			const revolutfixedData = jointData.data.revolut;
			if (!revolutfixedData) {
				return;
			}
			const {axis, limit} = revolutfixedData;
			// const axis = {x: 0.0, y: 0.0, z: 1.0};
			const params = PhysicsLib.JointData.revolute(anchor1, anchor2, axis);
			params.limitsEnabled = true;
			params.limits = [limit.x, limit.y];
			const joint = world.createImpulseJoint(params, rbd1, rbd2, wakeUp) as RevoluteImpulseJoint;
			joint.setLimits(limit.x, limit.y);
			return joint;
		}
		case PhysicsJointType.SPHERICAL: {
			const params = PhysicsLib.JointData.spherical(anchor1, anchor2);
			const joint = world.createImpulseJoint(params, rbd1, rbd2, wakeUp) as SphericalImpulseJoint;
			return joint;
		}
	}
	TypeAssert.unreachable(jointType);
}
