import {BaseNodeGlMathFunctionArg1GlNode} from "./_BaseMathFunction";
import Quaternion from "./gl/quaternion.glsl";
import {GlConnectionPointType} from "../utils/io/connections/Gl";
import {FunctionGLDefinition} from "./utils/GLDefinition";
export class QuatToAxisGlNode extends BaseNodeGlMathFunctionArg1GlNode {
  static type() {
    return "quat_to_axis";
  }
  initialize_node() {
    super.initialize_node();
    this.io.connection_points.set_input_name_function((index) => ["quat"][index]);
    this.io.connection_points.set_expected_input_types_function(() => [GlConnectionPointType.VEC4]);
    this.io.connection_points.set_expected_output_types_function(() => [GlConnectionPointType.VEC3]);
  }
  gl_method_name() {
    return "quat_to_axis";
  }
  gl_function_definitions() {
    return [new FunctionGLDefinition(this, Quaternion)];
  }
}
