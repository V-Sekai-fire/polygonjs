/**
 * generates a ramp as a spare parameter, which can then be used to interpolate an input value.
 *
 *
 *
 */

import {TypedGlNode} from './_Base';
import {GlConnectionPoint, GlConnectionPointType} from '../utils/io/connections/Gl';
import {ShadersCollectionController} from './code/utils/ShadersCollectionController';
import {UniformGLDefinition} from './utils/GLDefinition';
import {RampParam} from '../../params/Ramp';
import {ParamConfigsController} from '../utils/code/controllers/ParamConfigsController';
import {ParamType} from '../../poly/ParamType';

const OUTPUT_NAME = 'val';

import {GlParamConfig} from './code/utils/ParamConfig';

import {NodeParamsConfig, ParamConfig} from '../utils/params/ParamsConfig';
class RampGlParamsConfig extends NodeParamsConfig {
	name = ParamConfig.STRING('');
	input = ParamConfig.FLOAT(0);
}
const ParamsConfig = new RampGlParamsConfig();
export class RampGlNode extends TypedGlNode<RampGlParamsConfig> {
	override paramsConfig = ParamsConfig;
	static override type(): Readonly<'ramp'> {
		return 'ramp';
	}
	private _onCreateSetNameIfNoneBound = this._onCreateSetNameIfNone.bind(this);
	override initializeNode() {
		super.initializeNode();

		this.addPostDirtyHook('_setMatToRecompile', this._setMatToRecompile.bind(this));
		this.lifecycle.onAfterCreated(this._onCreateSetNameIfNoneBound);
		this.lifecycle.onBeforeDeleted(this._setMatToRecompile.bind(this));
		this.io.outputs.setNamedOutputConnectionPoints([
			new GlConnectionPoint(OUTPUT_NAME, GlConnectionPointType.FLOAT),
		]);
	}

	override setLines(shaders_collection_controller: ShadersCollectionController) {
		const tmpTextureGlType = GlConnectionPointType.VEC3;
		const tmpTexureVarName = this.glVarName('tmpTexureVarName');
		const gl_type = GlConnectionPointType.FLOAT;
		const texture_name = this._uniform_name();
		const var_name = this.glVarName(OUTPUT_NAME);

		const definition = new UniformGLDefinition(this, GlConnectionPointType.SAMPLER_2D, texture_name);
		shaders_collection_controller.addDefinitions(this, [definition]);

		const input_val = this.variableForInputParam(this.p.input);
		const body_lines = [
			`${tmpTextureGlType} ${tmpTexureVarName} = texture2D(${this._uniform_name()}, vec2(${input_val}, 0.0)).xyz`,
			`${gl_type} ${var_name} = -1.0 + ${tmpTexureVarName}.x + ${tmpTexureVarName}.y + ${tmpTexureVarName}.z`,
		];
		shaders_collection_controller.addBodyLines(this, body_lines);
	}
	override paramsGenerating() {
		return true;
	}
	override setParamConfigs() {
		this._param_configs_controller = this._param_configs_controller || new ParamConfigsController();
		this._param_configs_controller.reset();
		const param_config = new GlParamConfig(
			ParamType.RAMP,
			this.pv.name,
			RampParam.DEFAULT_VALUE,
			this._uniform_name()
		);
		this._param_configs_controller.push(param_config);
	}
	private _uniform_name() {
		return 'ramp_texture_' + this.glVarName(OUTPUT_NAME);
	}
	//
	//
	// HOOKS
	//
	//
	private _onCreateSetNameIfNone() {
		if (this.pv.name == '') {
			this.p.name.set(this.name());
		}
	}
}
