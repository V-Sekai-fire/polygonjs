import {BaseNodeGlMathFunctionArg4GlNode} from "./_BaseMathFunction";
import {ThreeToGl as ThreeToGl2} from "../../../core/ThreeToGl";
const DefaultValues = {
  mult: 1
};
var InputName;
(function(InputName2) {
  InputName2["VALUE"] = "value";
  InputName2["PRE_ADD"] = "pre_add";
  InputName2["MULT"] = "mult";
  InputName2["POST_ADD"] = "post_add";
})(InputName || (InputName = {}));
export class MultAddGlNode extends BaseNodeGlMathFunctionArg4GlNode {
  static type() {
    return "mult_add";
  }
  _gl_input_name(index) {
    return [InputName.VALUE, InputName.PRE_ADD, InputName.MULT, InputName.POST_ADD][index];
  }
  param_default_value(name) {
    return DefaultValues[name];
  }
  set_lines(shaders_collection_controller) {
    const value = ThreeToGl2.any(this.variable_for_input(InputName.VALUE));
    const pre_add = ThreeToGl2.any(this.variable_for_input(InputName.PRE_ADD));
    const mult = ThreeToGl2.any(this.variable_for_input(InputName.MULT));
    const post_add = ThreeToGl2.any(this.variable_for_input(InputName.POST_ADD));
    const gl_type = this._expected_output_types()[0];
    const out_name = this.io.outputs.named_output_connection_points[0].name;
    const out = this.gl_var_name(out_name);
    const body_line = `${gl_type} ${out} = (${mult}*(${value} + ${pre_add})) + ${post_add}`;
    shaders_collection_controller.add_body_lines(this, [body_line]);
  }
}
