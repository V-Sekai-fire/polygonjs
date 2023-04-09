import {Object3D} from 'three';
import {CoreObject} from '../../core/geometry/Object';
import {ObjectNamedFunction3} from './_Base';
import {_getObjectAttributeRef, _dummyReadAttributeRefVal} from '../../core/reactivity/ObjectAttributeReactivity';
import {_matchArrayLength, _matchArrayLengthWithType} from './_ArrayUtils';
import {ParamConvertibleJsType} from '../nodes/utils/io/connections/Js';
import {AttribValue} from '../../types/GlobalTypes';

export class getChildrenAttributes extends ObjectNamedFunction3<[string, string, Array<AttribValue>]> {
	static override type() {
		return 'getChildrenAttributes';
	}
	func(object3D: Object3D, attribName: string, type: ParamConvertibleJsType, values: AttribValue[]): AttribValue[] {
		_matchArrayLengthWithType(object3D.children, values, type);

		let i = 0;
		const children = object3D.children;
		for (let child of children) {
			const _refs = _getObjectAttributeRef(child, attribName, type);
			const value = CoreObject.attribValue(child, attribName) || _refs.current.value;
			_dummyReadAttributeRefVal(_refs.current.value);
			values[i] = value;
			i++;
		}

		return values;
	}
}
