import {CorePoint} from './../../../core/geometry/entities/point/CorePoint';
import {CoreObject} from './../../../core/geometry/modules/three/CoreObject';
import {CoreAttribute} from './../../../core/geometry/Attribute';
import {AttribValue, NumericAttribValue} from './../../../types/GlobalTypes';
import {TypeAssert} from './../../poly/Assert';
import {CoreType} from './../../../core/Type';
import {BaseSopOperation} from './_Base';
import {CoreGroup} from '../../../core/geometry/Group';
import {InputCloneMode} from '../../../engine/poly/InputCloneMode';
import {AttribClass, ATTRIBUTE_CLASSES} from '../../../core/geometry/Constant';

import {ArrayUtils} from '../../../core/ArrayUtils';

import {DefaultOperationParams} from '../../../core/operations/_Base';
import {pointsFromObject} from '../../../core/geometry/entities/point/CorePointUtils';
import {corePointClassFactory} from '../../../core/geometry/CoreObjectFactory';
interface AttribPromoteSopParams extends DefaultOperationParams {
	classFrom: number;
	classTo: number;
	mode: number;
	name: string;
}

export enum AttribPromoteMode {
	MIN = 'min',
	MAX = 'max',
	FIRST_FOUND = 'first_round',
}
export const ATTRIB_PROMOTE_MODES: AttribPromoteMode[] = [
	AttribPromoteMode.MIN,
	AttribPromoteMode.MAX,
	AttribPromoteMode.FIRST_FOUND,
];

export class AttribPromoteSopOperation extends BaseSopOperation {
	static override readonly DEFAULT_PARAMS: AttribPromoteSopParams = {
		classFrom: ATTRIBUTE_CLASSES.indexOf(AttribClass.POINT),
		classTo: ATTRIBUTE_CLASSES.indexOf(AttribClass.OBJECT),
		mode: ATTRIB_PROMOTE_MODES.indexOf(AttribPromoteMode.FIRST_FOUND),
		name: '',
	};
	static override readonly INPUT_CLONED_STATE = InputCloneMode.FROM_NODE;
	static override type(): Readonly<'attribPromote'> {
		return 'attribPromote';
	}

	override cook(inputCoreGroups: CoreGroup[], params: AttribPromoteSopParams) {
		const coreGroup = inputCoreGroups[0];

		const classFrom = ATTRIBUTE_CLASSES[params.classFrom];
		const classTo = ATTRIBUTE_CLASSES[params.classTo];

		const attribNames = _attribNames(coreGroup, classFrom, params.name);

		for (let attribName of attribNames) {
			promoteAttribute(coreGroup, classFrom, classTo, attribName, params);
		}

		return coreGroup;
	}
}

function _attribNames(coreGroup: CoreGroup, attribClass: AttribClass, mask: string): string[] {
	switch (attribClass) {
		case AttribClass.POINT:
			return coreGroup.pointAttribNamesMatchingMask(mask);
		case AttribClass.VERTEX: {
			console.warn('primitive not supported yet');
			return [];
		}
		case AttribClass.PRIMITIVE: {
			console.warn('primitive not supported yet');
			return [];
		}
		case AttribClass.OBJECT:
			return coreGroup.objectAttribNamesMatchingMask(mask);
		case AttribClass.CORE_GROUP:
			return coreGroup.attribNamesMatchingMask(mask);
	}
	TypeAssert.unreachable(attribClass);
}
function promoteAttribute(
	coreGroup: CoreGroup,
	classFrom: AttribClass,
	classTo: AttribClass,
	attribName: string,
	params: AttribPromoteSopParams
) {
	switch (classFrom) {
		case AttribClass.POINT:
			return promoteAttributeFromPoints(coreGroup, classTo, attribName, params);
		case AttribClass.VERTEX: {
			console.warn('vertex not supported yet');
			return;
		}
		case AttribClass.PRIMITIVE: {
			console.warn('primitive not supported yet');
			return;
		}
		case AttribClass.OBJECT:
			return promoteAttributeFromObjects(coreGroup, classTo, attribName, params);
		case AttribClass.CORE_GROUP:
			return promoteAttributeFromCoreGroup(coreGroup, classTo, attribName);
	}
	TypeAssert.unreachable(classFrom);
}
function promoteAttributeFromPoints(
	coreGroup: CoreGroup,
	classTo: AttribClass,
	attribName: string,
	params: AttribPromoteSopParams
) {
	switch (classTo) {
		case AttribClass.POINT:
			return pointsToPoints(coreGroup, attribName, params);
		case AttribClass.VERTEX: {
			console.warn('vertex not supported yet');
			return;
		}
		case AttribClass.PRIMITIVE: {
			console.warn('primitive not supported yet');
			return;
		}
		case AttribClass.OBJECT:
			return pointsToObject(coreGroup, attribName, params);
		case AttribClass.CORE_GROUP:
			return pointsToCoreGroup(coreGroup, attribName, params);
	}
	TypeAssert.unreachable(classTo);
}
function promoteAttributeFromObjects(
	coreGroup: CoreGroup,
	classTo: AttribClass,
	attribName: string,
	params: AttribPromoteSopParams
) {
	switch (classTo) {
		case AttribClass.POINT:
			return objectsToPoints(coreGroup, attribName);
		case AttribClass.VERTEX: {
			console.warn('primitive not supported yet');
			return;
		}
		case AttribClass.PRIMITIVE: {
			console.warn('primitive not supported yet');
			return;
		}
		case AttribClass.OBJECT:
			return objectsToObjects(coreGroup, attribName, params);
		case AttribClass.CORE_GROUP:
			return objectsToCoreGroup(coreGroup, attribName, params);
	}
	TypeAssert.unreachable(classTo);
}
function promoteAttributeFromCoreGroup(coreGroup: CoreGroup, classTo: AttribClass, attribName: string) {
	switch (classTo) {
		case AttribClass.POINT:
			return coreGroupToPoints(coreGroup, attribName);
		case AttribClass.VERTEX: {
			console.log('vertex not supported yet');
			return;
		}
		case AttribClass.PRIMITIVE: {
			console.log('primitive not supported yet');
			return;
		}

		case AttribClass.OBJECT:
			return coreGroupToObjects(coreGroup, attribName);
		case AttribClass.CORE_GROUP:
			// nothing can be promoted from group to group
			return;
	}
	TypeAssert.unreachable(classTo);
}
function pointsToPoints(coreGroup: CoreGroup, attribName: string, params: AttribPromoteSopParams) {
	const values = findValuesFromPoints(coreGroup.points(), attribName);
	const value = filterValues(values, params);
	const coreObjects = coreGroup.threejsCoreObjects();
	for (let coreObject of coreObjects) {
		setValuesToPoints(coreObject, attribName, value as NumericAttribValue);
	}
}
function pointsToObject(coreGroup: CoreGroup, attribName: string, params: AttribPromoteSopParams) {
	const coreObjects = coreGroup.allCoreObjects();
	for (let coreObject of coreObjects) {
		const object = coreObject.object();
		const points = pointsFromObject(object);
		const values = findValuesFromPoints(points, attribName);
		const value = filterValues(values, params);
		coreObject.setAttribValue(attribName, value);
	}
}
function pointsToCoreGroup(coreGroup: CoreGroup, attribName: string, params: AttribPromoteSopParams) {
	const values = findValuesFromPoints(coreGroup.points(), attribName);
	const value = filterValues(values, params);
	coreGroup.setAttribValue(attribName, value);
}
function objectsToPoints(coreGroup: CoreGroup, attribName: string) {
	const coreObjects = coreGroup.threejsCoreObjects();
	for (let coreObject of coreObjects) {
		const value = coreObject.attribValue(attribName);
		if (value == null) {
			return;
		}
		setValuesToPoints(coreObject, attribName, value as NumericAttribValue);
	}
}
function objectsToObjects(coreGroup: CoreGroup, attribName: string, params: AttribPromoteSopParams) {
	const values = findValuesFromObjects(coreGroup, attribName);
	const value = filterValues(values, params);
	setValuesToObjects(coreGroup, attribName, value);
}
function objectsToCoreGroup(coreGroup: CoreGroup, attribName: string, params: AttribPromoteSopParams) {
	const values = findValuesFromObjects(coreGroup, attribName);
	const value = filterValues(values, params);
	coreGroup.setAttribValue(attribName, value);
}
function coreGroupToPoints(coreGroup: CoreGroup, attribName: string) {
	const value = coreGroup.attribValue(attribName);
	if (value == null) {
		return;
	}
	const coreObjects = coreGroup.threejsCoreObjects();
	for (let coreObject of coreObjects) {
		setValuesToPoints(coreObject, attribName, value as NumericAttribValue);
	}
}
function coreGroupToObjects(coreGroup: CoreGroup, attribName: string) {
	const value = coreGroup.attribValue(attribName);
	if (value == null) {
		return;
	}
	setValuesToObjects(coreGroup, attribName, value);
}

function filterValues(values: number[], params: AttribPromoteSopParams) {
	const mode = ATTRIB_PROMOTE_MODES[params.mode];
	switch (mode) {
		case AttribPromoteMode.MIN: {
			return ArrayUtils.min(values);
		}
		case AttribPromoteMode.MAX: {
			return ArrayUtils.max(values);
		}
		case AttribPromoteMode.FIRST_FOUND: {
			return values[0];
		}
	}
	TypeAssert.unreachable(mode);
}

//
//
// POINTS
//
//
function findValuesFromPoints(corePoints: CorePoint[], attribName: string) {
	const values: number[] = new Array(corePoints.length);
	const firstPoint = corePoints[0];
	if (firstPoint) {
		if (!firstPoint.isAttribIndexed(attribName)) {
			let point: CorePoint;
			for (let i = 0; i < corePoints.length; i++) {
				point = corePoints[i];
				values[i] = point.attribValue(attribName) as number;
			}
		}
	}
	return values;
}
function setValuesToPoints(coreObject: CoreObject, attribName: string, newValue: NumericAttribValue) {
	const attributeExists = coreObject.coreGeometry()?.hasAttrib(attribName);
	const object = coreObject.object();
	if (!attributeExists) {
		const attribSize = CoreAttribute.attribSizeFromValue(newValue);
		if (attribSize) {
			const corePointClass = corePointClassFactory(object);
			corePointClass.addNumericAttribute(object, attribName, attribSize, newValue);
		}
	}

	const points = pointsFromObject(object);
	for (let point of points) {
		point.setAttribValue(attribName, newValue);
	}
}

//
//
// OBJECTS
//
//
function findValuesFromObjects(coreGroup: CoreGroup, attribName: string) {
	const values = coreGroup.allCoreObjects().map((coreObject) => coreObject.attribValue(attribName));

	const nonNullValues = ArrayUtils.compact(values);
	const numericValues = nonNullValues.filter((value) => CoreType.isNumber(value)) as number[];
	return numericValues;
}

function setValuesToObjects(coreGroup: CoreGroup, attribName: string, newValue: AttribValue) {
	const coreObjects = coreGroup.allCoreObjects();
	for (let coreObject of coreObjects) {
		coreObject.setAttribValue(attribName, newValue);
	}
}
