import lodash_isNumber from "lodash/isNumber";
import lodash_isBoolean from "lodash/isBoolean";
import {TypedNumericParam} from "./_Numeric";
import {ParamType as ParamType2} from "../poly/ParamType";
import {CoreString} from "../../core/String";
import lodash_isString from "lodash/isString";
import lodash_isArray from "lodash/isArray";
export class IntegerParam extends TypedNumericParam {
  static type() {
    return ParamType2.INTEGER;
  }
  get default_value_serialized() {
    return this.default_value;
  }
  get raw_input_serialized() {
    return this.raw_input;
  }
  get value_serialized() {
    return this.value;
  }
  _copy_value(param) {
    this.set(param.value_serialized);
  }
  _prefilter_invalid_raw_input(raw_input) {
    if (lodash_isArray(raw_input)) {
      return raw_input[0];
    }
    if (lodash_isString(raw_input) && CoreString.is_number(raw_input)) {
      return parseInt(raw_input);
    }
    return raw_input;
  }
  static are_raw_input_equal(raw_input1, raw_input2) {
    return raw_input1 == raw_input2;
  }
  static are_values_equal(val1, val2) {
    return val1 == val2;
  }
  static convert(raw_val) {
    if (lodash_isNumber(raw_val)) {
      return Math.round(raw_val);
    } else {
      if (lodash_isBoolean(raw_val)) {
        return raw_val ? 1 : 0;
      } else {
        if (CoreString.is_number(raw_val)) {
          const parsed = parseInt(raw_val);
          if (lodash_isNumber(parsed)) {
            return parsed;
          }
        }
      }
      return null;
    }
  }
  convert(raw_val) {
    const result = IntegerParam.convert(raw_val);
    if (result) {
      return this.options.ensure_in_range(result);
    } else {
      return result;
    }
  }
}
