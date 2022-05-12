import {PolyScene} from '../PolyScene';
import {Camera, Object3D} from 'three';
import {Poly} from '../../Poly';
import {CoreGraphNode} from '../../../core/graph/CoreGraphNode';
import {CreateViewerOptions} from '../../viewers/_Base';

type OnCameraObjectsUpdated = () => void;
interface MainCameraOptions {
	findAnyCamera?: boolean;
}

export class SceneCamerasController {
	private _coreGraphNode: CoreGraphNode;
	constructor(private scene: PolyScene) {
		this._coreGraphNode = new CoreGraphNode(this.scene, 'SceneCamerasController');
	}
	coreGraphNode() {
		return this._coreGraphNode;
	}
	private _cameraObjectsRecentlyUpdated: Array<Camera> = [];
	updateFromChangeInObject(object: Object3D) {
		this._cameraObjects(object, this._cameraObjectsRecentlyUpdated);
		if (this._cameraObjectsRecentlyUpdated.length > 0) {
			this._coreGraphNode.setDirty();
		}
		if (this._onCameraObjectsUpdated) {
			this._onCameraObjectsUpdated();
		}
	}
	cameraObjects() {
		const objects: Array<Camera> = [];
		this._cameraObjects(this.scene.threejsScene(), objects);
		return objects;
	}

	private _cameraObjects(parent: Object3D, cameraObjects: Array<Camera>) {
		cameraObjects.splice(0, cameraObjects.length);
		parent.traverse((object) => {
			if (Poly.camerasRegister.objectRegistered(object)) {
				cameraObjects.push(object as Camera);
			}
		});
	}
	cameraObjectsRecentlyUpdated() {
		return this._cameraObjectsRecentlyUpdated;
	}

	// _mainCameraObjectPath: string | null = null;

	setMainCamera(camera: Camera) {
		// this._mainCameraObjectPath = camera_node_path;
		this.scene.root().mainCameraController.setCamera(camera);
	}
	setMainCameraPath(path: string) {
		this.scene.root().mainCameraController.setCameraPath(path);
	}
	mainCameraPath() {
		return this.scene.root().mainCameraController.rawCameraPath();
	}
	// async mainCameraObjectPath() {
	// 	return this._mainCameraObjectPath;
	// }
	async mainCamera(options?: MainCameraOptions): Promise<Camera | null> {
		const camera = await this.scene.root().mainCameraController.camera();
		if (camera) {
			return camera;
		}
		let findAnyCamera = true;
		if (options?.findAnyCamera != null) {
			findAnyCamera = options.findAnyCamera;
		}
		if (findAnyCamera) {
			return this._findAnyCameraObject();
		}
		return null;
	}

	private _findAnyCameraObject(): Camera | null {
		return this.cameraObjects()[0];
	}

	async createMainViewer(options?: CreateViewerOptions) {
		const camera = await this.mainCamera();
		if (!camera) {
			return;
		}
		return Poly.camerasRegister.createViewer({
			...options,
			camera,
			scene: this.scene,
		});
	}

	private _onCameraObjectsUpdated: OnCameraObjectsUpdated | undefined;
	onCameraObjectsUpdated(callback: OnCameraObjectsUpdated | undefined) {
		this._onCameraObjectsUpdated = callback;
	}
}
