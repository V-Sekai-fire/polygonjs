import {UniformsUtils} from 'three/src/renderers/shaders/UniformsUtils';
import {ShaderLib} from 'three/src/renderers/shaders/ShaderLib';

import {GlobalsGlNode} from '../../../../src/engine/nodes/gl/Globals';
import {OutputGlNode} from '../../../../src/engine/nodes/gl/Output';
import {GlConnectionPointType} from '../../../../src/engine/nodes/utils/io/connections/Gl';
import {ConstantGlNode} from '../../../../src/engine/nodes/gl/Constant';
// import {CoreSleep} from '../../../../src/core/Sleep';
import {SceneJsonImporter} from '../../../../src/engine/io/json/import/Scene';
import {SceneJsonExporter} from '../../../../src/engine/io/json/export/Scene';

import BasicDefaultVertex from './templates/mesh_basic_builder/Basic.default.vert.glsl';
import BasicDefaultFragment from './templates/mesh_basic_builder/Basic.default.frag.glsl';
import BasicMinimalVertex from './templates/mesh_basic_builder/Basic.minimal.vert.glsl';
import BasicMinimalFragment from './templates/mesh_basic_builder/Basic.minimal.frag.glsl';
import BasicPositionVertex from './templates/mesh_basic_builder/Basic.position.vert.glsl';
import BasicPositionFragment from './templates/mesh_basic_builder/Basic.position.frag.glsl';
import BasicPositionXZVertex from './templates/mesh_basic_builder/Basic.positionXZ.vert.glsl';
import BasicPositionXZFragment from './templates/mesh_basic_builder/Basic.positionXZ.frag.glsl';
import BasicAttribInVertexVertex from './templates/mesh_basic_builder/Basic.attribInVertex.vert.glsl';
import BasicAttribInVertexFragment from './templates/mesh_basic_builder/Basic.attribInVertex.frag.glsl';
import BasicAttribInFragmentVertex from './templates/mesh_basic_builder/Basic.attribInFragment.vert.glsl';
import BasicAttribInFragmentFragment from './templates/mesh_basic_builder/Basic.attribInFragment.frag.glsl';
import BasicAttribInFragmentOnlyVertex from './templates/mesh_basic_builder/Basic.attribInFragmentOnly.vert.glsl';
import BasicAttribInFragmentOnlyFragment from './templates/mesh_basic_builder/Basic.attribInFragmentOnly.frag.glsl';
import BasicIfThenVertex from './templates/mesh_basic_builder/Basic.IfThen.vert.glsl';
import BasicIfThenFragment from './templates/mesh_basic_builder/Basic.IfThen.frag.glsl';
import BasicIfThenRotateFragment from './templates/mesh_basic_builder/Basic.IfThenRotate.frag.glsl';
import BasicForLoopFragment from './templates/mesh_basic_builder/Basic.ForLoop.frag.glsl';
import BasicSubnetFragment from './templates/mesh_basic_builder/Basic.Subnet.frag.glsl';

import {BaseBuilderMatNodeType} from '../../../../src/engine/nodes/mat/_BaseBuilder';
import {Vec4ToVec3GlNode} from '../../../../src/engine/nodes/gl/_ConversionVecTo';
import {TextureGlNode} from '../../../../src/engine/nodes/gl/Texture';
import {GlCompareTestName} from '../../../../src/engine/nodes/gl/Compare';
import {FloatParam} from '../../../../src/engine/params/Float';
import {Vector3Param} from '../../../../src/engine/params/Vector3';
import {AssemblersUtils} from '../../../helpers/AssemblersUtils';
import {create_required_nodes_for_subnet_gl_node} from '../gl/Subnet';
import {create_required_nodes_for_if_then_gl_node} from '../gl/IfThen';
import {create_required_nodes_for_for_loop_gl_node} from '../gl/ForLoop';

const TEST_SHADER_LIB = {
	default: {vert: BasicDefaultVertex, frag: BasicDefaultFragment},
	minimal: {vert: BasicMinimalVertex, frag: BasicMinimalFragment},
	position: {vert: BasicPositionVertex, frag: BasicPositionFragment},
	positionXZ: {vert: BasicPositionXZVertex, frag: BasicPositionXZFragment},
	attribInVertex: {vert: BasicAttribInVertexVertex, frag: BasicAttribInVertexFragment},
	attribInFragment: {vert: BasicAttribInFragmentVertex, frag: BasicAttribInFragmentFragment},
	attribInFragmentOnly: {vert: BasicAttribInFragmentOnlyVertex, frag: BasicAttribInFragmentOnlyFragment},
	IfThen: {vert: BasicIfThenVertex, frag: BasicIfThenFragment},
	IfThenRotate: {vert: BasicIfThenVertex, frag: BasicIfThenRotateFragment},
	ForLoop: {vert: BasicIfThenVertex, frag: BasicForLoopFragment},
	Subnet: {vert: BasicIfThenVertex, frag: BasicSubnetFragment},
};

const BASIC_UNIFORMS = UniformsUtils.clone(ShaderLib.basic.uniforms);

QUnit.test('mesh basic builder simple', async (assert) => {
	const MAT = window.MAT;
	// const debug = MAT.createNode('test')
	const mesh_basic1 = MAT.createNode('mesh_basic_builder');
	mesh_basic1.createNode('output');
	mesh_basic1.createNode('globals');
	const material = mesh_basic1.material;
	const globals1: GlobalsGlNode = mesh_basic1.node('globals1')! as GlobalsGlNode;
	const output1: OutputGlNode = mesh_basic1.node('output1')! as OutputGlNode;

	await mesh_basic1.request_container();
	assert.equal(material.vertexShader, TEST_SHADER_LIB.default.vert);
	assert.equal(material.fragmentShader, TEST_SHADER_LIB.default.frag);
	assert.deepEqual(Object.keys(material.uniforms).sort(), Object.keys(BASIC_UNIFORMS).sort());

	const constant1 = mesh_basic1.createNode('constant');
	constant1.set_gl_type(GlConnectionPointType.VEC3);
	constant1.p.vec3.set([1, 0, 0.5]);
	output1.set_input('color', constant1, ConstantGlNode.OUTPUT_NAME);
	// output1.p.color.set([1, 0, 0.5]);
	await mesh_basic1.request_container();
	assert.equal(material.vertexShader, TEST_SHADER_LIB.minimal.vert);
	assert.equal(material.fragmentShader, TEST_SHADER_LIB.minimal.frag);
	output1.set_input('color', globals1, 'position');

	await mesh_basic1.request_container();
	assert.equal(material.vertexShader, TEST_SHADER_LIB.position.vert);
	assert.equal(material.fragmentShader, TEST_SHADER_LIB.position.frag);

	const vec3_to_float1 = mesh_basic1.createNode('vec3_to_float');
	const float_to_vec3_1 = mesh_basic1.createNode('float_to_vec3');
	float_to_vec3_1.set_input('x', vec3_to_float1, 'x');
	float_to_vec3_1.set_input('z', vec3_to_float1, 'y');
	vec3_to_float1.set_input('vec', globals1, 'position');
	output1.set_input('color', float_to_vec3_1);

	await mesh_basic1.request_container();

	assert.equal(material.lights, false);
	assert.equal(material.vertexShader, TEST_SHADER_LIB.positionXZ.vert);
	assert.equal(material.fragmentShader, TEST_SHADER_LIB.positionXZ.frag);

	// add frame dependency
	const float_to_vec3_2 = mesh_basic1.createNode('float_to_vec3');
	float_to_vec3_2.set_input('z', globals1, 'time');
	output1.set_input('position', float_to_vec3_2, 'vec3');
	await mesh_basic1.request_container();
	assert.deepEqual(Object.keys(material.uniforms).sort(), Object.keys(BASIC_UNIFORMS).concat(['time']).sort());
});

QUnit.test('mesh basic builder can save and load param configs', async (assert) => {
	const scene = window.scene;
	const MAT = window.MAT;
	const mesh_basic1 = MAT.createNode('mesh_basic_builder');
	mesh_basic1.createNode('output');
	mesh_basic1.createNode('globals');
	await scene.wait_for_cooks_completed();

	await mesh_basic1.request_container();
	assert.deepEqual(mesh_basic1.params.spare_names.sort(), []);
	assert.notOk(mesh_basic1.assembler_controller?.compile_required());

	const output1 = mesh_basic1.node('output1')! as OutputGlNode;
	const attribute1 = mesh_basic1.createNode('attribute');
	const texture1 = mesh_basic1.createNode('texture');
	const vec4_to_vector1 = mesh_basic1.createNode('vec4_to_vec3');
	output1.set_input('color', vec4_to_vector1, Vec4ToVec3GlNode.OUTPUT_NAME_VEC3);
	vec4_to_vector1.set_input('vec4', texture1, TextureGlNode.OUTPUT_NAME);
	texture1.set_input('uv', attribute1);
	attribute1.p.name.set('uv');
	attribute1.set_gl_type(GlConnectionPointType.VEC2);

	// await CoreSleep.sleep(50);

	assert.ok(mesh_basic1.assembler_controller?.compile_required(), 'compiled is required');
	await mesh_basic1.request_container();
	assert.notOk(mesh_basic1.assembler_controller?.compile_required(), 'compiled is required');
	// mesh_basic1.param_names();
	assert.deepEqual(mesh_basic1.params.spare_names.sort(), ['texture_map'], 'spare params has texture_map');
	assert.equal(mesh_basic1.p.texture_map.value, '/COP/image_uv', 'texture_map value is "/COP/image_uv"');
	mesh_basic1.params.get('texture_map')!.set('/COP/file2');

	const data = new SceneJsonExporter(scene).data();

	console.log('************ LOAD **************');
	const scene2 = await SceneJsonImporter.load_data(data);
	await scene2.wait_for_cooks_completed();

	const new_mesh_basic1 = scene2.node('/MAT/mesh_basic_builder1') as BaseBuilderMatNodeType;
	await new_mesh_basic1.request_container();
	assert.notOk(new_mesh_basic1.assembler_controller?.compile_required(), 'compile is not required');
	assert.deepEqual(new_mesh_basic1.params.spare_names.sort(), ['texture_map'], 'spare params has texture_map');
	assert.equal(new_mesh_basic1.params.get('texture_map')?.value, '/COP/file2', 'texture_map value is "/COP/file_uv"');
});

QUnit.test(
	'mesh basic builder: attrib is declared accordingly and uses varying if used in fragment',
	async (assert) => {
		const MAT = window.MAT;
		const mesh_basic1 = MAT.createNode('mesh_basic_builder');
		mesh_basic1.createNode('output');
		mesh_basic1.createNode('globals');
		const material = mesh_basic1.material;
		const output1 = mesh_basic1.node('output1')! as OutputGlNode;
		const attribute1 = mesh_basic1.createNode('attribute');
		attribute1.p.name.set('uv');
		attribute1.set_gl_type(GlConnectionPointType.VEC2);
		const vec2_to_float1 = mesh_basic1.createNode('vec2_to_float');
		const float_to_vec31 = mesh_basic1.createNode('float_to_vec3');
		vec2_to_float1.set_input(0, attribute1);
		float_to_vec31.set_input('x', vec2_to_float1, 'x');
		float_to_vec31.set_input('z', vec2_to_float1, 'y');
		output1.set_input('position', float_to_vec31);

		assert.ok(mesh_basic1.assembler_controller?.compile_required(), 'compiled is required');
		await mesh_basic1.request_container();
		assert.notOk(mesh_basic1.assembler_controller?.compile_required(), 'compiled is required');
		assert.equal(material.vertexShader, TEST_SHADER_LIB.attribInVertex.vert);
		assert.equal(material.fragmentShader, TEST_SHADER_LIB.attribInVertex.frag);

		// set uv to color, to have it declared to the fragment shader
		output1.set_input('color', float_to_vec31);
		await mesh_basic1.request_container();
		assert.equal(material.vertexShader, TEST_SHADER_LIB.attribInFragment.vert);
		assert.equal(material.fragmentShader, TEST_SHADER_LIB.attribInFragment.frag);
		// remove uv from position, to have it declared ONLY to the fragment shader
		output1.set_input('position', null);
		await mesh_basic1.request_container();
		assert.equal(material.vertexShader, TEST_SHADER_LIB.attribInFragmentOnly.vert);
		assert.equal(material.fragmentShader, TEST_SHADER_LIB.attribInFragmentOnly.frag);
	}
);

QUnit.test('mesh basic builder with if_then', async (assert) => {
	const MAT = window.MAT;
	const mesh_basic1 = MAT.createNode('mesh_basic_builder');
	mesh_basic1.createNode('output');
	mesh_basic1.createNode('globals');
	const material = mesh_basic1.material;
	const output1 = mesh_basic1.nodes_by_type('output')[0];
	const globals1 = mesh_basic1.nodes_by_type('globals')[0];
	const vec3_to_float1 = mesh_basic1.createNode('vec3_to_float');
	const compare1 = mesh_basic1.createNode('compare');
	const if_then1 = mesh_basic1.createNode('if_then');
	const {subnet_input1, subnet_output1} = create_required_nodes_for_if_then_gl_node(if_then1);
	const if_then_subnet_input1 = subnet_input1;
	const if_then_subnet_output1 = subnet_output1;
	const mult_add1 = if_then1.createNode('mult_add');

	vec3_to_float1.set_input(0, globals1, 'position');
	compare1.set_input(0, vec3_to_float1, 1);
	compare1.set_test_name(GlCompareTestName.LESS_THAN);
	if_then1.set_input(0, compare1);
	if_then1.set_input(1, globals1, 'position');
	output1.set_input('color', if_then1, 'position');
	mult_add1.set_input(0, if_then_subnet_input1);
	mult_add1.params.get('mult')!.set([2, 2, 2]);
	if_then_subnet_output1.set_input(0, mult_add1);

	assert.ok(mesh_basic1.assembler_controller?.compile_required(), 'compiled is required');
	await mesh_basic1.request_container();
	assert.notOk(mesh_basic1.assembler_controller?.compile_required(), 'compiled is required');
	assert.equal(material.vertexShader, TEST_SHADER_LIB.IfThen.vert);
	assert.equal(material.fragmentShader, TEST_SHADER_LIB.IfThen.frag);

	// now add a node that would create a function
	const rotate1 = if_then1.createNode('rotate');
	rotate1.set_input(0, if_then_subnet_input1);
	if_then_subnet_output1.set_input(0, rotate1);
	assert.ok(mesh_basic1.assembler_controller?.compile_required(), 'compiled is required');
	await mesh_basic1.request_container();
	assert.notOk(mesh_basic1.assembler_controller?.compile_required(), 'compiled is required');
	assert.equal(material.vertexShader, TEST_SHADER_LIB.IfThenRotate.vert);
	assert.equal(material.fragmentShader, TEST_SHADER_LIB.IfThenRotate.frag);
});

QUnit.test('mesh basic builder with for_loop', async (assert) => {
	const MAT = window.MAT;
	const mesh_basic1 = MAT.createNode('mesh_basic_builder');
	mesh_basic1.createNode('output');
	mesh_basic1.createNode('globals');
	const material = mesh_basic1.material;
	const output1 = mesh_basic1.nodes_by_type('output')[0];
	const globals1 = mesh_basic1.nodes_by_type('globals')[0];
	const for_loop1 = mesh_basic1.createNode('for_loop');
	const {subnet_input1, subnet_output1} = create_required_nodes_for_for_loop_gl_node(for_loop1);
	const for_loop_subnet_input1 = subnet_input1;
	const for_loop_subnet_output1 = subnet_output1;
	const add1 = for_loop1.createNode('add');

	for_loop1.set_input(0, globals1, 'position');
	output1.set_input('color', for_loop1);
	for_loop_subnet_output1.set_input(0, add1);
	add1.set_input(0, for_loop_subnet_input1);
	add1.params.get('add1')!.set([0.1, 0.1, 0.1]);

	assert.ok(mesh_basic1.assembler_controller?.compile_required(), 'compiled is required');
	await mesh_basic1.request_container();
	assert.notOk(mesh_basic1.assembler_controller?.compile_required(), 'compiled is required');
	assert.equal(material.vertexShader, TEST_SHADER_LIB.ForLoop.vert);
	assert.equal(material.fragmentShader, TEST_SHADER_LIB.ForLoop.frag);
});

QUnit.test('mesh basic builder with subnet', async (assert) => {
	const MAT = window.MAT;
	const mesh_basic1 = MAT.createNode('mesh_basic_builder');
	mesh_basic1.createNode('output');
	mesh_basic1.createNode('globals');
	const material = mesh_basic1.material;
	const output1 = mesh_basic1.nodes_by_type('output')[0];
	const globals1 = mesh_basic1.nodes_by_type('globals')[0];
	const subnet1 = mesh_basic1.createNode('subnet');
	const {subnet_input1, subnet_output1} = create_required_nodes_for_subnet_gl_node(subnet1);
	const subnet_subnet_input1 = subnet_input1;
	const subnet_subnet_output1 = subnet_output1;
	const add1 = subnet1.createNode('add');

	subnet1.set_input(0, globals1, 'position');
	output1.set_input('color', subnet1);
	subnet_subnet_output1.set_input(0, add1);
	add1.set_input(0, subnet_subnet_input1);
	add1.params.get('add1')!.set([1.0, 0.5, 0.25]);

	assert.ok(mesh_basic1.assembler_controller?.compile_required(), 'compiled is required');
	await mesh_basic1.request_container();
	assert.notOk(mesh_basic1.assembler_controller?.compile_required(), 'compiled is required');
	assert.equal(material.vertexShader, TEST_SHADER_LIB.Subnet.vert);
	assert.equal(material.fragmentShader, TEST_SHADER_LIB.Subnet.frag);
});

QUnit.test('mesh basic builder persisted_config', async (assert) => {
	const MAT = window.MAT;
	const mesh_basic1 = MAT.createNode('mesh_basic_builder');
	mesh_basic1.createNode('output');
	mesh_basic1.createNode('globals');
	const output1 = mesh_basic1.nodes_by_type('output')[0];
	const globals1 = mesh_basic1.nodes_by_type('globals')[0];
	const param1 = mesh_basic1.createNode('param');
	param1.p.name.set('float_param');
	const param2 = mesh_basic1.createNode('param');
	param2.set_gl_type(GlConnectionPointType.VEC3);
	param2.p.name.set('vec3_param');
	const float_to_vec31 = mesh_basic1.createNode('float_to_vec3');
	float_to_vec31.set_input(0, param1);
	float_to_vec31.set_input(1, globals1, 'time');
	output1.set_input('color', float_to_vec31);
	output1.set_input('position', param2);
	await mesh_basic1.request_container();

	const scene = window.scene;
	const data = new SceneJsonExporter(scene).data();
	await AssemblersUtils.with_unregistered_assembler(mesh_basic1.used_assembler(), async () => {
		console.log('************ LOAD **************');
		const scene2 = await SceneJsonImporter.load_data(data);
		await scene2.wait_for_cooks_completed();

		const new_mesh_basic1 = scene2.node('/MAT/mesh_basic_builder1') as BaseBuilderMatNodeType;
		assert.notOk(new_mesh_basic1.assembler_controller);
		assert.ok(new_mesh_basic1.persisted_config);
		const float_param = new_mesh_basic1.params.get('float_param') as FloatParam;
		const vec3_param = new_mesh_basic1.params.get('vec3_param') as Vector3Param;
		assert.ok(float_param);
		assert.ok(vec3_param);
		const material = new_mesh_basic1.material;
		assert.equal(material.fragmentShader, mesh_basic1.material.fragmentShader);
		assert.equal(material.vertexShader, mesh_basic1.material.vertexShader);

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

QUnit.skip('mesh basic builder frame dependent', (assert) => {});

QUnit.skip('mesh basic builder bbox dependent', (assert) => {});

QUnit.skip('mesh basic builder basic instanced works without an input node', (assert) => {});
