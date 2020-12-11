import { ParamType } from '../../poly/ParamType';
import { BooleanParamOptions, ButtonParamOptions, ColorParamOptions, FloatParamOptions, FolderParamOptions, IntegerParamOptions, OperatorPathParamOptions, RampParamOptions, SeparatorParamOptions, StringParamOptions, Vector2ParamOptions, Vector3ParamOptions, Vector4ParamOptions } from '../utils/OptionsController';
declare type ParamOptionsByTypeMapGeneric = {
    [key in ParamType]: object;
};
export interface ParamOptionsByTypeMap extends ParamOptionsByTypeMapGeneric {
    [ParamType.BOOLEAN]: BooleanParamOptions;
    [ParamType.BUTTON]: ButtonParamOptions;
    [ParamType.COLOR]: ColorParamOptions;
    [ParamType.FLOAT]: FloatParamOptions;
    [ParamType.FOLDER]: FolderParamOptions;
    [ParamType.INTEGER]: IntegerParamOptions;
    [ParamType.OPERATOR_PATH]: OperatorPathParamOptions;
    [ParamType.RAMP]: RampParamOptions;
    [ParamType.SEPARATOR]: SeparatorParamOptions;
    [ParamType.STRING]: StringParamOptions;
    [ParamType.VECTOR2]: Vector2ParamOptions;
    [ParamType.VECTOR3]: Vector3ParamOptions;
    [ParamType.VECTOR4]: Vector4ParamOptions;
}
export {};
