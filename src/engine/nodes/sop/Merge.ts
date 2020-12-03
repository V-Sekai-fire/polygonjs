import {TypedSopNode} from './_Base';
import {CoreGroup} from '../../../core/geometry/Group';
import {MergeSopOperation} from '../../../core/operations/sop/Merge';

const INPUT_NAME = 'geometry to merge';

import {NodeParamsConfig, ParamConfig} from '../utils/params/ParamsConfig';
const DEFAULT = MergeSopOperation.DEFAULT_PARAMS;
class MergeSopParamsConfig extends NodeParamsConfig {
	compact = ParamConfig.BOOLEAN(DEFAULT.compact);
}
const ParamsConfig = new MergeSopParamsConfig();

export class MergeSopNode extends TypedSopNode<MergeSopParamsConfig> {
	params_config = ParamsConfig;
	static type() {
		return 'merge';
	}

	static displayed_input_names(): string[] {
		return [INPUT_NAME, INPUT_NAME, INPUT_NAME, INPUT_NAME];
	}

	initialize_node() {
		this.io.inputs.set_count(1, 4);
		this.io.inputs.init_inputs_cloned_state(MergeSopOperation.INPUT_CLONED_STATE);

		// this.ui_data.set_icon('compress-arrows-alt');
		this.scene.dispatch_controller.on_add_listener(() => {
			this.params.on_params_created('params_label', () => {
				this.params.label.init([this.p.compact], () => {
					return this.pv.compact ? 'compact' : 'separate objects';
				});
			});
		});
	}

	private _operation: MergeSopOperation | undefined;
	cook(input_contents: CoreGroup[]) {
		this._operation = this._operation || new MergeSopOperation(this.scene, this.states);
		const core_group = this._operation.cook(input_contents, this.pv);
		this.set_core_group(core_group);
	}
}
