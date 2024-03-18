export interface CursorOffset {
	offsetX: number;
	offsetY: number;
}
export interface CursorPage {
	clientX: number;
	clientY: number;
}

class MouseHelperClass {
	private static _instance: MouseHelperClass;

	static instance() {
		return (this._instance = this._instance || new MouseHelperClass());
	}
	private constructor() {
		// We could potentially remove the 'resize' listener,
		// as the viewers do not rely on it anymore.
		// But this may still be required by the event nodes.
		globalThis.addEventListener('resize', this._resetCacheBound);
		document.addEventListener('scroll', this._resetCacheBound);
	}
	private _rectByCanvas: Map<HTMLCanvasElement, DOMRect> = new Map();

	setEventOffset(cursorPage: CursorPage, canvas: HTMLCanvasElement, offset: CursorOffset) {
		let rect = this._rectByCanvas.get(canvas);
		if (!rect) {
			rect = canvas.getBoundingClientRect();
			this._rectByCanvas.set(canvas, rect);
		}
		// this function used to use cursorPage.pageX/pageY
		// but this was returning an incorrect position when the page was scrolled
		offset.offsetX = cursorPage.clientX - rect.left;
		offset.offsetY = cursorPage.clientY - rect.top;
	}

	private _resetCacheBound = this._resetCache.bind(this);
	private _resetCache() {
		this._rectByCanvas.clear();
	}
	resetCacheForCanvas(canvas: HTMLCanvasElement) {
		this._rectByCanvas.delete(canvas);
	}
}

export const MouseHelper = MouseHelperClass.instance();
