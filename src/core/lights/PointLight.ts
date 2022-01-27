import {ParamConfig} from '../../engine/nodes/utils/params/ParamsConfig';
import {Constructor, Number2, Number3} from '../../types/GlobalTypes';
import {ColorConversion} from '../Color';
import {SphereBufferGeometry} from 'three/src/geometries/SphereGeometry';
import {PointLight} from 'three/src/lights/PointLight';
import {Vector3} from 'three/src/math/Vector3';
import {Mesh} from 'three/src/objects/Mesh';
import {LIGHT_HELPER_MAT} from './_Base';
import {DefaultOperationParams} from '../operations/_Base';
import {Color} from 'three/src/math/Color';
import {Vector2} from 'three/src/math/Vector2';

export interface PointLightParams extends DefaultOperationParams {
	color: Color;
	intensity: number;
	decay: number;
	distance: number;
	castShadow: boolean;
	shadowRes: Vector2;
	shadowBias: number;
	shadowNear: number;
	shadowFar: number;
	showHelper: boolean;
	helperSize: number;
}

export const DEFAULT_POINT_LIGHT_PARAMS: PointLightParams = {
	color: new Color(1, 1, 1),
	intensity: 1,
	decay: 0.1,
	distance: 100,
	castShadow: false,
	shadowRes: new Vector2(1024, 1024),
	shadowBias: 0.001,
	shadowNear: 1,
	shadowFar: 100,
	showHelper: false,
	helperSize: 1,
};
const DEFAULT = DEFAULT_POINT_LIGHT_PARAMS;

export function PointLightParamConfig<TBase extends Constructor>(Base: TBase) {
	return class Mixin extends Base {
		light = ParamConfig.FOLDER();
		/** @param light color */
		color = ParamConfig.COLOR(DEFAULT.color.toArray() as Number3, {
			conversion: ColorConversion.SRGB_TO_LINEAR,
		});
		/** @param light intensity */
		intensity = ParamConfig.FLOAT(DEFAULT.intensity);
		/** @param light decay */
		decay = ParamConfig.FLOAT(DEFAULT.decay);
		/** @param light distance */
		distance = ParamConfig.FLOAT(DEFAULT.distance);
		// helper
		/** @param toggle to show helper */
		showHelper = ParamConfig.BOOLEAN(0);
		/** @param helper size */
		helperSize = ParamConfig.FLOAT(1, {visibleIf: {showHelper: 1}});

		// shadows
		shadow = ParamConfig.FOLDER();
		/** @param toggle to cast shadows */
		castShadow = ParamConfig.BOOLEAN(DEFAULT.castShadow);
		/** @param shadow res */
		shadowRes = ParamConfig.VECTOR2(DEFAULT.shadowRes.toArray() as Number2, {visibleIf: {castShadow: 1}});
		/** @param shadow bias */
		shadowBias = ParamConfig.FLOAT(DEFAULT.shadowBias, {visibleIf: {castShadow: 1}});
		/** @param shadow camera near */
		shadowNear = ParamConfig.FLOAT(DEFAULT.shadowNear, {visibleIf: {castShadow: 1}});
		/** @param shadow camera far */
		shadowFar = ParamConfig.FLOAT(DEFAULT.shadowFar, {visibleIf: {castShadow: 1}});
	};
}

interface Options {
	helperSize: number;
	light: PointLight;
}

export class CorePointLightHelper {
	private _material = LIGHT_HELPER_MAT.clone();
	createObject() {
		return new Mesh();
	}
	createAndBuildObject(options: Options) {
		const object = this.createObject();
		this.buildHelper(object);
		this.update(object, options);
		return object;
	}

	buildHelper(object: Mesh) {
		const size = 1;
		object.geometry = new SphereBufferGeometry(size, 4, 2);
		object.matrixAutoUpdate = false;
		object.material = this._material;
		return object;
	}

	private _matrixScale = new Vector3(1, 1, 1);
	update(object: Mesh, options: Options) {
		const size = options.helperSize;
		this._matrixScale.set(size, size, size);
		object.matrix.identity();
		object.matrix.scale(this._matrixScale);

		this._material.color.copy(options.light.color);
	}
}