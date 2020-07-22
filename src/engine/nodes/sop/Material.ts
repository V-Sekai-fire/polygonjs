import {TypedSopNode} from './_Base';
import {CoreMaterial} from '../../../core/geometry/Material';
import {GlobalsGeometryHandler} from '../gl/code/globals/Geometry';
import {InputCloneMode} from '../../poly/InputCloneMode';
import {NodeContext} from '../../poly/NodeContext';
import {BaseMatNodeType} from '../mat/_Base';
import {CoreGroup} from '../../../core/geometry/Group';
import {Mesh} from 'three/src/objects/Mesh';
import {Material} from 'three/src/materials/Material';
import {Object3D} from 'three/src/core/Object3D';
import {BaseBuilderMatNodeType} from '../mat/_BaseBuilder';
import {Texture} from 'three/src/textures/Texture';

import {NodeParamsConfig, ParamConfig} from '../utils/params/ParamsConfig';
class MaterialSopParamsConfig extends NodeParamsConfig {
	group = ParamConfig.STRING('');
	material = ParamConfig.OPERATOR_PATH('/MAT/mesh_standard1', {
		node_selection: {
			context: NodeContext.MAT,
		},
		dependent_on_found_node: false,
	});
	apply_to_children = ParamConfig.BOOLEAN(1);
	swap_current_tex = ParamConfig.BOOLEAN(0);
	tex_src0 = ParamConfig.STRING('emissiveMap', {visible_if: {swap_current_tex: 1}});
	tex_dest0 = ParamConfig.STRING('map', {visible_if: {swap_current_tex: 1}});
	// clone_mat is mostly useful when swapping tex for multiple objects which have different textures
	clone_mat = ParamConfig.BOOLEAN(0, {visible_if: {swap_current_tex: 1}});
}
const ParamsConfig = new MaterialSopParamsConfig();

export class MaterialSopNode extends TypedSopNode<MaterialSopParamsConfig> {
	params_config = ParamsConfig;
	static type() {
		return 'material';
	}

	_param_material: BaseMatNodeType | undefined;
	_globals_handler: GlobalsGeometryHandler = new GlobalsGeometryHandler();

	static displayed_input_names(): string[] {
		return ['objects to assign material to'];
	}

	initialize_node() {
		this.io.inputs.set_count(1);
		this.io.inputs.init_inputs_cloned_state(InputCloneMode.FROM_NODE);
	}

	// TODO: optimize by not fetching the material node everytime
	// and maybe have a method in all operator_path params to do that quickly
	// TODO: does this apply the material to only 1 node?
	async cook(core_groups: CoreGroup[]) {
		// let container = input_containers[0];
		// const group =	container.group(); // {clone: this.do_clone_inputs()})
		const core_group = core_groups[0];

		const material_node = this.p.material.found_node_with_context(NodeContext.MAT);
		if (material_node) {
			const material = material_node.material;
			const assembler_controller = (material_node as BaseBuilderMatNodeType).assembler_controller;
			if (assembler_controller) {
				assembler_controller.set_assembler_globals_handler(this._globals_handler);
			}

			await material_node.request_container();
			if (material) {
				for (let object of core_group.objects_from_group(this.pv.group)) {
					if (this.pv.apply_to_children) {
						object.traverse((grand_child) => {
							this.apply_material(grand_child, material);
						});
					} else {
						this.apply_material(object, material);
					}
				}
				this.set_core_group(core_group);
			} else {
				this.states.error.set(`material invalid. (error: '${material_node.states.error.message}')`);
			}
		} else {
			this.states.error.set(`no material node found`);
		}
	}

	apply_material(object: Object3D, material: Material) {
		const object_with_material = object as Mesh;
		const current_mat = object_with_material.material as Material;
		if (this.pv.swap_current_tex) {
			material = this.pv.clone_mat ? material.clone() : material;
			this._swap_textures(material, current_mat);
		}
		object_with_material.material = material;

		CoreMaterial.apply_render_hook(object, material);
		CoreMaterial.apply_custom_materials(object, material);
	}

	private _swap_textures(target_mat: Material, src_mat: Material) {
		if (this.pv.tex_src0 == '' || this.pv.tex_dest0 == '') {
			return;
		}
		const src_tex: Texture | null = (src_mat as any)[this.pv.tex_src0];
		if (src_tex) {
			(target_mat as any)[this.pv.tex_dest0] = src_tex;
		}
	}
}
