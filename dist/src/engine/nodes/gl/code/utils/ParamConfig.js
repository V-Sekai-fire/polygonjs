import {Vector4 as Vector42} from "three/src/math/Vector4";
import {Vector3 as Vector32} from "three/src/math/Vector3";
import {Vector2 as Vector22} from "three/src/math/Vector2";
import {Color as Color2} from "three/src/math/Color";
import {ParamType as ParamType2} from "../../../../poly/ParamType";
import {TypeAssert} from "../../../../poly/Assert";
import {ParamConfig as ParamConfig2} from "../../../utils/code/configs/ParamConfig";
export class GlParamConfig extends ParamConfig2 {
  constructor(_type, _name, _default_value, _uniform_name) {
    super(_type, _name, _default_value);
    this._uniform_name = _uniform_name;
  }
  get uniform_name() {
    return this._uniform_name;
  }
  get uniform() {
    return this._uniform = this._uniform || this._create_uniform();
  }
  _create_uniform() {
    return GlParamConfig.uniform_by_type(this._type);
  }
  execute_callback(node, param) {
    this._callback(node, param);
  }
  _callback(node, param) {
    GlParamConfig.callback(param, this.uniform);
  }
  static callback(param, uniform) {
    switch (param.type) {
      case ParamType2.RAMP:
        uniform.value = param.ramp_texture();
        return;
      case ParamType2.OPERATOR_PATH:
        GlParamConfig.set_uniform_value_from_texture(param, uniform);
        return;
      default:
        uniform.value = param.value;
    }
  }
  static uniform_by_type(type) {
    switch (type) {
      case ParamType2.BOOLEAN:
        return {value: 0};
      case ParamType2.BUTTON:
        return {value: 0};
      case ParamType2.COLOR:
        return {value: new Color2(0, 0, 0)};
      case ParamType2.FLOAT:
        return {value: 0};
      case ParamType2.FOLDER:
        return {value: 0};
      case ParamType2.INTEGER:
        return {value: 0};
      case ParamType2.OPERATOR_PATH:
        return {value: 0};
      case ParamType2.NODE_PATH:
        return {value: 0};
      case ParamType2.RAMP:
        return {value: null};
      case ParamType2.SEPARATOR:
        return {value: 0};
      case ParamType2.STRING:
        return {value: null};
      case ParamType2.VECTOR2:
        return {value: new Vector22(0, 0)};
      case ParamType2.VECTOR3:
        return {value: new Vector32(0, 0, 0)};
      case ParamType2.VECTOR4:
        return {value: new Vector42(0, 0, 0, 0)};
    }
    TypeAssert.unreachable(type);
  }
  static set_uniform_value_from_texture(param, uniform) {
    const found_node = param.found_node();
    if (found_node) {
      if (found_node.is_dirty) {
        found_node.request_container().then((container) => {
          const texture = container.texture();
          uniform.value = texture;
        });
      } else {
        const container = found_node.container_controller.container;
        const texture = container.texture();
        uniform.value = texture;
      }
    } else {
      uniform.value = null;
    }
  }
  set_uniform_value_from_ramp(param, uniform) {
    uniform.value = param.ramp_texture();
  }
}
