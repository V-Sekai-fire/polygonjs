/**
 * Creates a Mesh Phong Material, which can be extended with GL nodes.
 *
 * @remarks
 * This node can create children, which will be GL nodes. The GLSL code generated by the nodes will extend the Material.
 *
 */
import {NodeParamsConfig} from '../utils/params/ParamsConfig';
import {ColorParamConfig, ColorsController} from './utils/UniformsColorsController';
import {AdvancedCommonController, AdvancedCommonParamConfig} from './utils/AdvancedCommonController';
import {SkinningParamConfig, SkinningController} from './utils/SkinningController';
import {MapParamConfig, TextureMapController} from './utils/TextureMapController';
import {AlphaMapParamConfig, TextureAlphaMapController} from './utils/TextureAlphaMapController';
import {TypedBuilderMatNode} from './_BaseBuilder';
import {ShaderAssemblerPhong} from '../gl/code/assemblers/materials/Phong';
import {AssemblerName} from '../../poly/registers/assemblers/_BaseRegister';
import {Poly} from '../../Poly';
import {FogParamConfig, FogController} from './utils/UniformsFogController';
import {WireframeController, WireframeParamConfig} from './utils/WireframeShaderMaterialController';
import {TextureAOMapController, AOMapParamConfig} from './utils/TextureAOMapController';
import {TextureEnvMapController, EnvMapParamConfig} from './utils/TextureEnvMapSimpleController';
import {TextureLightMapController, LightMapParamConfig} from './utils/TextureLightMapController';
import {TextureEmissiveMapController, EmissiveMapParamConfig} from './utils/TextureEmissiveMapController';

import {DefaultFolderParamConfig} from './utils/DefaultFolder';
import {TexturesFolderParamConfig} from './utils/TexturesFolder';
import {AdvancedFolderParamConfig} from './utils/AdvancedFolder';
import {TextureBumpMapController, BumpMapParamConfig} from './utils/TextureBumpMapController';
import {TextureDisplacementMapController, DisplacementMapParamConfig} from './utils/TextureDisplacementMapController';
import {TextureNormalMapController, NormalMapParamConfig} from './utils/TextureNormalMapController';
import {TextureSpecularMapController, SpecularMapParamConfig} from './utils/TextureSpecularMapController';

const CONTROLLER_OPTIONS = {
	uniforms: true,
};
interface Controllers {
	advancedCommon: AdvancedCommonController;
	alphaMap: TextureAlphaMapController;
	aoMap: TextureAOMapController;
	bumpMap: TextureBumpMapController;
	displacementMap: TextureDisplacementMapController;
	emissiveMap: TextureEmissiveMapController;
	envMap: TextureEnvMapController;
	lightMap: TextureLightMapController;
	map: TextureMapController;
	normalMap: TextureNormalMapController;
	specularMap: TextureSpecularMapController;
}
class MeshPhongMatParamsConfig extends FogParamConfig(
	SkinningParamConfig(
		WireframeParamConfig(
			AdvancedCommonParamConfig(
				/* advanced */
				AdvancedFolderParamConfig(
					SpecularMapParamConfig(
						NormalMapParamConfig(
							LightMapParamConfig(
								EnvMapParamConfig(
									EmissiveMapParamConfig(
										DisplacementMapParamConfig(
											BumpMapParamConfig(
												AOMapParamConfig(
													AlphaMapParamConfig(
														MapParamConfig(
															/* textures */
															TexturesFolderParamConfig(
																ColorParamConfig(
																	DefaultFolderParamConfig(NodeParamsConfig)
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
						)
					)
				)
			)
		)
	)
) {}
const ParamsConfig = new MeshPhongMatParamsConfig();

export class MeshPhongBuilderMatNode extends TypedBuilderMatNode<ShaderAssemblerPhong, MeshPhongMatParamsConfig> {
	params_config = ParamsConfig;
	static type() {
		return 'meshPhongBuilder';
	}
	public usedAssembler(): Readonly<AssemblerName.GL_MESH_PHONG> {
		return AssemblerName.GL_MESH_PHONG;
	}
	protected _create_assembler_controller() {
		return Poly.assemblersRegister.assembler(this, this.usedAssembler());
	}
	readonly controllers: Controllers = {
		advancedCommon: new AdvancedCommonController(this),
		alphaMap: new TextureAlphaMapController(this, CONTROLLER_OPTIONS),
		aoMap: new TextureAOMapController(this, CONTROLLER_OPTIONS),
		bumpMap: new TextureBumpMapController(this, CONTROLLER_OPTIONS),
		displacementMap: new TextureDisplacementMapController(this, CONTROLLER_OPTIONS),
		emissiveMap: new TextureEmissiveMapController(this, CONTROLLER_OPTIONS),
		envMap: new TextureEnvMapController(this, CONTROLLER_OPTIONS),
		lightMap: new TextureLightMapController(this, CONTROLLER_OPTIONS),
		map: new TextureMapController(this, CONTROLLER_OPTIONS),
		normalMap: new TextureNormalMapController(this, CONTROLLER_OPTIONS),
		specularMap: new TextureSpecularMapController(this, CONTROLLER_OPTIONS),
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
		SkinningController.update(this);
		WireframeController.update(this);

		this.setMaterial(this.material);
	}
}
