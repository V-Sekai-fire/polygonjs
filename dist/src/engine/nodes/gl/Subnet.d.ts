import { TypedGlNode, BaseGlNodeType } from './_Base';
import { GlConnectionPointType } from '../utils/io/connections/Gl';
import { NodeParamsConfig } from '../utils/params/ParamsConfig';
import { ShadersCollectionController } from './code/utils/ShadersCollectionController';
import { NodeContext } from '../../poly/NodeContext';
import { GlNodeChildrenMap } from '../../poly/registers/nodes/Gl';
import { SubnetOutputGlNode } from './SubnetOutput';
import { SubnetInputGlNode } from './SubnetInput';
import { ParamsInitData } from '../utils/io/IOController';
export declare class TypedSubnetGlNode<K extends NodeParamsConfig> extends TypedGlNode<K> {
    protected _children_controller_context: NodeContext;
    initialize_node(): void;
    protected _expected_inputs_count(): number;
    protected _expected_input_types(): GlConnectionPointType[];
    protected _expected_output_types(): GlConnectionPointType[];
    protected _expected_input_name(index: number): string;
    protected _expected_output_name(index: number): string;
    child_expected_input_connection_point_types(): GlConnectionPointType[];
    child_expected_output_connection_point_types(): GlConnectionPointType[];
    child_expected_input_connection_point_name(index: number): string;
    child_expected_output_connection_point_name(index: number): string;
    createNode<S extends keyof GlNodeChildrenMap>(node_class: S, params_init_value_overrides?: ParamsInitData): GlNodeChildrenMap[S];
    createNode<K extends valueof<GlNodeChildrenMap>>(node_class: Constructor<K>, params_init_value_overrides?: ParamsInitData): K;
    children(): BaseGlNodeType[];
    nodes_by_type<K extends keyof GlNodeChildrenMap>(type: K): GlNodeChildrenMap[K][];
    set_lines_block_start(shaders_collection_controller: ShadersCollectionController, child_node: SubnetInputGlNode): void;
    set_lines_block_end(shaders_collection_controller: ShadersCollectionController, child_node: SubnetOutputGlNode): void;
    set_lines(shaders_collection_controller: ShadersCollectionController): void;
}
declare class SubnetGlParamsConfig extends NodeParamsConfig {
}
export declare class SubnetGlNode extends TypedSubnetGlNode<SubnetGlParamsConfig> {
    params_config: SubnetGlParamsConfig;
    static type(): string;
}
export {};
