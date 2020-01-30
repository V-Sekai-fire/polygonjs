import {Vector3} from 'three/src/math/Vector3';
import {CircleBufferGeometry} from 'three/src/geometries/CircleGeometry';
import {TypedSopNode} from './_Base';
import {CoreGeometryUtilCircle} from 'src/core/geometry/util/Circle';
import {CoreConstant} from 'src/core/geometry/Constant';
import {CoreTransform} from 'src/core/Transform';

const DEFAULT_UP = new Vector3(0, 0, 1);

import {NodeParamsConfig, ParamConfig} from 'src/engine/nodes/utils/params/ParamsConfig';
class CircleSopParamsConfig extends NodeParamsConfig {
	radius = ParamConfig.FLOAT(1);
	segments = ParamConfig.INTEGER(12, {
		range: [1, 50],
		range_locked: [true, false],
	});
	open = ParamConfig.BUTTON(1);
	arc_angle = ParamConfig.FLOAT(360, {
		range: [0, 360],
		range_locked: [false, false],
		visible_if: {open: 1},
	});
	direction = ParamConfig.VECTOR3([0, 1, 0]);
}
const ParamsConfig = new CircleSopParamsConfig();

export class CircleSopNode extends TypedSopNode<CircleSopParamsConfig> {
	params_config = ParamsConfig;
	static type() {
		return 'circle';
	}

	initialize_node() {
		// this.io.inputs.set_count(0);
		// this.io.inputs.init_inputs_clonable_state([InputCloneMode.FROM_NODE]);
	}

	cook() {
		if (this.pv.open) {
			this._create_circle();
		} else {
			this._create_disk();
		}
	}

	_create_circle() {
		const geometry = CoreGeometryUtilCircle.create(this.pv.radius, this.pv.segments, this.pv.arc_angle);

		CoreTransform.rotate_geometry_by_vector_difference(geometry, DEFAULT_UP, this.pv.direction);

		this.set_geometry(geometry, CoreConstant.OBJECT_TYPE.LINE_SEGMENTS);
	}

	_create_disk() {
		const geometry = new CircleBufferGeometry(this.pv.radius, this.pv.segments);

		CoreTransform.rotate_geometry_by_vector_difference(geometry, DEFAULT_UP, this.pv.direction);

		this.set_geometry(geometry);
	}
}
