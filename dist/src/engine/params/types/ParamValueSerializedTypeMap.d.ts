import { RampValueJson } from '../ramp/RampValue';
import { ParamType } from '../../poly/ParamType';
import { ParamInitValuesTypeMap } from './ParamInitValuesTypeMap';
declare type ParamValueSerializedTypeMapGeneric = {
    [key in ParamType]: any;
};
export interface ParamValueSerializedTypeMap extends ParamValueSerializedTypeMapGeneric {
    [ParamType.BOOLEAN]: boolean;
    [ParamType.BUTTON]: ParamInitValuesTypeMap[ParamType.BUTTON];
    [ParamType.COLOR]: Number3;
    [ParamType.FLOAT]: number;
    [ParamType.FOLDER]: null;
    [ParamType.INTEGER]: number;
    [ParamType.OPERATOR_PATH]: ParamInitValuesTypeMap[ParamType.OPERATOR_PATH];
    [ParamType.RAMP]: RampValueJson;
    [ParamType.SEPARATOR]: ParamInitValuesTypeMap[ParamType.SEPARATOR];
    [ParamType.STRING]: ParamInitValuesTypeMap[ParamType.STRING];
    [ParamType.VECTOR2]: Number2;
    [ParamType.VECTOR3]: Number3;
    [ParamType.VECTOR4]: Number4;
}
declare type ParamValuePreConversionSerializedTypeMapGeneric = {
    [key in ParamType]: any;
};
export interface ParamValuePreConversionSerializedTypeMap extends ParamValuePreConversionSerializedTypeMapGeneric {
    [ParamType.BOOLEAN]: undefined;
    [ParamType.BUTTON]: undefined;
    [ParamType.COLOR]: Number3;
    [ParamType.FLOAT]: undefined;
    [ParamType.FOLDER]: undefined;
    [ParamType.INTEGER]: undefined;
    [ParamType.OPERATOR_PATH]: undefined;
    [ParamType.RAMP]: undefined;
    [ParamType.SEPARATOR]: undefined;
    [ParamType.STRING]: undefined;
    [ParamType.VECTOR2]: undefined;
    [ParamType.VECTOR3]: undefined;
    [ParamType.VECTOR4]: undefined;
}
export {};
