import { TypedParam } from './_Base';
import { BaseNodeType } from '../nodes/_Base';
import { ParamType } from '../poly/ParamType';
import { DecomposedPath } from '../../core/DecomposedPath';
export declare abstract class TypedPathParam<T extends ParamType> extends TypedParam<T> {
    readonly decomposed_path: DecomposedPath;
    abstract notify_path_rebuild_required(node: BaseNodeType): void;
    abstract notify_target_param_owner_params_updated(node: BaseNodeType): void;
}
