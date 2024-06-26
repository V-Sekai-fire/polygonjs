import type {QUnit} from '../../../helpers/QUnit';
import {CoreSleep} from '../../../../src/core/Sleep';
import {JsConnectionPointType} from '../../../../src/engine/nodes/utils/io/connections/Js';
import {RendererUtils} from '../../../helpers/RendererUtils';
export function testenginenodesjsBox3(qUnit: QUnit) {

qUnit.test('js/Box3 simple', async (assert) => {
	const scene = window.scene;
	const perspective_camera1 = window.perspective_camera1;
	const geo1 = window.geo1;
	const box1 = geo1.createNode('box');
	const actor1 = geo1.createNode('actor');

	actor1.setInput(0, box1);
	actor1.flags.display.set(true);
	actor1.io.inputs.overrideClonedState(true);

	const box3 = actor1.createNode('box3');
	const getBox3Property = actor1.createNode('getBox3Property');
	const setObjectPosition = actor1.createNode('setObjectPosition');
	const onManualTrigger = actor1.createNode('onManualTrigger');

	getBox3Property.setInput(0, box3);
	setObjectPosition.setInput(JsConnectionPointType.TRIGGER, onManualTrigger);
	setObjectPosition.setInput('position', getBox3Property, 'min');

	box3.p.min.set([-2, -3, -4]);
	box3.p.max.set([5, 6, 8]);

	const container = await actor1.compute();
	const object = container.coreContent()!.threejsObjects()[0];

	await RendererUtils.withViewer({cameraNode: perspective_camera1}, async (args) => {
		scene.play();
		await CoreSleep.sleep(70);
		assert.equal(object.position.y, 0);
		onManualTrigger.p.trigger.pressButton();
		await CoreSleep.sleep(70);
		assert.equal(object.position.y, -3, '-3');
		setObjectPosition.setInput('position', getBox3Property, 'max');
		await CoreSleep.sleep(70);
		onManualTrigger.p.trigger.pressButton();
		await CoreSleep.sleep(60);
		assert.equal(object.position.y, 6, '6');
	});
});

}