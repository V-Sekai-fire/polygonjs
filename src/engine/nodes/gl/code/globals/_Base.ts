import {GlobalsGlNode} from '../../Globals';
import {GlConnectionPointType} from '../../../utils/io/connections/Gl';
import {BaseGlNodeType} from '../../_Base';
import {ShadersCollectionController} from '../utils/ShadersCollectionController';

export abstract class GlobalsBaseController {
	private static __next_id: number = 0;
	private _id: number;

	constructor() {
		this._id = GlobalsBaseController.__next_id++;
	}
	id() {
		return this._id;
	}

	handle_globals_node(
		globals_node: GlobalsGlNode,
		output_name: string,
		shaders_collection_controller: ShadersCollectionController
		// definitions_by_shader_name: Map<ShaderName, BaseGLDefinition[]>,
		// body_lines_by_shader_name: Map<ShaderName, string[]>,
		// body_lines: string[],
		// dependencies: ShaderName[],
		// shader_name: ShaderName
	): void {}

	handleGlobalVar(
		globals_node: BaseGlNodeType,
		output_name: string,
		glType: GlConnectionPointType,
		shaders_collection_controller: ShadersCollectionController
	): void {}

	abstract readAttribute(
		node: BaseGlNodeType,
		gl_type: GlConnectionPointType,
		attrib_name: string,
		shaders_collection_controller: ShadersCollectionController
	): string | undefined;
}
