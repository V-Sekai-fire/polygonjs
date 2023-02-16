QUnit.test('csg/polyhedron simple', async (assert) => {
	const geo1 = window.geo1;
	geo1.flags.display.set(false); // cancels geo node displayNodeController

	const csgNetwork1 = geo1.createNode('csgNetwork');
	const polyhedron1 = csgNetwork1.createNode('polyhedron');

	polyhedron1.flags.display.set(true);

	let container = await csgNetwork1.compute();
	const core_group = container.coreContent();
	const geometry = core_group?.objectsWithGeo()[0].geometry;
	assert.equal(geometry?.getAttribute('position').array.length, 18);
	assert.in_delta(container.boundingBox().min.y, -1, 0.002);
	assert.notOk(csgNetwork1.isDirty(), 'box is dirty');
});