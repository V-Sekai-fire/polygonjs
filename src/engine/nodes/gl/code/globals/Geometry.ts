import {GlobalsBaseController} from './_Base';
import {GlobalsGlNode} from '../../Globals';
import {AttributeGlNode} from '../../Attribute';
// import {Definition} from '../../Definition/_Module';
// import {DefinitionBaseConfig} from '../Config/DefinitionBaseConfig';
// import {BaseGlNodeType} from '../../_Base';
import {VaryingGLDefinition, AttributeGLDefinition} from '../../utils/GLDefinition';
import {GlConnectionPointType} from '../../../utils/io/connections/Gl';
// import {TypeAssert} from '../../../../poly/Assert';
import {MapUtils} from '../../../../../core/MapUtils';
import {ShaderName} from '../../../utils/shaders/ShaderName';
import {BaseGlNodeType} from '../../_Base';
import {ShadersCollectionController} from '../utils/ShadersCollectionController';
import {PolyDictionary} from '../../../../../types/GlobalTypes';

const VARIABLE_CONFIG_DEFAULT_BY_NAME: PolyDictionary<string> = {
	position: 'vec3( position )',
};

export class GlobalsGeometryHandler extends GlobalsBaseController {
	static PRE_DEFINED_ATTRIBUTES = [
		'position',
		'color',
		'normal',
		'uv',
		'uv2',
		'morphTarget0',
		'morphTarget1',
		'morphTarget2',
		'morphTarget3',
		'skinIndex',
		'skinWeight',
	];

	static IF_RULE = {
		uv:
			'defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )',
	};

	handle_globals_node(
		globals_node: GlobalsGlNode,
		output_name: string,
		shaders_collection_controller: ShadersCollectionController
		// definitions_by_shader_name: Map<ShaderName, BaseGLDefinition[]>,
		// body_lines_by_shader_name: Map<ShaderName, string[]>,
		// body_lines: string[],
		// dependencies: ShaderName[],
		// shader_name: ShaderName
	): void {
		const connection_point = globals_node.io.outputs.named_output_connection_points_by_name(output_name);
		if (!connection_point) {
			return;
		}

		const var_name = globals_node.gl_var_name(output_name);
		const gl_type = connection_point.type();
		const definition = new VaryingGLDefinition(globals_node, gl_type, var_name);

		// MapUtils.push_on_array_at_entry(definitions_by_shader_name, shader_name, definition);
		shaders_collection_controller.add_definitions(globals_node, [definition]);
		// definitions_by_shader_name.get(shader_name)!.push(definition);
		const assembler = globals_node.material_node?.assemblerController?.assembler;
		if (!assembler) {
			return;
		}
		const shader_config = assembler.shader_config(shaders_collection_controller.current_shader_name);
		if (!shader_config) {
			return;
		}
		const dependencies = shader_config.dependencies();

		const body_line = `${var_name} = ${gl_type}(${output_name})`;
		for (let dependency of dependencies) {
			// MapUtils.push_on_array_at_entry(definitions_by_shader_name, dependency, definition);
			// MapUtils.push_on_array_at_entry(body_lines_by_shader_name, dependency, body_line);
			shaders_collection_controller.add_definitions(globals_node, [definition], dependency);
			shaders_collection_controller.add_body_lines(globals_node, [body_line], dependency);
		}
		if (dependencies.length == 0) {
			// body_lines.push(body_line);
			shaders_collection_controller.add_body_lines(globals_node, [body_line]);
		}
	}

	static variable_config_default(variable_name: string): string | undefined {
		return VARIABLE_CONFIG_DEFAULT_BY_NAME[variable_name];
	}
	variable_config_default(variable_name: string): string | undefined {
		return GlobalsGeometryHandler.variable_config_default(variable_name);
	}
	// variable_config_required_definitions(variable_name:string):DefinitionBaseConfig[]{
	// 	return null
	// }
	read_attribute(
		node: BaseGlNodeType,
		gl_type: GlConnectionPointType,
		attrib_name: string,
		shaders_collection_controller: ShadersCollectionController
	) {
		return GlobalsGeometryHandler.read_attribute(node, gl_type, attrib_name, shaders_collection_controller);
	}

	static read_attribute(
		node: BaseGlNodeType,
		gl_type: GlConnectionPointType,
		attrib_name: string,
		shaders_collection_controller: ShadersCollectionController
	): string | undefined {
		if (GlobalsGeometryHandler.PRE_DEFINED_ATTRIBUTES.indexOf(attrib_name) < 0) {
			shaders_collection_controller.add_definitions(
				node,
				[new AttributeGLDefinition(node, gl_type, attrib_name)],
				ShaderName.VERTEX
			);
		} else {
			// const if_rule = GlobalsGeometryHandler.IF_RULE[attrib_name]
			// if(if_rule){
			// 	const definition = new Definition.Attribute(node, gl_type, attrib_name)
			// 	definition.set_if_rule(if_rule)
			// 	node.add_definitions([definition])
			// }
		}

		// if (!shader_name) {
		// 	throw 'no shader name';
		// }
		const shader_name = shaders_collection_controller.current_shader_name;
		switch (shader_name) {
			case ShaderName.VERTEX: {
				return attrib_name;
			}
			case ShaderName.FRAGMENT: {
				// let's assume it can only be an attribute gl node
				if (!(node instanceof AttributeGlNode)) {
					return;
				}

				const var_name = 'varying_' + node.gl_var_name(node.output_name);
				const varying_definition = new VaryingGLDefinition(node, gl_type, var_name);

				const definitions_by_shader_name: Map<ShaderName, VaryingGLDefinition[]> = new Map();
				// definitions_by_shader_name.set(ShaderName.VERTEX, [])
				definitions_by_shader_name.set(ShaderName.FRAGMENT, []);
				// {
				// 	[ShaderName.VERTEX]: [],
				// 	[ShaderName.FRAGMENT]: [],
				// };
				const body_lines_by_shader_name: Map<ShaderName, string[]> = new Map();
				// body_lines_by_shader_name.set(ShaderName.VERTEX, [])
				body_lines_by_shader_name.set(ShaderName.FRAGMENT, []);
				MapUtils.push_on_array_at_entry(definitions_by_shader_name, shader_name, varying_definition);

				const set_varying_body_line = `${var_name} = ${gl_type}(${attrib_name})`;

				const shader_config = node.material_node?.assemblerController?.assembler.shader_config(shader_name);
				if (shader_config) {
					const dependencies = shader_config.dependencies();
					for (let dependency of dependencies) {
						MapUtils.push_on_array_at_entry(definitions_by_shader_name, dependency, varying_definition);
						MapUtils.push_on_array_at_entry(body_lines_by_shader_name, dependency, set_varying_body_line);
					}
					definitions_by_shader_name.forEach((definitions, shader_name) => {
						shaders_collection_controller.add_definitions(node, definitions, shader_name);
					});
					body_lines_by_shader_name.forEach((body_lines, shader_name) => {
						shaders_collection_controller.add_body_lines(node, body_lines, shader_name);
					});
				}

				return var_name;
			}
		}
		// TypeAssert.unreachable(shader_name);

		// const shader_name = node._shader_name // TODO: this is hack
		// const varying_definition = new Definition.Varying(node, gl_type, attrib_name)
		// const var_name = varying_definition.name()
		// definitions_by_shader_name[shader_name].push(varying_definition)
		// const shader_config = node.shader_config(shader_name)
		// const dependencies = shader_config.dependencies()
		// const body_line = `${var_name} = ${gl_type}(${attrib_name})`
		// for(let dependency of dependencies){
		// 	definitions_by_shader_name[dependency].push(varying_definition)
		// 	body_lines_by_shader_name[dependency].push(body_line)
		// }
		// // if(dependencies.length == 0){
		// 	// body_lines.push(body_line)
		// 	node.add_body_lines([body_line])
		// // }
		// for(let shader_name of Object.keys(definitions_by_shader_name)){
		// 	node.add_definitions(definitions_by_shader_name[shader_name], shader_name)
		// }
		// for(let shader_name of Object.keys(body_lines_by_shader_name)){
		// 	node.add_body_lines(body_lines_by_shader_name[shader_name], shader_name)
		// }
		// node.add_body_lines(body_lines)
	}
	handle_attribute_node(
		node: AttributeGlNode,
		gl_type: GlConnectionPointType,
		attrib_name: string,
		shaders_collection_controller: ShadersCollectionController
	) {
		return GlobalsGeometryHandler.read_attribute(node, gl_type, attrib_name, shaders_collection_controller);
	}
}
