import {Constructor} from '../../../../types/GlobalTypes';
import {TypedObjNode} from '../_Base';
import {Object3D} from 'three';
import {NodeParamsConfig, ParamConfig} from '../../utils/params/ParamsConfig';
import {OBJCADTesselationParamConfig} from '../../../../core/geometry/cad/utils/TesselationParamsConfig';
import {OBJCSGTesselationParamConfig} from '../../../../core/geometry/csg/utils/TesselationParamsConfig';

export function ObjCADTesselationFolderParamConfig<TBase extends Constructor>(Base: TBase) {
	return class Mixin extends Base {
		CAD = ParamConfig.FOLDER();
	};
}
export function ObjCSGTesselationFolderParamConfig<TBase extends Constructor>(Base: TBase) {
	return class Mixin extends Base {
		CSG = ParamConfig.FOLDER();
	};
}
export function ObjTesselationParamConfig<TBase extends Constructor>(Base: TBase) {
	return class Mixin extends OBJCSGTesselationParamConfig(
		ObjCSGTesselationFolderParamConfig(OBJCADTesselationParamConfig(ObjCADTesselationFolderParamConfig(Base)))
	) {};
}
class TesselationParamParamsConfig extends ObjTesselationParamConfig(NodeParamsConfig) {}
export class TesselationParamsObjNode extends TypedObjNode<Object3D, TesselationParamParamsConfig> {}
