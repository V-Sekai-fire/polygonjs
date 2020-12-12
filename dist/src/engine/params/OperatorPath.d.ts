import { BaseParamType } from './_Base';
import { TypedPathParam } from './_BasePath';
import { BaseNodeType } from '../nodes/_Base';
import { ParamType } from '../poly/ParamType';
import { ParamValuesTypeMap } from './types/ParamValuesTypeMap';
import { ParamInitValuesTypeMap } from './types/ParamInitValuesTypeMap';
import { NodeContext, BaseNodeByContextMap, ChildrenNodeMapByContextMap } from '../poly/NodeContext';
import { ParamConstructorMap } from './types/ParamConstructorMap';
export declare const OPERATOR_PATH_DEFAULT: {
    NODE: {
        UV: string;
        ENV_MAP: string;
    };
};
export declare class OperatorPathParam extends TypedPathParam<ParamType.OPERATOR_PATH> {
    private _found_node;
    private _found_node_with_expected_type;
    private _found_param;
    private _found_param_with_expected_type;
    static type(): ParamType;
    get default_value_serialized(): string;
    get raw_input_serialized(): string;
    get value_serialized(): string;
    protected _copy_value(param: OperatorPathParam): void;
    static are_raw_input_equal(raw_input1: ParamInitValuesTypeMap[ParamType.OPERATOR_PATH], raw_input2: ParamInitValuesTypeMap[ParamType.OPERATOR_PATH]): boolean;
    static are_values_equal(val1: ParamValuesTypeMap[ParamType.OPERATOR_PATH], val2: ParamValuesTypeMap[ParamType.OPERATOR_PATH]): boolean;
    get is_default(): boolean;
    protected process_raw_input(): void;
    protected process_computation(): Promise<void>;
    find_target(): void;
    private _assign_found_node;
    private _assign_found_param;
    found_node(): BaseNodeType | null;
    found_param(): BaseParamType | null;
    found_node_with_context<N extends NodeContext>(context: N): BaseNodeByContextMap[N] | undefined;
    found_node_with_context_and_type<N extends NodeContext, K extends keyof ChildrenNodeMapByContextMap[N]>(context: N, type_or_types: K | K[]): ChildrenNodeMapByContextMap[N][K] | undefined;
    found_param_with_type<T extends ParamType>(type: T): ParamConstructorMap[T] | undefined;
    found_node_with_expected_type(): BaseNodeType | null;
    private _expected_context;
    private _is_node_expected_context;
    private _expected_node_types;
    private _expected_param_type;
    private _is_node_expected_type;
    private _is_param_expected_type;
    notify_path_rebuild_required(node: BaseNodeType): void;
    notify_target_param_owner_params_updated(node: BaseNodeType): void;
}
