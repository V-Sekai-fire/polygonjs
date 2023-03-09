import {CADGroupSopNode} from '../../CADGroup';
import {Box3, Vector3} from 'three';
import {CoreEntity} from '../../../../../core/geometry/Entity';

const bbox = new Box3();
const bboxHalfSize = new Vector3();
const entityPosition = new Vector3();

export class GroupByBoundingBoxHelper {
	constructor(private node: CADGroupSopNode) {}
	evalForEntities(allEntities: CoreEntity[], selectedIndices: Set<number>) {
		bboxHalfSize.copy(this.node.pv.boundingBoxSize).multiplyScalar(0.5);
		bbox.min.copy(this.node.pv.boundingBoxCenter).sub(bboxHalfSize);
		bbox.max.copy(this.node.pv.boundingBoxCenter).add(bboxHalfSize);

		for (let entity of allEntities) {
			entity.position(entityPosition);

			if (bbox.containsPoint(entityPosition)) {
				selectedIndices.add(entity.index());
			}
		}
	}
}
