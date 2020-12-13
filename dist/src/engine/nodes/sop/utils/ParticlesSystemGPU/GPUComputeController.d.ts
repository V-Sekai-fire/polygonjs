import { DataTexture } from 'three/src/textures/DataTexture';
import { CoreGroup } from '../../../../../core/geometry/Group';
import { GPUComputationRenderer, GPUComputationRendererVariable } from './GPUComputationRenderer';
import { ParticlesSystemGpuSopNode } from '../../ParticlesSystemGpu';
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer';
import { CorePoint } from '../../../../../core/geometry/Point';
import { ShaderName } from '../../../utils/shaders/ShaderName';
import { TextureAllocationsController } from '../../../gl/code/utils/TextureAllocationsController';
export declare enum ParticlesDataType {
    FLOAT = "float",
    HALF_FLOAT = "half"
}
export declare const PARTICLE_DATA_TYPES: ParticlesDataType[];
export declare class ParticlesSystemGpuComputeController {
    private node;
    protected _gpu_compute: GPUComputationRenderer | undefined;
    protected _simulation_restart_required: boolean;
    protected _renderer: WebGLRenderer | undefined;
    protected _particles_core_group: CoreGroup | undefined;
    protected _points: CorePoint[];
    private variables_by_name;
    private _all_variables;
    private _created_textures_by_name;
    private _shaders_by_name;
    protected _last_simulated_frame: number | undefined;
    protected _last_simulated_time: number | undefined;
    protected _delta_time: number;
    private _used_textures_size;
    private _persisted_texture_allocations_controller;
    constructor(node: ParticlesSystemGpuSopNode);
    set_persisted_texture_allocation_controller(controller: TextureAllocationsController): void;
    set_shaders_by_name(shaders_by_name: Map<ShaderName, string>): void;
    all_variables(): GPUComputationRendererVariable[];
    init(core_group: CoreGroup): Promise<void>;
    getCurrentRenderTarget(shader_name: ShaderName): import("three").WebGLRenderTarget | undefined;
    init_particle_group_points(core_group: CoreGroup): void;
    compute_similation_if_required(): void;
    private _compute_simulation;
    private _data_type;
    create_gpu_compute(): Promise<void>;
    private _graph_node;
    private _force_time_dependent;
    private _on_graph_node_dirty;
    private create_simulation_material_uniforms;
    private update_simulation_material_uniforms;
    private _init_particles_uvs;
    created_textures_by_name(): Map<ShaderName, DataTexture>;
    private _fill_textures;
    reset_gpu_compute(): void;
    set_restart_not_required(): void;
    reset_gpu_compute_and_set_dirty(): void;
    reset_particle_groups(): void;
    get initialized(): boolean;
    private _create_texture_render_targets;
    restart_simulation_if_required(): void;
    private _restart_simulation;
    private _get_points;
}
