import {TransformTargetType} from '../../../../src/core/Transform';
import {CenterMode} from '../../../../src/engine/operations/sop/Center';
import type {QUnit} from '../../../helpers/QUnit';
import {BufferAttribute} from 'three';
export function testenginenodessopCenter(qUnit: QUnit) {
	qUnit.test('sop/center simple (object origin)', async (assert) => {
		const geo1 = window.geo1;

		const box1 = geo1.createNode('box');
		const transform1 = geo1.createNode('transform');
		const center1 = geo1.createNode('center');

		transform1.setInput(0, box1);
		transform1.setApplyOn(TransformTargetType.OBJECT);
		transform1.p.t.set([1, 3, 4]);
		center1.setInput(0, transform1);
		center1.setMode(CenterMode.OBJECT_ORIGIN);

		let container = await center1.compute();
		const geometry = container.coreContent()!.threejsObjectsWithGeo()[0].geometry;
		const positions = (geometry.getAttribute('position') as BufferAttribute).array ;
		assert.deepEqual(positions.join(','), [1, 3, 4].join(','));
	});

	qUnit.test('sop/center simple (geometry center)', async (assert) => {
		const geo1 = window.geo1;

		const box1 = geo1.createNode('box');
		const transform1 = geo1.createNode('transform');
		const center1 = geo1.createNode('center');

		transform1.setInput(0, box1);
		transform1.p.t.set([1, 3, 4]);
		center1.setInput(0, transform1);
		center1.setMode(CenterMode.GEOMETRY_CENTER);

		let container = await center1.compute();
		const geometry = container.coreContent()!.threejsObjectsWithGeo()[0].geometry;
		const positions = (geometry.getAttribute('position') as BufferAttribute).array ;
		assert.deepEqual(positions.join(','), [1, 3, 4].join(','));
	});

	qUnit.test('sop/center with multiple objects (object origin)', async (assert) => {
		const geo1 = window.geo1;

		const box1 = geo1.createNode('box');
		const box2 = geo1.createNode('box');
		const transform1 = geo1.createNode('transform');
		transform1.setApplyOn(TransformTargetType.OBJECT);
		const transform2 = geo1.createNode('transform');
		const merge = geo1.createNode('merge');
		const center1 = geo1.createNode('center');

		transform1.setInput(0, box1);
		transform2.setInput(0, box2);
		transform1.p.t.set([1, 3, 4]);
		transform2.p.t.set([-1, 5, 2]);
		merge.setInput(0, transform1);
		merge.setInput(1, transform2);
		merge.p.compact.set(0);
		center1.setInput(0, merge);
		center1.setMode(CenterMode.OBJECT_ORIGIN);

		let container = await center1.compute();
		const geometry = container.coreContent()!.threejsObjectsWithGeo()[0].geometry;
		const positions = (geometry.getAttribute('position') as BufferAttribute).array;
		assert.deepEqual(positions.join(','), [1, 3, 4, 0, 0, 0].join(','));
	});

	qUnit.test('sop/center with multiple objects (geometry center)', async (assert) => {
		const geo1 = window.geo1;

		const box1 = geo1.createNode('box');
		const box2 = geo1.createNode('box');
		const transform1 = geo1.createNode('transform');
		const transform2 = geo1.createNode('transform');
		const merge = geo1.createNode('merge');
		const center1 = geo1.createNode('center');

		transform1.setInput(0, box1);
		transform2.setInput(0, box2);
		transform1.p.t.set([1, 3, 4]);
		transform2.p.t.set([-1, 5, 2]);
		merge.setInput(0, transform1);
		merge.setInput(1, transform2);
		merge.p.compact.set(0);
		center1.setInput(0, merge);
		center1.setMode(CenterMode.GEOMETRY_CENTER);

		let container = await center1.compute();
		const geometry = container.coreContent()!.threejsObjectsWithGeo()[0].geometry;
		const positions = (geometry.getAttribute('position') as BufferAttribute).array;
		assert.deepEqual(positions.join(','), [1, 3, 4, -1, 5, 2].join(','));
	});
}
