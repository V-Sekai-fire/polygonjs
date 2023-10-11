/**
 * returns the number of neighbours of a specific primitive
 *
 * @remarks
 *
 *
 */

import {TypedJsNode} from './_Base';
import {NodeParamsConfig, ParamConfig} from '../utils/params/ParamsConfig';
import {JsConnectionPoint, JsConnectionPointType, JS_CONNECTION_POINT_IN_NODE_DEF} from '../utils/io/connections/Js';
import {JsLinesCollectionController} from './code/utils/JsLinesCollectionController';
import {Poly} from '../../Poly';
import {defaultPrimitiveGraph} from './_BaseObject3D';
const CONNECTION_OPTIONS = JS_CONNECTION_POINT_IN_NODE_DEF;

class PrimitiveNeighboursCountJsParamsConfig extends NodeParamsConfig {
	/** @param entity index */
	index = ParamConfig.INTEGER(0);
	/** @param require a shared edge */
	sharedEdgeOnly = ParamConfig.BOOLEAN(0);
}
const ParamsConfig = new PrimitiveNeighboursCountJsParamsConfig();
export class PrimitiveNeighboursCountJsNode extends TypedJsNode<PrimitiveNeighboursCountJsParamsConfig> {
	override paramsConfig = ParamsConfig;
	static override type() {
		return 'primitiveNeighboursCount';
	}
	override initializeNode() {
		super.initializeNode();

		this.io.outputs.setNamedOutputConnectionPoints([
			new JsConnectionPoint(JsConnectionPointType.INT, JsConnectionPointType.INT, CONNECTION_OPTIONS),
		]);
	}
	override setLines(linesController: JsLinesCollectionController) {
		const primitiveGraph = defaultPrimitiveGraph(linesController);
		const index = this.variableForInputParam(linesController, this.p.index);
		const sharedEdgeOnly = this.variableForInputParam(linesController, this.p.sharedEdgeOnly);
		const out = this.jsVarName(JsConnectionPointType.INT);

		const func = Poly.namedFunctionsRegister.getFunction('primitiveNeighboursCount', this, linesController);
		const bodyLine = func.asString(primitiveGraph, index, sharedEdgeOnly);
		linesController.addBodyOrComputed(this, [{dataType: JsConnectionPointType.INT, varName: out, value: bodyLine}]);
	}
}
