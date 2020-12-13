import {BaseMethod} from "./_Base";
import {CoreString} from "../../../core/String";
export class OpdigitsExpression extends BaseMethod {
  constructor() {
    super(...arguments);
    this._require_dependency = true;
  }
  static required_arguments() {
    return [["string", "path to node"]];
  }
  find_dependency(index_or_path) {
    const graph_node = this.find_referenced_graph_node(index_or_path);
    if (graph_node) {
      const node = graph_node;
      if (node.name_controller) {
        const name_node = node.name_controller.graph_node;
        return this.create_dependency(name_node, index_or_path);
      }
    }
    return null;
  }
  process_arguments(args) {
    return new Promise((resolve, reject) => {
      if (args.length == 1) {
        const index_or_path = args[0];
        const node = this.get_referenced_node(index_or_path);
        if (node) {
          const name = node.name;
          const value = CoreString.tail_digits(name);
          resolve(value);
        } else {
          resolve(0);
        }
      } else {
        resolve(0);
      }
    });
  }
}
