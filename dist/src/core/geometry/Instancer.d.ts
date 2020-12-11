import { Matrix4 } from 'three/src/math/Matrix4';
import { InstancedBufferGeometry } from 'three/src/core/InstancedBufferGeometry';
import { CorePoint } from './Point';
import { CoreGroup } from './Group';
import { BufferGeometry } from 'three/src/core/BufferGeometry';
export declare class CoreInstancer {
    private _group_wrapper;
    private _is_pscale_present;
    private _is_scale_present;
    private _is_normal_present;
    private _is_up_present;
    private _do_rotate_matrices;
    private _matrices;
    constructor(_group_wrapper: CoreGroup);
    matrices(): Matrix4[];
    private _point_scale;
    private _point_normal;
    private _point_up;
    _matrix_from_point(point: CorePoint, matrix: Matrix4): void;
    private static _point_color;
    private static _point_uv;
    static create_instance_buffer_geo(geometry_to_instance: BufferGeometry, template_core_group: CoreGroup, attributes_to_copy: string): InstancedBufferGeometry;
}
