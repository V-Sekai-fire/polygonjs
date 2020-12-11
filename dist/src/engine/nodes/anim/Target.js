import {TypedAnimNode} from "./_Base";
import {TimelineBuilder as TimelineBuilder2} from "../../../core/animation/TimelineBuilder";
var TargetType;
(function(TargetType2) {
  TargetType2["SCENE_GRAPH"] = "scene graph";
  TargetType2["NODE"] = "node";
})(TargetType || (TargetType = {}));
const TARGET_TYPES = [TargetType.SCENE_GRAPH, TargetType.NODE];
import {NodeParamsConfig, ParamConfig} from "../utils/params/ParamsConfig";
import {TypeAssert} from "../../poly/Assert";
import {PropertyTarget as PropertyTarget2} from "../../../core/animation/PropertyTarget";
import {AnimationUpdateCallback} from "../../../core/animation/UpdateCallback";
class TargetAnimParamsConfig extends NodeParamsConfig {
  constructor() {
    super(...arguments);
    this.type = ParamConfig.INTEGER(0, {
      menu: {
        entries: TARGET_TYPES.map((name, value) => {
          return {name, value};
        })
      }
    });
    this.node_path = ParamConfig.OPERATOR_PATH("/geo1", {
      visible_if: {type: TARGET_TYPES.indexOf(TargetType.NODE)}
    });
    this.object_mask = ParamConfig.STRING("/geo*", {
      visible_if: {type: TARGET_TYPES.indexOf(TargetType.SCENE_GRAPH)}
    });
    this.update_matrix = ParamConfig.BOOLEAN(0, {
      visible_if: {type: TARGET_TYPES.indexOf(TargetType.SCENE_GRAPH)}
    });
    this.print_resolve = ParamConfig.BUTTON(null, {
      callback: (node, param) => {
        TargetAnimNode.PARAM_CALLBACK_print_resolve(node);
      }
    });
  }
}
const ParamsConfig2 = new TargetAnimParamsConfig();
export class TargetAnimNode extends TypedAnimNode {
  constructor() {
    super(...arguments);
    this.params_config = ParamsConfig2;
  }
  static type() {
    return "target";
  }
  initialize_node() {
    this.io.inputs.set_count(0, 1);
    this.scene.dispatch_controller.on_add_listener(() => {
      this.params.on_params_created("params_label", () => {
        this.params.label.init([this.p.type, this.p.node_path, this.p.object_mask], () => {
          const type = TARGET_TYPES[this.pv.type];
          switch (type) {
            case TargetType.NODE:
              return this.pv.node_path;
            case TargetType.SCENE_GRAPH:
              return this.pv.object_mask;
          }
          TypeAssert.unreachable(type);
        });
      });
    });
  }
  cook(input_contents) {
    const timeline_builder = input_contents[0] || new TimelineBuilder2();
    const target = this._create_target(timeline_builder);
    timeline_builder.set_target(target);
    this._set_update_callback(timeline_builder);
    this.set_timeline_builder(timeline_builder);
  }
  _create_target(timeline_builder) {
    const type = TARGET_TYPES[this.pv.type];
    const property_target = new PropertyTarget2();
    switch (type) {
      case TargetType.NODE: {
        property_target.set_node_path(this.pv.node_path);
        return property_target;
      }
      case TargetType.SCENE_GRAPH: {
        property_target.set_object_mask(this.pv.object_mask);
        return property_target;
      }
    }
    TypeAssert.unreachable(type);
  }
  _set_update_callback(timeline_builder) {
    const type = TARGET_TYPES[this.pv.type];
    let update_callback = timeline_builder.update_callback();
    switch (type) {
      case TargetType.NODE: {
        return;
      }
      case TargetType.SCENE_GRAPH: {
        if (this.pv.update_matrix) {
          update_callback = update_callback || new AnimationUpdateCallback();
          update_callback.set_update_matrix(this.pv.update_matrix);
          timeline_builder.set_update_callback(update_callback);
        }
        return;
      }
    }
    TypeAssert.unreachable(type);
  }
  static PARAM_CALLBACK_print_resolve(node) {
    node.print_resolve();
  }
  print_resolve() {
    const type = TARGET_TYPES[this.pv.type];
    const timeline_builder = new TimelineBuilder2();
    const target = this._create_target(timeline_builder);
    switch (type) {
      case TargetType.NODE: {
        return console.log(target.node(this.scene));
      }
      case TargetType.SCENE_GRAPH: {
        return console.log(target.objects(this.scene));
      }
    }
  }
}
