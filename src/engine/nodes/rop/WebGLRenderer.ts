/**
 * Creates a WebGLRenderer
 *
 * @param
 * By default, a camera will create its own renderer, with sensible defaults. But there may be cases where you want to override those defaults. In those situation, simply create this node, and set the camera renderer param to it.
 *
 */
import {TypedRopNode} from './_Base';
import {Mesh} from 'three/src/objects/Mesh';
import {RopType} from '../../poly/registers/nodes/Rop';
import {WebGLRenderer, WebGLRendererParameters} from 'three/src/renderers/WebGLRenderer';
import {
	// encoding
	LinearEncoding,
	sRGBEncoding,
	GammaEncoding,
	RGBEEncoding,
	LogLuvEncoding,
	RGBM7Encoding,
	RGBM16Encoding,
	RGBDEncoding,
	// BasicDepthPacking,
	// RGBADepthPacking,
	// tone mapping
	NoToneMapping,
	LinearToneMapping,
	ReinhardToneMapping,
	CineonToneMapping,
	ACESFilmicToneMapping,
	// shadow map
	BasicShadowMap,
	PCFShadowMap,
	PCFSoftShadowMap,
	VSMShadowMap,
} from 'three/src/constants';

enum RendererPrecision {
	lowp = 'lowp',
	mediump = 'mediump',
	highp = 'highp',
}

enum PowerPreference {
	HIGH = 'high-performance',
	LOW = 'low-power',
	DEFAULT = 'default',
}

enum EncodingName {
	Linear = 'Linear',
	sRGB = 'sRGB',
	Gamma = 'Gamma',
	RGBE = 'RGBE',
	LogLuv = 'LogLuv',
	RGBM7 = 'RGBM7',
	RGBM16 = 'RGBM16',
	RGBD = 'RGBD',
	// BasicDepth = 'BasicDepth',
	// RGBADepth = 'RGBADepth',
}
enum EncodingValue {
	Linear = LinearEncoding as number,
	sRGB = sRGBEncoding as number,
	Gamma = GammaEncoding as number,
	RGBE = RGBEEncoding as number,
	LogLuv = LogLuvEncoding as number,
	RGBM7 = RGBM7Encoding as number,
	RGBM16 = RGBM16Encoding as number,
	RGBD = RGBDEncoding as number,
	// BasicDepth = BasicDepthPacking as number,
	// RGBADepth = RGBADepthPacking as number,
}
const ENCODING_NAMES: EncodingName[] = [
	EncodingName.Linear,
	EncodingName.sRGB,
	EncodingName.Gamma,
	EncodingName.RGBE,
	EncodingName.LogLuv,
	EncodingName.RGBM7,
	EncodingName.RGBM16,
	EncodingName.RGBD,
	// EncodingName.BasicDepth,
	// EncodingName.RGBADepth,
];
const ENCODING_VALUES: EncodingValue[] = [
	EncodingValue.Linear,
	EncodingValue.sRGB,
	EncodingValue.Gamma,
	EncodingValue.RGBE,
	EncodingValue.LogLuv,
	EncodingValue.RGBM7,
	EncodingValue.RGBM16,
	EncodingValue.RGBD,
	// EncodingValue.BasicDepth,
	// EncodingValue.RGBADepth,
];
export const DEFAULT_OUTPUT_ENCODING = EncodingValue.sRGB as number;

enum ToneMappingName {
	No = 'No',
	Linear = 'Linear',
	Reinhard = 'Reinhard',
	Cineon = 'Cineon',
	ACESFilmic = 'ACESFilmic',
}
enum ToneMappingValue {
	No = NoToneMapping as number,
	Linear = LinearToneMapping as number,
	Reinhard = ReinhardToneMapping as number,
	Cineon = CineonToneMapping as number,
	ACESFilmic = ACESFilmicToneMapping as number,
}
const TONE_MAPPING_NAMES: ToneMappingName[] = [
	ToneMappingName.No,
	ToneMappingName.Linear,
	ToneMappingName.Reinhard,
	ToneMappingName.Cineon,
	ToneMappingName.ACESFilmic,
];
const TONE_MAPPING_VALUES: ToneMappingValue[] = [
	ToneMappingValue.No,
	ToneMappingValue.Linear,
	ToneMappingValue.Reinhard,
	ToneMappingValue.Cineon,
	ToneMappingValue.ACESFilmic,
];
export const DEFAULT_TONE_MAPPING = ToneMappingValue.ACESFilmic as number;
const TONE_MAPPING_MENU_ENTRIES = TONE_MAPPING_NAMES.map((name, i) => {
	return {
		name: name,
		value: TONE_MAPPING_VALUES[i],
	};
});

enum ShadowMapTypeName {
	Basic = 'Basic',
	PCF = 'PCF',
	PCFSoft = 'PCFSoft',
	VSM = 'VSM',
}
enum ShadowMapTypeValue {
	Basic = BasicShadowMap as number,
	PCF = PCFShadowMap as number,
	PCFSoft = PCFSoftShadowMap as number,
	VSM = VSMShadowMap as number,
}
const SHADOW_MAP_TYPE_NAMES: ShadowMapTypeName[] = [
	ShadowMapTypeName.Basic,
	ShadowMapTypeName.PCF,
	ShadowMapTypeName.PCFSoft,
	ShadowMapTypeName.VSM,
];
const SHADOW_MAP_TYPE_VALUES: ShadowMapTypeValue[] = [
	ShadowMapTypeValue.Basic,
	ShadowMapTypeValue.PCF,
	ShadowMapTypeValue.PCFSoft,
	ShadowMapTypeValue.VSM,
];
export const SHADOW_MAP_TYPES = [BasicShadowMap, PCFShadowMap, PCFSoftShadowMap, VSMShadowMap];
export const DEFAULT_SHADOW_MAP_TYPE = ShadowMapTypeValue.PCFSoft as number;

// TODO: set debug.checkShaderErrors to false in prod
const DEFAULT_PARAMS: WebGLRendererParameters = {
	alpha: true,
	precision: RendererPrecision.highp,
	premultipliedAlpha: true,
	antialias: true,
	stencil: true,
	preserveDrawingBuffer: false,
	powerPreference: PowerPreference.DEFAULT,
	depth: true,
	logarithmicDepthBuffer: false,
};

import {NodeParamsConfig, ParamConfig} from '../utils/params/ParamsConfig';
import {CoreType} from '../../../core/Type';
import {PolyDictionary} from '../../../types/GlobalTypes';
import {RenderController} from '../obj/utils/cameras/RenderController';
import {Poly} from '../../Poly';
class WebGLRendererRopParamsConfig extends NodeParamsConfig {
	/** @param toggle on to have alpha on (change requires page reload) */
	alpha = ParamConfig.BOOLEAN(1);
	/** @param toggle on to have antialias on (change requires page reload) */
	antialias = ParamConfig.BOOLEAN(1);
	/** @param tone mapping */
	toneMapping = ParamConfig.INTEGER(DEFAULT_TONE_MAPPING, {
		menu: {
			entries: TONE_MAPPING_MENU_ENTRIES,
		},
	});
	/** @param tone mapping exposure */
	toneMappingExposure = ParamConfig.FLOAT(1, {
		range: [0, 2],
	});
	/** @param output encoding */
	outputEncoding = ParamConfig.INTEGER(DEFAULT_OUTPUT_ENCODING, {
		menu: {
			entries: ENCODING_NAMES.map((name, i) => {
				return {
					name: name,
					value: ENCODING_VALUES[i],
				};
			}),
		},
	});
	/** @param physically correct lights */
	physicallyCorrectLights = ParamConfig.BOOLEAN(1);
	/** @param sort objects, which can be necessary when rendering transparent objects */
	sortObjects = ParamConfig.BOOLEAN(1);
	/** @param toggle to override the default pixel ratio, which is 1 for mobile devices, and Math.max(2, window.devicePixelRatio) for other devices */
	tpixelRatio = ParamConfig.BOOLEAN(0);
	/** @param higher pixelRatio improves render sharpness but reduces performance */
	pixelRatio = ParamConfig.INTEGER(2, {
		visibleIf: {tpixelRatio: true},
		range: [1, 4],
		rangeLocked: [true, false],
	});
	/** @param toggle on to have shadow maps */
	tshadowMap = ParamConfig.BOOLEAN(1);
	/** @param toggle on to recompute the shadow maps on every frame. If all objects are static, you may want to turn this off */
	shadowMapAutoUpdate = ParamConfig.BOOLEAN(1, {visibleIf: {tshadowMap: 1}});
	/** @param toggle on to trigger shadows update */
	shadowMapNeedsUpdate = ParamConfig.BOOLEAN(0, {visibleIf: {tshadowMap: 1}});
	/** @param shadows type */
	shadowMapType = ParamConfig.INTEGER(DEFAULT_SHADOW_MAP_TYPE, {
		visibleIf: {tshadowMap: 1},
		menu: {
			entries: SHADOW_MAP_TYPE_NAMES.map((name, i) => {
				return {
					name: name,
					value: SHADOW_MAP_TYPE_VALUES[i],
				};
			}),
		},
	});

	// preserve_drawing_buffer = ParamConfig.BOOLEAN(0);
}
const ParamsConfig = new WebGLRendererRopParamsConfig();

export class WebGLRendererRopNode extends TypedRopNode<WebGLRendererRopParamsConfig> {
	params_config = ParamsConfig;
	static type(): Readonly<RopType.WEBGL> {
		return RopType.WEBGL;
	}

	private _renderers_by_canvas_id: PolyDictionary<WebGLRenderer> = {};
	create_renderer(canvas: HTMLCanvasElement, gl: WebGLRenderingContext): WebGLRenderer {
		const params: WebGLRendererParameters = {};
		const keys: Array<keyof WebGLRendererParameters> = Object.keys(DEFAULT_PARAMS) as Array<
			keyof WebGLRendererParameters
		>;
		let k: keyof WebGLRendererParameters;
		for (k of keys) {
			(params[k] as any) = DEFAULT_PARAMS[k];
		}
		params.antialias = this.pv.antialias;
		params.alpha = this.pv.alpha;
		params.canvas = canvas;
		params.context = gl;
		// (params as WebGLRendererParameters).preserveDrawingBuffer = this.pv.preserve_drawing_buffer;
		const renderer = new WebGLRenderer(params);

		if (Poly.renderersController.printDebug()) {
			Poly.renderersController.printDebugMessage(`create renderer from node '${this.fullPath()}'`);
			Poly.renderersController.printDebugMessage({
				params: params,
			});
		}

		this._update_renderer(renderer);

		this._renderers_by_canvas_id[canvas.id] = renderer;
		return renderer;
	}

	cook() {
		const ids = Object.keys(this._renderers_by_canvas_id);
		for (let id of ids) {
			const renderer = this._renderers_by_canvas_id[id];
			this._update_renderer(renderer);
		}

		this._traverse_scene_and_update_materials();

		this.cookController.end_cook();
	}
	_update_renderer(renderer: WebGLRenderer) {
		// this._renderer.setClearAlpha(this.pv.alpha);
		renderer.physicallyCorrectLights = this.pv.physicallyCorrectLights;
		renderer.outputEncoding = this.pv.outputEncoding;
		renderer.toneMapping = this.pv.toneMapping;
		renderer.toneMappingExposure = this.pv.toneMappingExposure;

		// shadows
		renderer.shadowMap.enabled = this.pv.tshadowMap;
		renderer.shadowMap.autoUpdate = this.pv.shadowMapAutoUpdate;
		renderer.shadowMap.needsUpdate = this.pv.shadowMapNeedsUpdate;
		renderer.shadowMap.type = this.pv.shadowMapType;

		renderer.sortObjects = this.pv.sortObjects;

		const pixelRatio = this.pv.tpixelRatio ? this.pv.pixelRatio : RenderController.defaultPixelRatio();

		if (Poly.renderersController.printDebug()) {
			Poly.renderersController.printDebugMessage(`set renderer pixelRatio from '${this.fullPath()}'`);
			Poly.renderersController.printDebugMessage({
				pixelRatio: pixelRatio,
			});
		}

		renderer.setPixelRatio(pixelRatio);
	}

	private _traverse_scene_and_update_materials() {
		this.scene()
			.threejsScene()
			.traverse((object) => {
				const material = (object as Mesh).material;
				if (material) {
					if (CoreType.isArray(material)) {
						for (let mat of material) {
							mat.needsUpdate = true;
						}
					} else {
						material.needsUpdate = true;
					}
				}
			});
	}
}
