QUnit.test('csg/merge', async (assert) => {
	const geo1 = window.geo1;
	geo1.flags.display.set(false); // cancels geo node displayNodeController

	const csgNetwork1 = geo1.createNode('csgNetwork');
	const cube1 = csgNetwork1.createNode('cube');
	const sphere1 = csgNetwork1.createNode('sphere');
	const merge1 = csgNetwork1.createNode('merge');

	merge1.setInput(0, cube1);
	merge1.setInput(1, sphere1);
	merge1.flags.display.set(true);

	await csgNetwork1.compute();

	let container = await csgNetwork1.compute();
	const core_group = container.coreContent();
	assert.equal(core_group?.objectsWithGeo().length, 2, '2 objects');
	let geometry1 = core_group?.objectsWithGeo()[0].geometry;
	assert.equal(geometry1?.getAttribute('position').array.length, 108);
	let geometry2 = core_group?.objectsWithGeo()[1].geometry;
	assert.equal(geometry2?.getAttribute('position').array.length, 2016);
	assert.in_delta(container.boundingBox().min.x, -1, 0.002);
	assert.in_delta(container.boundingBox().max.x, 1, 0.002);
	assert.notOk(csgNetwork1.isDirty(), 'box is dirty');
});