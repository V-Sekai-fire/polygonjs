/**
 * Creates rest attributes.
 *
 */
import {TypedSopNode} from './_Base';
import {CoreGroup} from '../../../core/geometry/Group';
import {InputCloneMode} from '../../poly/InputCloneMode';

import {RestAttributesSopOperation} from '../../../core/operations/sop/RestAttributes';
import {NodeParamsConfig, ParamConfig} from '../utils/params/ParamsConfig';
const DEFAULT = RestAttributesSopOperation.DEFAULT_PARAMS;
class RestAttributesSopParamsConfig extends NodeParamsConfig {
	/** @param toggle on to create a rest position */
	tposition = ParamConfig.BOOLEAN(DEFAULT.tposition);
	/** @param name of the position attribute */
	position = ParamConfig.STRING(DEFAULT.position, {visibleIf: {tposition: true}});
	/** @param name of the rest position attribute, on which the position will be copied on */
	restP = ParamConfig.STRING(DEFAULT.restP, {visibleIf: {tposition: true}});
	/** @param toggle on to create a rest normal */
	tnormal = ParamConfig.BOOLEAN(DEFAULT.tnormal);
	/** @param name of the normal attribute */
	normal = ParamConfig.STRING(DEFAULT.normal, {visibleIf: {tnormal: true}});
	/** @param name of the rest normal attribute, on which the normal will be copied on */
	restN = ParamConfig.STRING(DEFAULT.restN, {visibleIf: {tposition: true}});
}
const ParamsConfig = new RestAttributesSopParamsConfig();

export class RestAttributesSopNode extends TypedSopNode<RestAttributesSopParamsConfig> {
	params_config = ParamsConfig;
	static type() {
		return 'restAttributes';
	}

	initialize_node() {
		this.io.inputs.set_count(1);
		this.io.inputs.init_inputs_cloned_state([InputCloneMode.FROM_NODE]);
	}

	private _operation: RestAttributesSopOperation | undefined;
	cook(input_contents: CoreGroup[]) {
		this._operation = this._operation || new RestAttributesSopOperation(this.scene, this.states);
		const core_group = this._operation.cook(input_contents, this.pv);
		this.set_core_group(core_group);
	}
}