import 'qunit';
import {PolyScene} from '../../src/engine/scene/PolyScene';
import {RootManagerNode} from '../../src/engine/nodes/manager/Root';
import {PerspectiveCameraObjNode} from '../../src/engine/nodes/obj/PerspectiveCamera';
import {GeoObjNode} from '../../src/engine/nodes/obj/Geo';
import {MaterialsNetworkObjNode} from '../../src/engine/nodes/obj/MaterialsNetwork';
import {PostProcessNetworkObjNode} from '../../src/engine/nodes/obj/PostProcessNetwork';
import {CopNetworkObjNode} from '../../src/engine/nodes/obj/CopNetwork';

import {Poly} from '../../src/engine/Poly';

// register
import {AllRegister} from '../../src/engine/poly/registers/All';
import {AllModulesRegister} from '../../src/engine/poly/registers/modules/All';
import {waitForUserInteraction} from './UserInteraction';
AllRegister.run();
AllModulesRegister.run(Poly);

// window.create_renderer_if_none = () => {
// 	const first_renderer = POLY.renderers_controller.first_renderer();
// 	if (!first_renderer) {
// 		const renderer = new WebGLRenderer();
// 		POLY.renderers_controller.register_renderer(renderer);
// 	}
// };
declare global {
	interface Window {
		// create_renderer_if_none: () => void;
		scene: PolyScene;
		root: RootManagerNode;
		perspective_camera1: PerspectiveCameraObjNode;
		geo1: GeoObjNode;
		MAT: MaterialsNetworkObjNode;
		POST: PostProcessNetworkObjNode;
		COP: CopNetworkObjNode;
	}
}
QUnit.testStart(async () => {
	// console.log(`%c ^^^^ ${QUnit.config.current.testName}`, 'background: #222; color: #da5555');

	await waitForUserInteraction();

	Poly.renderersController.deregisterAllRenderers();
	// return new Promise(async (resolve, reject) => {
	window.scene = new PolyScene();
	window.scene.setName(QUnit.config.current.testName);
	window.scene.setUuid(QUnit.config.current.testName);
	Poly.setEnv('test');

	window.scene.loadingController.markAsLoading();
	window.scene.cooker.block();
	const root = window.scene.root();
	window.root = root;
	window.perspective_camera1 = root.createNode('perspectiveCamera');
	window.geo1 = root.createNode('geo');
	window.MAT = root.createNode('materialsNetwork');
	window.MAT.setName('MAT');
	window.POST = root.createNode('postProcessNetwork');
	window.POST.setName('POST');
	window.COP = root.createNode('copNetwork');
	window.COP.setName('COP');

	window.scene.loadingController.setAutoUpdate(true);
	await window.scene.loadingController.markAsLoaded();
	window.scene.cooker.unblock();
});
QUnit.testDone(() => {
	console.log(`%c ✓ ${QUnit.config.current.testName}`, 'background: #222; color: #bada55');
});
