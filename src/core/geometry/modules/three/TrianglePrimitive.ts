import {Triangle, Vector3, Mesh, BufferAttribute} from 'three';
import {CoreObjectType, ObjectBuilder, ObjectContent} from '../../ObjectContent';
import {CoreThreejsPrimitive} from './CoreThreejsPrimitive';
import {threeMeshFromPrimitives} from './builders/Mesh';
import {Attribute} from '../../Attribute';

const _triangle = new Triangle();
const _p0 = new Vector3();
const _p1 = new Vector3();
const _p2 = new Vector3();
export class TrianglePrimitive extends CoreThreejsPrimitive {
	constructor(object: Mesh, index: number) {
		super(object, index);
		this._geometry = object.geometry;
	}
	static override primitivesCount<T extends CoreObjectType>(object: ObjectContent<T>) {
		const geometry = (object as any as Mesh).geometry;
		if (!geometry) {
			return 0;
		}
		const index = geometry.getIndex();
		if (!index) {
			return 0;
		}
		return index.count / 3;
	}
	position(target: Vector3): Vector3 {
		if (!this._geometry) {
			return target;
		}
		const positionAttribute = this._geometry.getAttribute(Attribute.POSITION) as BufferAttribute;
		if (!positionAttribute) {
			return target;
		}
		const positionArray = positionAttribute.array;
		_p0.fromArray(positionArray, this._index * 3 + 0);
		_p1.fromArray(positionArray, this._index * 3 + 1);
		_p2.fromArray(positionArray, this._index * 3 + 2);
		target.copy(_p0).add(_p1).add(_p2).divideScalar(3);
		return target;
	}
	normal(target: Vector3): Vector3 {
		if (!this._geometry) {
			return target;
		}
		const positionAttribute = this._geometry.getAttribute(Attribute.POSITION) as BufferAttribute;
		if (!positionAttribute) {
			return target;
		}
		const positionArray = positionAttribute.array;
		_triangle.a.fromArray(positionArray, this._index * 3 + 0);
		_triangle.b.fromArray(positionArray, this._index * 3 + 1);
		_triangle.c.fromArray(positionArray, this._index * 3 + 2);
		_triangle.getNormal(target);
		return target;
	}
	override builder<T extends CoreObjectType>() {
		return threeMeshFromPrimitives as any as ObjectBuilder<T>;
	}
}
