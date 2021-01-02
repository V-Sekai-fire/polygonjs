import {Number2, Number3, Number4} from '../../../types/GlobalTypes';
import {TypedGlNode} from './_Base';
import {ParamType} from '../../poly/ParamType';
import {NodeParamsConfig} from '../utils/params/ParamsConfig';
import {GlConnectionPointType, GlConnectionPoint} from '../utils/io/connections/Gl';
import {ShadersCollectionController} from './code/utils/ShadersCollectionController';

class VecToParamsConfig extends NodeParamsConfig {}
const ParamsConfig = new VecToParamsConfig();
class BaseVecToGlNode extends TypedGlNode<VecToParamsConfig> {
	params_config = ParamsConfig;
}

interface VecToGlOptions {
	components: string[];
	param_type: ParamType;
}

function VecToGlFactory(type: string, options: VecToGlOptions) {
	const components = options.components;
	const param_type = options.param_type;
	return class VecToGlNode extends BaseVecToGlNode {
		static type() {
			return type;
		}

		initialize_node() {
			this.io.outputs.set_named_output_connection_points(
				components.map((c) => {
					return new GlConnectionPoint(c, GlConnectionPointType.FLOAT);
				})
			);
		}
		create_params() {
			this.add_param(param_type, 'vec', components.map((c) => 0) as Number2);
		}

		set_lines(shaders_collection_controller: ShadersCollectionController) {
			const body_lines: string[] = [];

			const vec = this.variable_for_input('vec');

			this.io.outputs.used_output_names().forEach((c) => {
				const var_name = this.gl_var_name(c);
				body_lines.push(`float ${var_name} = ${vec}.${c}`);
			});
			shaders_collection_controller.add_body_lines(this, body_lines);
		}
	};
}

const components_v2 = ['x', 'y'];
const components_v3 = ['x', 'y', 'z'];
const components_v4 = ['x', 'y', 'z', 'w'];

export class Vec2ToFloatGlNode extends VecToGlFactory('vec2ToFloat', {
	components: ['x', 'y'],
	param_type: ParamType.VECTOR2,
}) {}
export class Vec3ToFloatGlNode extends VecToGlFactory('vec3ToFloat', {
	components: ['x', 'y', 'z'],
	param_type: ParamType.VECTOR3,
}) {}
export class Vec4ToFloatGlNode extends VecToGlFactory('vec4ToFloat', {
	components: components_v4,
	param_type: ParamType.VECTOR4,
}) {}

export class Vec4ToVec3GlNode extends BaseVecToGlNode {
	static type() {
		return 'vec4ToVec3';
	}
	static readonly INPUT_NAME_VEC4 = 'vec4';
	static readonly OUTPUT_NAME_VEC3 = 'vec3';
	static readonly OUTPUT_NAME_W = 'w';

	initialize_node() {
		this.io.outputs.set_named_output_connection_points([
			new GlConnectionPoint(Vec4ToVec3GlNode.OUTPUT_NAME_VEC3, GlConnectionPointType.VEC3),
			new GlConnectionPoint(Vec4ToVec3GlNode.OUTPUT_NAME_W, GlConnectionPointType.FLOAT),
		]);
	}
	create_params() {
		this.add_param(ParamType.VECTOR4, Vec4ToVec3GlNode.INPUT_NAME_VEC4, components_v4.map((c) => 0) as Number4);
	}

	set_lines(shaders_collection_controller: ShadersCollectionController) {
		const body_lines = [];

		const in_vec4 = Vec4ToVec3GlNode.INPUT_NAME_VEC4;
		const out_vec3 = Vec4ToVec3GlNode.OUTPUT_NAME_VEC3;
		const out_w = Vec4ToVec3GlNode.OUTPUT_NAME_W;
		const vec = this.variable_for_input(in_vec4);

		const used_output_names = this.io.outputs.used_output_names();

		if (used_output_names.indexOf(out_vec3) >= 0) {
			const var_name = this.gl_var_name(out_vec3);
			body_lines.push(`vec3 ${var_name} = ${vec}.xyz`);
		}
		if (used_output_names.indexOf(out_w) >= 0) {
			const var_name = this.gl_var_name(out_w);
			body_lines.push(`float ${var_name} = ${vec}.w`);
		}
		shaders_collection_controller.add_body_lines(this, body_lines);
	}
}

export class Vec3ToVec2GlNode extends BaseVecToGlNode {
	static type() {
		return 'vec3ToVec2';
	}
	static readonly INPUT_NAME_VEC3 = 'vec3';
	static readonly OUTPUT_NAME_VEC2 = 'vec2';
	static readonly OUTPUT_NAME_Z = 'z';

	initialize_node() {
		this.io.outputs.set_named_output_connection_points([
			new GlConnectionPoint(Vec3ToVec2GlNode.OUTPUT_NAME_VEC2, GlConnectionPointType.VEC2),
			new GlConnectionPoint(Vec3ToVec2GlNode.OUTPUT_NAME_Z, GlConnectionPointType.FLOAT),
		]);
	}
	create_params() {
		this.add_param(ParamType.VECTOR3, Vec3ToVec2GlNode.INPUT_NAME_VEC3, components_v3.map((c) => 0) as Number3);
	}

	set_lines(shaders_collection_controller: ShadersCollectionController) {
		const body_lines = [];

		const in_vec3 = Vec3ToVec2GlNode.INPUT_NAME_VEC3;
		const out_vec2 = Vec3ToVec2GlNode.OUTPUT_NAME_VEC2;
		const out_z = Vec3ToVec2GlNode.OUTPUT_NAME_Z;
		const vec = this.variable_for_input(in_vec3);

		const used_output_names = this.io.outputs.used_output_names();

		if (used_output_names.indexOf(out_vec2) >= 0) {
			const var_name = this.gl_var_name(out_vec2);
			body_lines.push(`vec2 ${var_name} = ${vec}.xy`);
		}
		if (used_output_names.indexOf(out_z) >= 0) {
			const var_name = this.gl_var_name(out_z);
			body_lines.push(`float ${var_name} = ${vec}.z`);
		}
		shaders_collection_controller.add_body_lines(this, body_lines);
	}
}
export class Vec2ToVec3GlNode extends BaseVecToGlNode {
	static type() {
		return 'vec2ToVec3';
	}
	static readonly INPUT_NAME_VEC2 = 'vec3';
	static readonly INPUT_NAME_Z = 'z';
	static readonly OUTPUT_NAME_VEC3 = 'vec3';

	initialize_node() {
		this.io.outputs.set_named_output_connection_points([
			new GlConnectionPoint(Vec2ToVec3GlNode.OUTPUT_NAME_VEC3, GlConnectionPointType.VEC3),
		]);
	}
	create_params() {
		this.add_param(ParamType.VECTOR2, Vec2ToVec3GlNode.INPUT_NAME_VEC2, components_v2.map((c) => 0) as Number2);
		this.add_param(ParamType.FLOAT, Vec2ToVec3GlNode.INPUT_NAME_Z, 0);
	}

	set_lines(shaders_collection_controller: ShadersCollectionController) {
		const body_lines = [];

		const in_vec2 = Vec2ToVec3GlNode.INPUT_NAME_VEC2;
		const in_z = Vec2ToVec3GlNode.INPUT_NAME_Z;
		const out_vec3 = Vec2ToVec3GlNode.OUTPUT_NAME_VEC3;
		const vec2 = this.variable_for_input(in_vec2);
		const z = this.variable_for_input(in_z);

		const var_name = this.gl_var_name(out_vec3);
		body_lines.push(`vec3 ${var_name} = vec3(${vec2}.xy, ${z})`);
		shaders_collection_controller.add_body_lines(this, body_lines);
	}
}
export class Vec3ToVec4GlNode extends BaseVecToGlNode {
	static type() {
		return 'vec3ToVec4';
	}
	static readonly INPUT_NAME_VEC3 = 'vec3';
	static readonly INPUT_NAME_W = 'w';
	static readonly OUTPUT_NAME_VEC4 = 'vec4';

	initialize_node() {
		this.io.outputs.set_named_output_connection_points([
			new GlConnectionPoint(Vec3ToVec4GlNode.OUTPUT_NAME_VEC4, GlConnectionPointType.VEC4),
		]);
	}
	create_params() {
		this.add_param(ParamType.VECTOR3, Vec3ToVec4GlNode.INPUT_NAME_VEC3, components_v3.map((c) => 0) as Number3);
		this.add_param(ParamType.FLOAT, Vec3ToVec4GlNode.INPUT_NAME_W, 0);
	}

	set_lines(shaders_collection_controller: ShadersCollectionController) {
		const body_lines = [];

		const in_vec3 = Vec3ToVec4GlNode.INPUT_NAME_VEC3;
		const in_w = Vec3ToVec4GlNode.INPUT_NAME_W;
		const out_vec4 = Vec3ToVec4GlNode.OUTPUT_NAME_VEC4;
		const vec3 = this.variable_for_input(in_vec3);
		const w = this.variable_for_input(in_w);

		const var_name = this.gl_var_name(out_vec4);
		body_lines.push(`vec4 ${var_name} = vec4(${vec3}.xyz, ${w})`);
		shaders_collection_controller.add_body_lines(this, body_lines);
	}
}
