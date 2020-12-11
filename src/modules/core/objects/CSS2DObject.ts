import {Object3D} from 'three/src/core/Object3D';

export class CSS2DObject extends Object3D {
	constructor(protected _element: HTMLElement) {
		super();

		this._element.style.position = 'absolute';

		this.addEventListener('removed', this._on_removed.bind(this));
	}

	private _on_removed() {
		this.traverse(function (object) {
			if (object instanceof CSS2DObject) {
				if (object.element instanceof Element && object.element.parentNode !== null) {
					object.element.parentNode.removeChild(object.element);
				}
			}
		});
	}

	get element() {
		return this._element;
	}

	copy(source: CSS2DObject, recursive: boolean) {
		Object3D.prototype.copy.call(this, source, recursive);

		this._element = source.element.cloneNode(true) as HTMLElement;
		this.matrixAutoUpdate = source.matrixAutoUpdate;

		return this;
	}
}
