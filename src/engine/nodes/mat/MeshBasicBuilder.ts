/**
 * Creates a Mesh Basic Material, which can be extended with GL nodes.
 *
 * @remarks
 * This node can create children, which will be GL nodes. The GLSL code generated by the nodes will extend the Material.
 *
 */

import {NodeParamsConfig} from '../utils/params/ParamsConfig';
import {UniformsTransparencyParamConfig, UniformsTransparencyController} from './utils/UniformsTransparencyController';
import {AdvancedCommonParamConfig, AdvancedCommonController} from './utils/AdvancedCommonController';
import {MapParamConfig, TextureMapController} from './utils/TextureMapController';
import {AlphaMapParamConfig, TextureAlphaMapController} from './utils/TextureAlphaMapController';
import {ShaderAssemblerBasic} from '../gl/code/assemblers/materials/Basic';
import {BaseBuilderParamConfig, TypedBuilderMatNode} from './_BaseBuilder';
import {Poly} from '../../Poly';
import {TextureAOMapController, AOMapParamConfig} from './utils/TextureAOMapController';
import {AssemblerName} from '../../poly/registers/assemblers/_BaseRegister';
import {FogParamConfig, FogController} from './utils/UniformsFogController';
import {WireframeController, WireframeParamConfig} from './utils/WireframeShaderMaterialController';
import {TextureEnvMapController, EnvMapParamConfig} from './utils/TextureEnvMapSimpleController';
import {DefaultFolderParamConfig} from './utils/DefaultFolder';
import {TexturesFolderParamConfig} from './utils/TexturesFolder';
import {AdvancedFolderParamConfig} from './utils/AdvancedFolder';
import {UpdateOptions} from './utils/_BaseTextureController';
const CONTROLLER_OPTIONS: UpdateOptions = {
	uniforms: true,
};
interface Controllers {
	advancedCommon: AdvancedCommonController;
	alphaMap: TextureAlphaMapController;
	aoMap: TextureAOMapController;
	envMap: TextureEnvMapController;
	map: TextureMapController;
}
class MeshBasicMatParamsConfig extends FogParamConfig(
	WireframeParamConfig(
		AdvancedCommonParamConfig(
			BaseBuilderParamConfig(
				/* advanced */
				AdvancedFolderParamConfig(
					EnvMapParamConfig(
						AOMapParamConfig(
							AlphaMapParamConfig(
								MapParamConfig(
									/* textures */
									TexturesFolderParamConfig(
										UniformsTransparencyParamConfig(DefaultFolderParamConfig(NodeParamsConfig))
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
	override paramsConfig = ParamsConfig;
	static override type() {
		return 'meshBasicBuilder';
	}
	public override usedAssembler(): Readonly<AssemblerName.GL_MESH_BASIC> {
		return AssemblerName.GL_MESH_BASIC;
	}
	protected _create_assembler_controller() {
		return Poly.assemblersRegister.assembler(this, this.usedAssembler());
	}
	readonly controllers: Controllers = {
		advancedCommon: new AdvancedCommonController(this),
		alphaMap: new TextureAlphaMapController(this, CONTROLLER_OPTIONS),
		aoMap: new TextureAOMapController(this, CONTROLLER_OPTIONS),
		envMap: new TextureEnvMapController(this, CONTROLLER_OPTIONS),
		map: new TextureMapController(this, CONTROLLER_OPTIONS),
	};
	private controllerNames = Object.keys(this.controllers) as Array<keyof Controllers>;

	override initializeNode() {
		this.params.onParamsCreated('init controllers', () => {
			for (let controllerName of this.controllerNames) {
				this.controllers[controllerName].initializeNode();
			}
		});
	}

	override async cook() {
		for (let controllerName of this.controllerNames) {
			this.controllers[controllerName].update();
		}
		UniformsTransparencyController.update(this);
		FogController.update(this);
		WireframeController.update(this);

		this.compileIfRequired();

		this.setMaterial(this.material);
	}
}
