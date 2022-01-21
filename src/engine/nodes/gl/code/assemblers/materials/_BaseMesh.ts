import {ShaderAssemblerMaterial, CustomAssemblerMap, CustomMaterialName} from './_BaseMaterial';

import {ShaderAssemblerCustomMeshDistance} from './CustomMeshDistance';
import {ShaderAssemblerCustomMeshDepth} from './CustomMeshDepth';
import {ShaderAssemblerCustomMeshDepthDOF} from './CustomMeshDepthDOF';

const ASSEMBLER_MAP: CustomAssemblerMap = new Map([
	// [CustomMaterialName.DISTANCE, ShaderAssemblerCustomMeshDistance],
	// [CustomMaterialName.DEPTH, ShaderAssemblerCustomMeshDepth],
	// [CustomMaterialName.DEPTH_DOF, ShaderAssemblerCustomMeshDepthDOF],
]);
ASSEMBLER_MAP.set(CustomMaterialName.DEPTH, ShaderAssemblerCustomMeshDepth); // for spot lights and directional
ASSEMBLER_MAP.set(CustomMaterialName.DISTANCE, ShaderAssemblerCustomMeshDistance); // for point lights
ASSEMBLER_MAP.set(CustomMaterialName.DEPTH_DOF, ShaderAssemblerCustomMeshDepthDOF); // for ??? (would it be DOF post effect?)

export abstract class ShaderAssemblerMesh extends ShaderAssemblerMaterial {
	// TODO: I've noticed a case where instances would not display when those shadow shaders were exported
	// But the objects display fine if those are not assigned
	// so it could be a bug at render time (not sure if my code, threejs or hardware)
	custom_assembler_class_by_custom_name(): CustomAssemblerMap {
		return ASSEMBLER_MAP;
	}
}
