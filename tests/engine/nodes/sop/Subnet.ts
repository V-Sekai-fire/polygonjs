import {Vector3} from 'three/src/math/Vector3';
import {CoreSleep} from '../../../../src/core/Sleep';
import {SubnetSopNode} from '../../../../src/engine/nodes/sop/Subnet';

function create_required_nodes(node: SubnetSopNode) {
	const subnet_input1 = node.createNode('subnet_input');
	const subnet_output1 = node.createNode('subnet_output');
	return {subnet_input1, subnet_output1};
}

QUnit.test('subnet simple', async (assert) => {
	await window.scene.wait_for_cooks_completed();
	const geo1 = window.geo1;
	const box1 = geo1.createNode('box');
	const subnet1 = geo1.createNode('subnet');

	assert.equal(subnet1.children().length, 0);
	const {subnet_input1, subnet_output1} = create_required_nodes(subnet1);
	assert.equal(subnet1.children().length, 2);

	// if nothing inside yet
	let container = await subnet1.request_container();
	let core_group = container.core_content();
	assert.notOk(core_group);

	const scatter1 = subnet1.createNode('scatter');
	scatter1.set_input(0, subnet_input1);
	subnet_output1.set_input(0, scatter1);

	// we have an error if the content is invalid
	await CoreSleep.sleep(10);
	scatter1.p.points_count.set(100);
	container = await subnet1.request_container();
	core_group = container.core_content();
	assert.notOk(core_group);
	assert.equal(
		subnet1.states.error.message,
		'input 0 is invalid (error: input 0 is invalid (error: parent has no input 0))'
	);

	// by plugging the input
	await CoreSleep.sleep(10);
	subnet1.set_input(0, box1);
	container = await subnet1.request_container();
	core_group = container.core_content()!;
	assert.equal(core_group.points_count(), 100);
	assert.ok(!subnet1.states.error.message);

	// and when we update the box, the content of the subnet updates
	box1.p.size.set(30);
	container = await subnet1.request_container();
	core_group = container.core_content()!;
	const size = new Vector3();
	core_group.bounding_box().getSize(size);
	assert.equal(size.x, 30);
	assert.ok(!subnet1.states.error.message);
});

QUnit.test('subnet errors without subnet_output child node', async (assert) => {
	const geo1 = window.geo1;
	await window.scene.wait_for_cooks_completed();
	const subnet1 = geo1.createNode('subnet');

	assert.equal(subnet1.children().length, 0);
	const {subnet_output1} = create_required_nodes(subnet1);
	assert.equal(subnet1.children().length, 2);
	subnet1.removeNode(subnet_output1);

	await subnet1.request_container();
	assert.equal(subnet1.states.error.message, 'no output node found inside subnet');

	// and we add a subnet_output again
	await CoreSleep.sleep(10);
	const subnet_output2 = subnet1.createNode('subnet_output');
	await subnet1.request_container();
	assert.equal(subnet1.states.error.message, 'inputs are missing');

	// and we add a box
	const box1 = subnet1.createNode('box');
	await CoreSleep.sleep(10);
	subnet_output2.set_input(0, box1);
	let container = await subnet1.request_container();
	assert.ok(!subnet1.states.error.active);
	let core_group = container.core_content()!;
	assert.equal(core_group.points_count(), 24);
});

QUnit.test('subnet works without inputs', async (assert) => {
	const geo1 = window.geo1;
	const subnet1 = geo1.createNode('subnet');

	assert.equal(subnet1.children().length, 0);
	const {subnet_output1} = create_required_nodes(subnet1);
	assert.equal(subnet1.children().length, 2);

	const box1 = subnet1.createNode('box');
	subnet_output1.set_input(0, box1);

	let container = await subnet1.request_container();
	let core_group = container.core_content()!;
	assert.equal(core_group.points_count(), 24);
});
