import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera';
import { TypedThreejsCameraObjNode } from './_BaseCamera';
import { NodeParamsConfig } from '../utils/params/ParamsConfig';
import { CameraNodeType } from '../../poly/NodeContext';
export declare function PerspectiveCameraObjParamConfigMixin<TBase extends Constructor>(Base: TBase): {
    new (...args: any[]): {
        fov: import("../utils/params/ParamsConfig").ParamTemplate<import("../../poly/ParamType").ParamType.FLOAT>;
    };
} & TBase;
declare const PerspectiveCameraObjParamConfig_base: {
    new (...args: any[]): {
        do_post_process: import("../utils/params/ParamsConfig").ParamTemplate<import("../../poly/ParamType").ParamType.BOOLEAN>;
        post_process_node: import("../utils/params/ParamsConfig").ParamTemplate<import("../../poly/ParamType").ParamType.OPERATOR_PATH>;
    };
} & {
    new (...args: any[]): {
        render: import("../utils/params/ParamsConfig").ParamTemplate<import("../../poly/ParamType").ParamType.FOLDER>;
        set_scene: import("../utils/params/ParamsConfig").ParamTemplate<import("../../poly/ParamType").ParamType.BOOLEAN>;
        scene: import("../utils/params/ParamsConfig").ParamTemplate<import("../../poly/ParamType").ParamType.OPERATOR_PATH>;
        set_renderer: import("../utils/params/ParamsConfig").ParamTemplate<import("../../poly/ParamType").ParamType.BOOLEAN>;
        renderer: import("../utils/params/ParamsConfig").ParamTemplate<import("../../poly/ParamType").ParamType.OPERATOR_PATH>;
        set_css_renderer: import("../utils/params/ParamsConfig").ParamTemplate<import("../../poly/ParamType").ParamType.BOOLEAN>;
        css_renderer: import("../utils/params/ParamsConfig").ParamTemplate<import("../../poly/ParamType").ParamType.OPERATOR_PATH>;
    };
} & {
    new (...args: any[]): {
        layer: import("../utils/params/ParamsConfig").ParamTemplate<import("../../poly/ParamType").ParamType.INTEGER>;
    };
} & {
    new (...args: any[]): {
        set_master_camera: import("../utils/params/ParamsConfig").ParamTemplate<import("../../poly/ParamType").ParamType.BUTTON>;
    };
} & {
    new (...args: any[]): {
        fov: import("../utils/params/ParamsConfig").ParamTemplate<import("../../poly/ParamType").ParamType.FLOAT>;
    };
} & {
    new (...args: any[]): {
        camera: import("../utils/params/ParamsConfig").ParamTemplate<import("../../poly/ParamType").ParamType.FOLDER>;
        controls: import("../utils/params/ParamsConfig").ParamTemplate<import("../../poly/ParamType").ParamType.OPERATOR_PATH>;
        update_from_controls_mode: import("../utils/params/ParamsConfig").ParamTemplate<import("../../poly/ParamType").ParamType.INTEGER>;
        allow_update_from_controls: import("../utils/params/ParamsConfig").ParamTemplate<import("../../poly/ParamType").ParamType.BOOLEAN>;
        near: import("../utils/params/ParamsConfig").ParamTemplate<import("../../poly/ParamType").ParamType.FLOAT>;
        far: import("../utils/params/ParamsConfig").ParamTemplate<import("../../poly/ParamType").ParamType.FLOAT>;
        display: import("../utils/params/ParamsConfig").ParamTemplate<import("../../poly/ParamType").ParamType.BOOLEAN>;
    };
} & {
    new (...args: any[]): {
        transform: import("../utils/params/ParamsConfig").ParamTemplate<import("../../poly/ParamType").ParamType.FOLDER>;
        keep_pos_when_parenting: import("../utils/params/ParamsConfig").ParamTemplate<import("../../poly/ParamType").ParamType.BOOLEAN>;
        rotation_order: import("../utils/params/ParamsConfig").ParamTemplate<import("../../poly/ParamType").ParamType.INTEGER>;
        t: import("../utils/params/ParamsConfig").ParamTemplate<import("../../poly/ParamType").ParamType.VECTOR3>;
        r: import("../utils/params/ParamsConfig").ParamTemplate<import("../../poly/ParamType").ParamType.VECTOR3>;
        s: import("../utils/params/ParamsConfig").ParamTemplate<import("../../poly/ParamType").ParamType.VECTOR3>;
        scale: import("../utils/params/ParamsConfig").ParamTemplate<import("../../poly/ParamType").ParamType.FLOAT>;
        matrix_auto_update: import("../utils/params/ParamsConfig").ParamTemplate<import("../../poly/ParamType").ParamType.BOOLEAN>;
        tlook_at: import("../utils/params/ParamsConfig").ParamTemplate<import("../../poly/ParamType").ParamType.BOOLEAN>;
        look_at_pos: import("../utils/params/ParamsConfig").ParamTemplate<import("../../poly/ParamType").ParamType.VECTOR3>;
        up: import("../utils/params/ParamsConfig").ParamTemplate<import("../../poly/ParamType").ParamType.VECTOR3>;
    };
} & typeof NodeParamsConfig;
declare class PerspectiveCameraObjParamConfig extends PerspectiveCameraObjParamConfig_base {
}
export declare class PerspectiveCameraObjNode extends TypedThreejsCameraObjNode<PerspectiveCamera, PerspectiveCameraObjParamConfig> {
    params_config: PerspectiveCameraObjParamConfig;
    static type(): Readonly<CameraNodeType.PERSPECTIVE>;
    create_object(): PerspectiveCamera;
    update_camera(): void;
    protected _update_for_aspect_ratio(): void;
}
export {};
