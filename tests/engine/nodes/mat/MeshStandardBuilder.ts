import {GlConnectionPointType} from '../../../../src/engine/nodes/utils/io/connections/Gl';
import {SceneJsonExporter} from '../../../../src/engine/io/json/export/Scene';
import {SceneJsonImporter} from '../../../../src/engine/io/json/import/Scene';
import {BaseBuilderMatNodeType} from '../../../../src/engine/nodes/mat/_BaseBuilder';
import {FloatParam} from '../../../../src/engine/params/Float';
import {Vector3Param} from '../../../../src/engine/params/Vector3';
import {AssemblersUtils} from '../../../helpers/AssemblersUtils';

QUnit.test('mesh standard builder persisted_config', async (assert) => {
	const MAT = window.MAT;
	const mesh_standard1 = MAT.createNode('mesh_standard_builder');
	mesh_standard1.createNode('output');
	mesh_standard1.createNode('globals');
	const output1 = mesh_standard1.nodes_by_type('output')[0];
	const globals1 = mesh_standard1.nodes_by_type('globals')[0];
	const param1 = mesh_standard1.createNode('param');
	param1.p.name.set('float_param');
	const param2 = mesh_standard1.createNode('param');
	param2.set_gl_type(GlConnectionPointType.VEC3);
	param2.p.name.set('vec3_param');
	const float_to_vec31 = mesh_standard1.createNode('float_to_vec3');
	float_to_vec31.set_input(0, param1);
	float_to_vec31.set_input(1, globals1, 'time');
	output1.set_input('color', float_to_vec31);
	output1.set_input('position', param2);
	await mesh_standard1.request_container();

	const scene = window.scene;
	const data = new SceneJsonExporter(scene).data();
	await AssemblersUtils.with_unregistered_assembler(mesh_standard1.used_assembler(), async () => {
		console.log('************ LOAD **************');
		const scene2 = await SceneJsonImporter.load_data(data);
		await scene2.wait_for_cooks_completed();

		const new_mesh_standard1 = scene2.node('/MAT/mesh_standard_builder1') as BaseBuilderMatNodeType;
		assert.notOk(new_mesh_standard1.assembler_controller);
		assert.ok(new_mesh_standard1.persisted_config);
		const float_param = new_mesh_standard1.params.get('float_param') as FloatParam;
		const vec3_param = new_mesh_standard1.params.get('vec3_param') as Vector3Param;
		assert.ok(float_param);
		assert.ok(vec3_param);
		const material = new_mesh_standard1.material;
		assert.equal(material.fragmentShader, mesh_standard1.material.fragmentShader);
		assert.equal(material.vertexShader, mesh_standard1.material.vertexShader);

		// float param callback
		assert.equal(material.uniforms.v_POLY_param1_val.value, 0);
		float_param.set(2);
		assert.equal(material.uniforms.v_POLY_param1_val.value, 2);
		float_param.set(4);
		assert.equal(material.uniforms.v_POLY_param1_val.value, 4);

		// vector3 param callback
		assert.deepEqual(material.uniforms.v_POLY_param2_val.value.toArray(), [0, 0, 0]);
		vec3_param.set([1, 2, 3]);
		assert.deepEqual(material.uniforms.v_POLY_param2_val.value.toArray(), [1, 2, 3]);
		vec3_param.set([5, 6, 7]);
		assert.deepEqual(material.uniforms.v_POLY_param2_val.value.toArray(), [5, 6, 7]);
	});
});
