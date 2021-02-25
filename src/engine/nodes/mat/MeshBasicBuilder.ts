/**
 * Creates a Mesh Basic Material, which can be extended with GL nodes.
 *
 * @remarks
 * This node can create children, which will be GL nodes. The GLSL code generated by the nodes will extend the Material.
 *
 */

import {NodeParamsConfig} from '../utils/params/ParamsConfig';
import {ColorParamConfig, ColorsController} from './utils/UniformsColorsController';
import {SideParamConfig, SideController} from './utils/SideController';
import {DepthController, DepthParamConfig} from './utils/DepthController';
import {SkinningParamConfig, SkinningController} from './utils/SkinningController';
import {TextureMapParamConfig, TextureMapController} from './utils/TextureMapController';
import {TextureAlphaMapParamConfig, TextureAlphaMapController} from './utils/TextureAlphaMapController';
import {ShaderAssemblerBasic} from '../gl/code/assemblers/materials/Basic';
import {TypedBuilderMatNode} from './_BaseBuilder';
import {Poly} from '../../Poly';
import {TextureAOMapController, TextureAOMapParamConfig} from './utils/TextureAOMapController';
import {AssemblerName} from '../../poly/registers/assemblers/_BaseRegister';
import {FogParamConfig, FogController} from './utils/UniformsFogController';
import {WireframeController, WireframeParamConfig} from './utils/WireframeShaderMaterialController';
import {TextureEnvMapController, TextureEnvMapParamConfig} from './utils/TextureEnvMapSimpleController';
import {DefaultFolderParamConfig} from './utils/DefaultFolder';
import {TexturesFolderParamConfig} from './utils/TexturesFolder';
import {AdvancedFolderParamConfig} from './utils/AdvancedFolder';
const CONTROLLER_OPTIONS = {
	uniforms: true,
};
interface Controllers {
	alphaMap: TextureAlphaMapController;
	aoMap: TextureAOMapController;
	depth: DepthController;
	envMap: TextureEnvMapController;
	map: TextureMapController;
}
class MeshBasicMatParamsConfig extends FogParamConfig(
	SkinningParamConfig(
		WireframeParamConfig(
			DepthParamConfig(
				SideParamConfig(
					/* advanced */
					AdvancedFolderParamConfig(
						TextureEnvMapParamConfig(
							TextureAOMapParamConfig(
								TextureAlphaMapParamConfig(
									TextureMapParamConfig(
										/* textures */
										TexturesFolderParamConfig(
											ColorParamConfig(DefaultFolderParamConfig(NodeParamsConfig))
										)
									)
								)
							)
						)
					)
				)
			)
		)
	)
) {}
const ParamsConfig = new MeshBasicMatParamsConfig();

export class MeshBasicBuilderMatNode extends TypedBuilderMatNode<ShaderAssemblerBasic, MeshBasicMatParamsConfig> {
	params_config = ParamsConfig;
	static type() {
		return 'meshBasicBuilder';
	}
	public usedAssembler(): Readonly<AssemblerName.GL_MESH_BASIC> {
		return AssemblerName.GL_MESH_BASIC;
	}
	protected _create_assembler_controller() {
		return Poly.assemblersRegister.assembler(this, this.usedAssembler());
	}
	readonly controllers: Controllers = {
		alphaMap: new TextureAlphaMapController(this, CONTROLLER_OPTIONS),
		aoMap: new TextureAOMapController(this, CONTROLLER_OPTIONS),
		depth: new DepthController(this),
		envMap: new TextureEnvMapController(this, CONTROLLER_OPTIONS),
		map: new TextureMapController(this, CONTROLLER_OPTIONS),
	};
	private controllerNames = Object.keys(this.controllers) as Array<keyof Controllers>;

	initializeNode() {
		this.params.onParamsCreated('init controllers', () => {
			for (let controllerName of this.controllerNames) {
				this.controllers[controllerName].initializeNode();
			}
		});
	}

	async cook() {
		this.compile_if_required();

		for (let controllerName of this.controllerNames) {
			this.controllers[controllerName].update();
		}
		ColorsController.update(this);
		FogController.update(this);
		SideController.update(this);
		SkinningController.update(this);
		WireframeController.update(this);

		this.setMaterial(this.material);
	}
}
