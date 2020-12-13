import { Material } from 'three/src/materials/Material';
import { TypedMatNode } from '../_Base';
import { BaseController } from './_BaseController';
import { NodeParamsConfig } from '../../utils/params/ParamsConfig';
export declare function DepthParamConfig<TBase extends Constructor>(Base: TBase): {
    new (...args: any[]): {
        /** @param defines if the objects using this material will be rendered in the depth buffer. This can often helps transparent objects */
        depth_write: import("../../utils/params/ParamsConfig").ParamTemplate<import("../../../poly/ParamType").ParamType.BOOLEAN>;
        /** @param toggle depth test */
        depth_test: import("../../utils/params/ParamsConfig").ParamTemplate<import("../../../poly/ParamType").ParamType.BOOLEAN>;
    };
} & TBase;
declare const DepthParamsConfig_base: {
    new (...args: any[]): {
        /** @param defines if the objects using this material will be rendered in the depth buffer. This can often helps transparent objects */
        depth_write: import("../../utils/params/ParamsConfig").ParamTemplate<import("../../../poly/ParamType").ParamType.BOOLEAN>;
        /** @param toggle depth test */
        depth_test: import("../../utils/params/ParamsConfig").ParamTemplate<import("../../../poly/ParamType").ParamType.BOOLEAN>;
    };
} & typeof NodeParamsConfig;
declare class DepthParamsConfig extends DepthParamsConfig_base {
}
declare abstract class DepthMapMatNode extends TypedMatNode<Material, DepthParamsConfig> {
    depth_controller: DepthController;
    abstract create_material(): Material;
}
export declare class DepthController extends BaseController {
    protected node: DepthMapMatNode;
    constructor(node: DepthMapMatNode);
    update(): Promise<void>;
    static update(node: DepthMapMatNode): Promise<void>;
}
export {};
