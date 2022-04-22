/**
 * Creates a Mesh Depth Material, which can be extended with GL nodes.
 *
 * @remarks
 * This node can create children, which will be GL nodes. The GLSL code generated by the nodes will extend the Material.
 *
 */
import {NodeParamsConfig} from '../utils/params/ParamsConfig';
import {UniformsTransparencyParamConfig, UniformsTransparencyController} from './utils/UniformsTransparencyController';
import {AdvancedCommonController, AdvancedCommonParamConfig} from './utils/AdvancedCommonController';
import {BaseBuilderParamConfig, TypedBuilderMatNode} from './_BaseBuilder';
import {AssemblerName} from '../../poly/registers/assemblers/_BaseRegister';
import {Poly} from '../../Poly';
import {MeshDepthMaterial} from 'three';
import {CustomMaterialName, IUniforms} from '../../../core/geometry/Material';
import {Material} from 'three';
import {ShaderAssemblerCustomMeshDepth} from '../gl/code/assemblers/materials/custom/mesh/CustomMeshDepth';
interface MeshDepthBuilderControllers {
	advancedCommon: AdvancedCommonController;
}
interface MeshDepthBuilderMaterial extends MeshDepthMaterial {
	vertexShader: string;
	fragmentShader: string;
	uniforms: IUniforms;
	customMaterials: {
		[key in CustomMaterialName]?: Material;
	};
}

class MeshDepthBuilderMatParamsConfig extends AdvancedCommonParamConfig(
	BaseBuilderParamConfig(UniformsTransparencyParamConfig(NodeParamsConfig))
) {}
const ParamsConfig = new MeshDepthBuilderMatParamsConfig();

export class MeshDepthBuilderMatNode extends TypedBuilderMatNode<
	MeshDepthBuilderMaterial,
	ShaderAssemblerCustomMeshDepth,
	MeshDepthBuilderMatParamsConfig
> {
	override paramsConfig = ParamsConfig;
	static override type() {
		return 'meshDepthBuilder';
	}
	public override usedAssembler(): Readonly<AssemblerName.GL_MESH_DEPTH> {
		return AssemblerName.GL_MESH_DEPTH;
	}
	protected _createAssemblerController() {
		return Poly.assemblersRegister.assembler(this, this.usedAssembler());
	}

	readonly controllers: MeshDepthBuilderControllers = {
		advancedCommon: new AdvancedCommonController(this),
	};
	private controllerNames = Object.keys(this.controllers) as Array<keyof MeshDepthBuilderControllers>;
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

		this.compileIfRequired();

		this.setMaterial(this.material);
	}
}
