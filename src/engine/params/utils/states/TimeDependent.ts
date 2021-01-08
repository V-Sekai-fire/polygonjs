import {BaseParamType} from '../../_Base';

export class TimeDependentState {
	constructor(protected param: BaseParamType) {}

	get active(): boolean {
		const frame_graph_node_id = this.param.scene.timeController.graph_node.graph_node_id;

		return this.param.graph_predecessor_ids().includes(frame_graph_node_id);
	}
}
