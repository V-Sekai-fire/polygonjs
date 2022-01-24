import {UniformsUtils} from 'three/src/renderers/shaders/UniformsUtils';
import {ShaderMaterial} from 'three/src/materials/ShaderMaterial';
import {ShaderLib} from 'three/src/renderers/shaders/ShaderLib';
import {RGBADepthPacking} from 'three/src/constants';
import {BasicDepthPacking} from 'three/src/constants';

import {ShaderAssemblerMaterial} from '../../_BaseMaterial';

import TemplateVertex from '../../../../templates/custom/points/CustomPointsDistance.vert.glsl';
import TemplateFragment from '../../../../templates/custom/mesh/CustomMeshDepth.frag.glsl';

import {ShaderName} from '../../../../../../utils/shaders/ShaderName';

const INSERT_DEFINE_AFTER_MAP: Map<ShaderName, string> = new Map([
	[ShaderName.VERTEX, '// INSERT DEFINES'],
	[ShaderName.FRAGMENT, '// INSERT DEFINES'],
]);
const INSERT_BODY_AFTER_MAP: Map<ShaderName, string> = new Map([
	[ShaderName.VERTEX, '// INSERT BODY'],
	[ShaderName.FRAGMENT, '// INSERT BODY'],
]);
export class ShaderAssemblerCustomPointsDistance extends ShaderAssemblerMaterial {
	// _color_declaration() { return 'vec4 diffuseColor' }
	// _template_shader(){ return ShaderLib.standard }
	override templateShader() {
		const template = ShaderLib.distanceRGBA;

		const uniforms = UniformsUtils.clone(template.uniforms);
		uniforms['size'] = {value: 1};
		uniforms['scale'] = {value: 1};

		return {
			vertexShader: TemplateVertex,
			fragmentShader: TemplateFragment,
			uniforms: uniforms,
		};
	}
	protected override insert_define_after(shader_name: ShaderName) {
		return INSERT_DEFINE_AFTER_MAP.get(shader_name);
	}
	protected override insert_body_after(shader_name: ShaderName) {
		return INSERT_BODY_AFTER_MAP.get(shader_name);
	}

	override createMaterial() {
		const template_shader = this.templateShader();
		return new ShaderMaterial({
			// vertexColors: VertexColors,
			// side: FrontSide,
			// transparent: true,
			// fog: true,
			// lights: true,
			defines: {
				USE_SIZEATTENUATION: 1,
				DEPTH_PACKING: [RGBADepthPacking, BasicDepthPacking][0],
			},

			uniforms: UniformsUtils.clone(template_shader.uniforms),
			vertexShader: template_shader.vertexShader,
			fragmentShader: template_shader.fragmentShader,
		});
	}
}
