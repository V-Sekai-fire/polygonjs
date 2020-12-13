import {BaseMethod} from "./_Base";
import lodash_padStart from "lodash/padStart";
export class PadzeroExpression extends BaseMethod {
  static required_arguments() {
    return [["string", "number"]];
  }
  process_arguments(args) {
    return new Promise((resolve) => {
      const pad = args[0] || 2;
      const src_number = args[1] || 0;
      const unpadded = `${src_number}`;
      const padded = lodash_padStart(unpadded, pad, "0");
      resolve(padded);
    });
  }
}
