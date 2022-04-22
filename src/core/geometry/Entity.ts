import {AttribValue, NumericAttribValue} from '../../types/GlobalTypes';
import {Vector4} from 'three';
import {Vector3} from 'three';
import {Vector2} from 'three';
export abstract class CoreEntity {
	constructor(protected _index: number) {}
	index() {
		return this._index;
	}

	abstract setAttribValue(name: string, value: NumericAttribValue | string): void;
	abstract attribValue(name: string, target?: Vector2 | Vector3 | Vector4): AttribValue | undefined;
	abstract stringAttribValue(name: string): string | undefined;
}
