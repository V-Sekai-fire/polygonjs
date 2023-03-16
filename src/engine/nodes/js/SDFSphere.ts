/**
 * Function of SDF Sphere
 *
 * @remarks
 *
 * based on [https://iquilezles.org/articles/distfunctions/](https://iquilezles.org/articles/distfunctions/)
 */

// import {ThreeToGl} from '../../../../src/core/ThreeToGl';
import {NodeParamsConfig, ParamConfig} from '../utils/params/ParamsConfig';
import {JsConnectionPointType, JsConnectionPoint} from '../utils/io/connections/Js';
import {ShadersCollectionController} from './code/utils/ShadersCollectionController';
import {BaseSDFJsNode} from './_BaseSDF';
import {sdSphere} from './js/sdf/sdf';
const OUTPUT_NAME = 'float';
class SDFSphereJsParamsConfig extends NodeParamsConfig {
	position = ParamConfig.VECTOR3([0, 0, 0], {hidden: true});
	center = ParamConfig.VECTOR3([0, 0, 0]);
	radius = ParamConfig.FLOAT(1);
}
const ParamsConfig = new SDFSphereJsParamsConfig();
export class SDFSphereJsNode extends BaseSDFJsNode<SDFSphereJsParamsConfig> {
	override paramsConfig = ParamsConfig;
	static override type() {
		return 'SDFSphere';
	}

	override initializeNode() {
		super.initializeNode();

		this.io.outputs.setNamedOutputConnectionPoints([
			new JsConnectionPoint(OUTPUT_NAME, JsConnectionPointType.FLOAT),
		]);
	}

	override setLines(shadersCollectionController: ShadersCollectionController) {
		const position = this.position(shadersCollectionController);
		const radius = this.variableForInputParam(shadersCollectionController, this.p.radius);
		const center = this.variableForInputParam(shadersCollectionController, this.p.center); //this.jsVarName(VARIABLE_NAME_CENTER);

		const float = this.jsVarName(OUTPUT_NAME);
		const bodyLine = `const ${float} = ${sdSphere.name}(${position}.sub(${center}), ${radius})`;
		shadersCollectionController.addBodyLines(this, [bodyLine]);
		shadersCollectionController.addFunction(this, sdSphere);
	}
}
