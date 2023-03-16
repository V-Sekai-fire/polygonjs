import {TypedNode} from '../_Base';
// import {BaseJsFunctionAssembler} from './code/assemblers/_Base';
import {AssemblerControllerNode} from './code/Controller';
import {NodeContext} from '../../poly/NodeContext';
import {NodeParamsConfig} from '../utils/params/ParamsConfig';
import {ParamConfigsController} from '../utils/code/controllers/ParamConfigsController';
import {ShadersCollectionController} from './code/utils/ShadersCollectionController';
// import {ParamInitValueSerialized} from '../../params/types/ParamInitValueSerialized';
import {JsParamConfig} from './code/utils/JsParamConfig';
import {ParamType} from '../../poly/ParamType';
// import {BaseGlConnectionPoint} from '../utils/io/connections/Gl';
// import {IOController} from '../utils/io/IOController';
import {IntegerParam} from '../../params/Integer';
import {FloatParam} from '../../params/Float';
import {Vector2Param} from '../../params/Vector2';
import {Vector3Param} from '../../params/Vector3';
import {Vector4Param} from '../../params/Vector4';
import {ColorParam} from '../../params/Color';
import {BooleanParam} from '../../params/Boolean';
import {ThreeToGl} from '../../../core/ThreeToGl';
import {ParamsEditableStateController} from '../utils/io/ParamsEditableStateController';
import {Color, Vector2, Vector3, Vector4} from 'three';
import {CoreString} from '../../../core/String';
import {BaseParamType} from '../../params/_Base';

export function variableFromParamRequired(
	param: BaseParamType
): param is ColorParam | Vector2Param | Vector3Param | Vector4Param {
	return (
		param instanceof ColorParam ||
		param instanceof Vector2Param ||
		param instanceof Vector3Param ||
		param instanceof Vector4Param
	);
}
export function createVariableFromParam(param: ColorParam | Vector2Param | Vector3Param | Vector4Param) {
	if (param instanceof ColorParam) {
		return new Color();
	}
	if (param instanceof Vector2Param) {
		return new Vector2();
	}
	if (param instanceof Vector3Param) {
		return new Vector3();
	}
	// if (param instanceof Vector4Param) {
	return new Vector4();
	// }
}
export class TypedJsNode<K extends NodeParamsConfig> extends TypedNode<NodeContext.JS, K> {
	static override context(): NodeContext {
		return NodeContext.JS;
	}

	protected _param_configs_controller: ParamConfigsController<JsParamConfig<ParamType>> | undefined;
	// protected _assembler: BaseJsFunctionAssembler | undefined;
	private _paramsEditableStatesController = new ParamsEditableStateController(this);

	override initializeBaseNode() {
		this.uiData.setLayoutHorizontal();
		this.io.connections.initInputs();

		this.io.connection_points.spare_params.initializeNode();
		this._paramsEditableStatesController.initializeNode();
	}
	override cook() {
		console.warn('js node cooking');
	}

	protected _setFunctionNodeToRecompile() {
		this.functionNode()?.assemblerController()?.setCompilationRequiredAndDirty(this);
	}
	functionNode(): AssemblerControllerNode | undefined {
		const parent = this.parent();
		if (parent) {
			if (parent.context() == NodeContext.JS) {
				return (parent as BaseJsNodeType)?.functionNode();
			} else {
				return parent as AssemblerControllerNode;
			}
		}
	}

	// //
	// //
	// // VARIABLES
	// //
	// //
	jsVarName(name: string) {
		return `v_POLY_${this.name()}_${name}`;
	}

	variableForInputParam(
		shadersCollectionController: ShadersCollectionController,
		param: IntegerParam | FloatParam | Vector2Param | Vector3Param | Vector4Param | ColorParam | BooleanParam
	) {
		return this.variableForInput(shadersCollectionController, param.name());
	}
	variableForInput(shadersCollectionController: ShadersCollectionController, inputName: string): string {
		const inputIndex = this.io.inputs.getInputIndex(inputName);
		const connection = this.io.connections.inputConnection(inputIndex);
		let outputJsVarName: string | undefined;
		if (connection) {
			const inputNode = (<unknown>connection.node_src) as BaseJsNodeType;
			const outputConnectionPoint = inputNode.io.outputs.namedOutputConnectionPoints()[connection.output_index];
			if (outputConnectionPoint) {
				const outputName = outputConnectionPoint.name();
				outputJsVarName = inputNode.jsVarName(outputName);
				// console.log({outputJsVarName});
				// return outputJsVarName;
			} else {
				console.warn(`no output called '${inputName}' for js node ${inputNode.path()}`);
				throw 'variable_for_input ERROR';
			}
		}

		if (this.params.has(inputName)) {
			const param = this.params.get(inputName);
			if (param && variableFromParamRequired(param)) {
				const sanitizedNodePath = CoreString.sanitizeName(this.path());
				const varName = `${sanitizedNodePath}_${inputName}`;
				// if (
				// 	param instanceof ColorParam ||
				// 	param instanceof Vector2Param ||
				// 	param instanceof Vector3Param ||
				// 	param instanceof Vector4Param
				// ) {
				shadersCollectionController.addVariable(this, varName, createVariableFromParam(param));
				// } else {
				// 	console.log(param);
				// 	return 'param not implemented';
				// }
				return outputJsVarName
					? `${varName}.copy(${outputJsVarName})`
					: `${varName}.set(${param.value.toArray().join(', ')})`;
			} else {
				return outputJsVarName || ThreeToGl.any(this.params.get(inputName)?.value);
			}
		} else {
			const connectionPoint = this.io.inputs.namedInputConnectionPoints()[inputIndex];
			return outputJsVarName || ThreeToGl.any(connectionPoint.init_value);
		}
	}

	// variableForInput(name: string): string {
	// 	const input_index = this.io.inputs.getInputIndex(name);
	// 	const connection = this.io.connections.inputConnection(input_index);
	// 	if (connection) {
	// 		const input_node = (<unknown>connection.node_src) as BaseJsNodeType;
	// 		const output_connection_point =
	// 			input_node.io.outputs.namedOutputConnectionPoints()[connection.output_index];
	// 		if (output_connection_point) {
	// 			const output_name = output_connection_point.name();
	// 			return input_node.js_var_name(output_name);
	// 		} else {
	// 			console.warn(`no output called '${name}' for gl node ${input_node.path()}`);
	// 			throw 'variable_for_input ERROR';
	// 		}
	// 	} else {
	// 		return 'to debug...'; //ThreeToGl.any(this.params.get(name)?.value);
	// 	}
	// }

	// //
	// //
	// // ADDED LINES
	// //
	// //
	setLines(lines_controller: ShadersCollectionController) {}

	reset_code() {
		this._param_configs_controller?.reset();
		// this.resetLines();
	}

	// //
	// //
	// // PARAM CONFIGS
	// //
	// //
	paramsGenerating() {
		return false;
	}
	public setParamConfigs() {}
	param_configs() {
		return this._param_configs_controller?.list();
	}

	// //
	// //
	// // INPUT
	// //
	// //
	// js_input_default_value(name: string): ParamInitValueSerialized {
	// 	return null;
	// }
}

export type BaseJsNodeType = TypedJsNode<NodeParamsConfig>;
export class BaseJsNodeClass extends TypedJsNode<NodeParamsConfig> {}

class ParamlessJsParamsConfig extends NodeParamsConfig {}
const ParamsConfig = new ParamlessJsParamsConfig();
export class ParamlessTypedJsNode extends TypedJsNode<ParamlessJsParamsConfig> {
	override paramsConfig = ParamsConfig;
}
