import {BaseNodeType} from '../../nodes/_Base';
import {CoreGraphNodeId} from '../../../core/graph/CoreGraph';

type Callback = (value: void) => void;

export class CookController {
	private _cooking_nodes_by_id: Map<CoreGraphNodeId, BaseNodeType> = new Map();
	private _resolves: Callback[] = [];
	constructor() {}

	add_node(node: BaseNodeType) {
		this._cooking_nodes_by_id.set(node.graph_node_id, node);
	}
	remove_node(node: BaseNodeType) {
		this._cooking_nodes_by_id.delete(node.graph_node_id);

		if (this._cooking_nodes_by_id.size == 0) {
			this.flush();
		}
	}

	private flush() {
		let callback: Callback | undefined;
		while ((callback = this._resolves.pop())) {
			callback();
		}
	}

	async waitForCooksCompleted(): Promise<void> {
		if (this._cooking_nodes_by_id.size == 0) {
			return;
		} else {
			return new Promise((resolve, reject) => {
				this._resolves.push(resolve);
			});
		}
	}
}
