/**
 * Allows to edit properties of textures in the used materials.
 *
 *
 *
 */
import {TypedSopNode} from './_Base';
import {CoreGroup} from '../../../core/geometry/Group';
import {TexturePropertiesSopOperation} from '../../../core/operations/sop/TextureProperties';

import {MAG_FILTER_MENU_ENTRIES, MIN_FILTER_MENU_ENTRIES} from '../../../core/cop/ConstantFilter';

import {NodeParamsConfig, ParamConfig} from '../utils/params/ParamsConfig';
const DEFAULT = TexturePropertiesSopOperation.DEFAULT_PARAMS;
class TexturePropertiesSopParamsConfig extends NodeParamsConfig {
	/** @param sets if this node should search through the materials inside the whole hierarchy */
	apply_to_children = ParamConfig.BOOLEAN(DEFAULT.apply_to_children);
	separator = ParamConfig.SEPARATOR();
	// anisotropy
	/** @param toggle on to update the anisotropy */
	tanisotropy = ParamConfig.BOOLEAN(DEFAULT.tanisotropy);
	/** @param sets if the anisotropy should be set to the max capabilities of the renderer */
	use_renderer_max_anisotropy = ParamConfig.BOOLEAN(DEFAULT.use_renderer_max_anisotropy, {
		visible_if: {tanisotropy: 1},
	});
	/** @param anisotropy value */
	anisotropy = ParamConfig.INTEGER(DEFAULT.anisotropy, {
		visible_if: {tanisotropy: 1, use_renderer_max_anisotropy: 0},
		range: [0, 32],
		range_locked: [true, false],
	});
	// filters
	/** @param toggle on to update min filter */
	tmin_filter = ParamConfig.BOOLEAN(0);
	/** @param min filter value */
	min_filter = ParamConfig.INTEGER(DEFAULT.min_filter, {
		visible_if: {tmin_filter: 1},
		menu: {
			entries: MIN_FILTER_MENU_ENTRIES,
		},
	});
	/** @param toggle on to update mag filter */
	tmag_filter = ParamConfig.BOOLEAN(0);
	/** @param mag filter value */
	mag_filter = ParamConfig.INTEGER(DEFAULT.mag_filter, {
		visible_if: {tmag_filter: 1},
		menu: {
			entries: MAG_FILTER_MENU_ENTRIES,
		},
	});
}
const ParamsConfig = new TexturePropertiesSopParamsConfig();

export class TexturePropertiesSopNode extends TypedSopNode<TexturePropertiesSopParamsConfig> {
	params_config = ParamsConfig;
	static type() {
		return 'texture_properties';
	}

	static displayed_input_names(): string[] {
		return ['objects with textures to change properties of'];
	}

	initialize_node() {
		this.io.inputs.set_count(1);
		this.io.inputs.init_inputs_cloned_state(TexturePropertiesSopOperation.INPUT_CLONED_STATE);
	}

	private _operation: TexturePropertiesSopOperation | undefined;
	async cook(input_contents: CoreGroup[]) {
		this._operation = this._operation || new TexturePropertiesSopOperation(this.scene, this.states);
		const core_group = await this._operation.cook(input_contents, this.pv);
		this.set_core_group(core_group);
	}
}
