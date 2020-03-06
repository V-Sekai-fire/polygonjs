import lodash_trim from 'lodash/trim';

import {TypedGlNode, BaseGlNodeType} from './_Base';
// import {BaseNodeGlMathFunctionArg1} from './_BaseMathFunctionArg1';
import {ConnectionPointType} from '../utils/connections/ConnectionPointType';
import {BaseNamedConnectionPointType} from '../utils/connections/NamedConnectionPoint';
import {ParamType} from '../../poly/ParamType';

const INPUT_NAME = 'export';
const OUTPUT_NAME = 'val';

const ConnectionPointTypesAvailableForAttribute = [
	ConnectionPointType.FLOAT,
	ConnectionPointType.VEC2,
	ConnectionPointType.VEC3,
	ConnectionPointType.VEC4,
];

import {ShadersCollectionController} from './code/utils/ShadersCollectionController';
import {NodeParamsConfig, ParamConfig} from '../utils/params/ParamsConfig';
import {GlConnectionsController} from './utils/ConnectionsController';
class AttributeGlParamsConfig extends NodeParamsConfig {
	name = ParamConfig.STRING('');
	type = ParamConfig.INTEGER(0, {
		menu: {
			entries: ConnectionPointTypesAvailableForAttribute.map((name, i) => {
				return {name: name, value: i};
			}),
		},
	});
}
const ParamsConfig = new AttributeGlParamsConfig();

export class AttributeGlNode extends TypedGlNode<AttributeGlParamsConfig> {
	params_config = ParamsConfig;
	static type() {
		return 'attribute';
	}

	private _on_create_set_name_if_none_bound = this._on_create_set_name_if_none.bind(this);
	// private _update_signature_if_required_bound = this._update_signature_if_required.bind(this);
	public readonly gl_connections_controller: GlConnectionsController = new GlConnectionsController(this);
	initialize_node() {
		this.add_post_dirty_hook('_set_mat_to_recompile', this._set_mat_to_recompile_if_is_exporting.bind(this));
		this.lifecycle.add_on_create_hook(this._on_create_set_name_if_none_bound);
		this.gl_connections_controller.initialize_node();

		this.gl_connections_controller.set_expected_input_types_function(() => []);
		this.gl_connections_controller.set_expected_output_types_function(() => [
			ConnectionPointTypesAvailableForAttribute[this.pv.type],
		]);
		// this.params.add_on_scene_load_hook('_update_signature_if_required', this._update_signature_if_required_bound);
		// this.params.set_post_create_params_hook(this._update_signature_if_required_bound);
		// this.add_post_dirty_hook('_update_signature_if_required', this._update_signature_if_required_bound);
	}
	create_params() {
		if (this.material_node?.assembler_controller.allow_attribute_exports()) {
			this.add_param(ParamType.BOOLEAN, 'export_when_connected', 0);
		}
	}
	// inputless_params_names(): string[] {
	// 	return ['type'];
	// }

	get input_name() {
		return INPUT_NAME;
	}
	get output_name() {
		return OUTPUT_NAME;
	}

	// private create_inputs_from_params() {
	// 	if (this.material_node.allow_attribute_exports) {
	// 		// this.set_named_inputs([new TypedConnectionFloat(AttributeGlNode.input_name())]);
	// 		this.io.inputs.set_named_input_connection_points([
	// 			new TypedNamedConnectionPoint(INPUT_NAME, ConnectionPointTypes[this.pv.type]),
	// 		]);
	// 		// this._init_graph_node_inputs();
	// 	}
	// }

	set_lines(shaders_collection_controller: ShadersCollectionController) {
		// if (lines_controller.shader_name) {
		this.material_node?.assembler_controller.assembler.set_node_lines_attribute(
			this,
			shaders_collection_controller
		);
		// }
	}

	// update_output_type(constructor) {
	// 	const named_output = new constructor(Attribute.output_name());
	// 	this.set_named_outputs([named_output]);
	// }
	// update_input_type(constructor) {
	// 	const named_input = new constructor(Attribute.input_name());
	// 	this.set_named_inputs([named_input]);
	// 	this._init_graph_node_inputs();
	// }

	get attribute_name(): string {
		return lodash_trim(this.pv.name);
	}
	gl_type(): ConnectionPointType {
		return this.io.outputs.named_output_connection_points[0].type;
	}
	//
	//
	// Utility methods for SOP/ParticlesSystemGPU and Assembler/Particles
	//
	//
	connected_input_node(): BaseGlNodeType | null {
		// if (this.io.inputs.has_named_inputs) {
		return this.io.inputs.named_input(INPUT_NAME);
		// }
	}
	connected_input_connection_point(): BaseNamedConnectionPointType | undefined {
		return this.io.inputs.named_input_connection_point(INPUT_NAME);
	}
	// connected_input(): NamedConnection {
	// 	const connection_point = this.connected_input_connection_point();
	// 	if (connection_point) {
	// 		return this.io.inputs.named_inputs().filter((ni) => ni.name() == Attribute.input_name())[0];
	// 	}
	// }
	output_connection_point(): BaseNamedConnectionPointType | undefined {
		// if (this.io.inputs.has_named_inputs) {
		return this.io.outputs.named_output_connection_points_by_name(this.input_name);
		// }
	}
	// connected_output(): NamedConnection {
	// 	const output = this.named_output(0);
	// 	if (output) {
	// 		return output; //this.named_inputs().filter(ni=>ni.name() == Attribute.input_name())[0]
	// 	}
	// }
	get is_importing(): boolean {
		return this.io.outputs.used_output_names().length > 0; // TODO: typescript - ensure that we can check that the connected outputs are part of the nodes retrived by the node traverser
	}
	get is_exporting(): boolean {
		if (this.pv.export_when_connected) {
			const input_node = this.io.inputs.named_input(INPUT_NAME);
			return input_node != null;
		} else {
			return false;
		}
	}
	private _set_mat_to_recompile_if_is_exporting() {
		if (this.is_exporting) {
			this._set_mat_to_recompile();
		}
	}
	//
	//
	// HOOKS
	//
	//
	private _on_create_set_name_if_none() {
		if (this.pv.name == '') {
			this.p.name.set(this.name);
		}
	}

	//
	//
	// SIGNATURE
	//
	//
	// private _update_signature_if_required(dirty_trigger?: CoreGraphNode) {
	// 	if (!this.lifecycle.creation_completed || dirty_trigger == this.p.type) {
	// 		this.update_input_and_output_types();
	// 		this.remove_dirty_state();
	// 		this.make_output_nodes_dirty();
	// 	}
	// 	this.material_node?.assembler_controller.set_compilation_required_and_dirty(this);
	// }
	// private update_input_and_output_types() {
	// 	const set_dirty = false;
	// 	this.io.outputs.set_named_output_connection_points(
	// 		[new TypedNamedConnectionPoint(this.output_name, ConnectionPointTypesAvailableForAttribute[this.pv.type])],
	// 		set_dirty
	// 	);
	// 	if (this.material_node?.assembler_controller.allow_attribute_exports()) {
	// 		this.io.inputs.set_named_input_connection_points([
	// 			new TypedNamedConnectionPoint(this.input_name, ConnectionPointTypesAvailableForAttribute[this.pv.type]),
	// 		]);
	// 	}
	// }
}
