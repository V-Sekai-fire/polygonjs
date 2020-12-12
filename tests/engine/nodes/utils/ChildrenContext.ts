import {NodeContext} from '../../../../src/engine/poly/NodeContext';

QUnit.test('children_context grand_parent types are updated as nodes get added and removed', async (assert) => {
	const scene = window.scene;
	const root = scene.root;
	const geo1 = window.geo1;
	if (!root.children_controller) {
		return;
	}

	assert.ok(root.children_controller.has_children_and_grandchildren_with_context(NodeContext.OBJ));
	assert.ok(!root.children_controller.has_children_and_grandchildren_with_context(NodeContext.SOP));

	const box = geo1.createNode('box');
	assert.ok(root.children_controller.has_children_and_grandchildren_with_context(NodeContext.SOP));

	geo1.removeNode(box);
	assert.ok(!root.children_controller.has_children_and_grandchildren_with_context(NodeContext.SOP));
});
