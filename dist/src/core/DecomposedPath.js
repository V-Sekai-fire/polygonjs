import {CoreWalker} from "./Walker";
export class DecomposedPath {
  constructor() {
    this.index = -1;
    this.path_elements = [];
    this._named_nodes = [];
    this.graph_node_ids = [];
    this.node_element_by_graph_node_id = new Map();
  }
  reset() {
    this.index = -1;
    this.path_elements = [];
    this._named_nodes = [];
    this.graph_node_ids = [];
    this.node_element_by_graph_node_id.clear();
  }
  add_node(name, node) {
    this.index += 1;
    if (name == node.name) {
      this._named_nodes[this.index] = node;
    }
    this.graph_node_ids[this.index] = node.graph_node_id;
    this.node_element_by_graph_node_id.set(node.graph_node_id, name);
  }
  add_path_element(path_element) {
    this.index += 1;
    this.path_elements[this.index] = path_element;
  }
  named_graph_nodes() {
    return this._named_nodes;
  }
  named_nodes() {
    const nodes = [];
    for (let graph_node of this._named_nodes) {
      if (graph_node) {
        const node = graph_node;
        if (node.name_controller) {
          nodes.push(node);
        }
      }
    }
    return nodes;
  }
  update_from_name_change(node) {
    const named_graph_node_ids = this._named_nodes.map((n) => n?.graph_node_id);
    if (named_graph_node_ids.includes(node.graph_node_id)) {
      this.node_element_by_graph_node_id.set(node.graph_node_id, node.name);
    }
  }
  to_path() {
    const elements = new Array(this.index);
    for (let i = 0; i <= this.index; i++) {
      const node = this._named_nodes[i];
      if (node) {
        const node_name = this.node_element_by_graph_node_id.get(node.graph_node_id);
        if (node_name) {
          elements[i] = node_name;
        }
      } else {
        const path_element = this.path_elements[i];
        if (path_element) {
          elements[i] = path_element;
        }
      }
    }
    let joined_path = elements.join(CoreWalker.SEPARATOR);
    const first_char = joined_path[0];
    if (first_char) {
      if (!CoreWalker.NON_LETTER_PREFIXES.includes(first_char)) {
        joined_path = `${CoreWalker.SEPARATOR}${joined_path}`;
      }
    }
    return joined_path;
  }
}
