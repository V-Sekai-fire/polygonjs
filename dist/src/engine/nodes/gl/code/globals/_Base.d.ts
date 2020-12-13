import { GlobalsGlNode } from '../../Globals';
import { GlConnectionPointType } from '../../../utils/io/connections/Gl';
import { BaseGlNodeType } from '../../_Base';
import { ShadersCollectionController } from '../utils/ShadersCollectionController';
export declare abstract class GlobalsBaseController {
    private static __next_id;
    private _id;
    constructor();
    id(): number;
    handle_globals_node(globals_node: GlobalsGlNode, output_name: string, shaders_collection_controller: ShadersCollectionController): void;
    abstract read_attribute(node: BaseGlNodeType, gl_type: GlConnectionPointType, attrib_name: string, shaders_collection_controller: ShadersCollectionController): string | undefined;
}
