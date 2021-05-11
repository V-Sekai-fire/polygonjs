import {Vector2} from 'three/src/math/Vector2';
import {WebGLRenderer} from 'three/src/renderers/WebGLRenderer';
import {Poly} from '../../src/engine/Poly';

interface RendererConfig {
	canvas: HTMLCanvasElement;
	renderer: WebGLRenderer;
	viewer?: WebGLRenderer;
}
export class RendererUtils {
	private static _configs: RendererConfig[] = [];

	static async waitForRenderer(): Promise<RendererConfig> {
		return new Promise(async (resolve) => {
			const canvas = document.createElement('canvas');
			document.body.appendChild(canvas);
			const size = new Vector2(canvas.width, canvas.height);
			const viewer = window.perspective_camera1.renderController.createRenderer(canvas, size);
			const renderer = await Poly.renderersController.waitForRenderer();
			const config = {canvas, viewer, renderer};
			this._configs.push(config);
			resolve(config);
		});
	}

	static dispose() {
		let config: RendererConfig | undefined;
		while ((config = this._configs.pop())) {
			config.viewer?.dispose();
			document.body.removeChild(config.canvas);
		}
	}
}
