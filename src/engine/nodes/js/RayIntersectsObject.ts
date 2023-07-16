/**
 * gets the intersection of a ray with an object
 *
 * @remarks
 *
 *
 */

import {BaseRayObjectJsNode} from './_BaseRayObject';
import {JsConnectionPoint, JsConnectionPointType, JS_CONNECTION_POINT_IN_NODE_DEF} from '../utils/io/connections/Js';
import {JsLinesCollectionController} from './code/utils/JsLinesCollectionController';
// import { Vector3 } from 'three';
import {Poly} from '../../Poly';
import {inputObject3D} from './_BaseObject3D';
const CONNECTION_OPTIONS = JS_CONNECTION_POINT_IN_NODE_DEF;

const OUTPUT_NAME = 'intersects';
export class RayIntersectsObjectJsNode extends BaseRayObjectJsNode {
	static override type() {
		return 'rayIntersectsObject';
	}

	override initializeNode() {
		super.initializeNode();
		this.io.outputs.setNamedOutputConnectionPoints([
			new JsConnectionPoint(OUTPUT_NAME, JsConnectionPointType.BOOLEAN, CONNECTION_OPTIONS),
		]);
	}
	override setLines(shadersCollectionController: JsLinesCollectionController) {
		const object3D = inputObject3D(this, shadersCollectionController);
		const ray = this.variableForInput(shadersCollectionController, JsConnectionPointType.RAY);
		const out = this.jsVarName(OUTPUT_NAME);
		// shadersCollectionController.addVariable(this, out, new Vector3());

		const func = Poly.namedFunctionsRegister.getFunction(
			'rayIntersectsObject3D',
			this,
			shadersCollectionController
		);
		const bodyLine = func.asString(ray, object3D);
		shadersCollectionController.addBodyOrComputed(this, [
			{dataType: JsConnectionPointType.VECTOR3, varName: out, value: bodyLine},
		]);
	}
}
