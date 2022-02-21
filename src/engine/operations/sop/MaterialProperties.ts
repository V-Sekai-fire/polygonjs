import {BaseSopOperation} from './_Base';
import {CoreGroup} from '../../../core/geometry/Group';
import {Mesh} from 'three/src/objects/Mesh';
import {Material} from 'three/src/materials/Material';
import {InputCloneMode} from '../../../engine/poly/InputCloneMode';
import {isBooleanTrue} from '../../../core/BooleanValue';
import {DefaultOperationParams} from '../../../core/operations/_Base';
import {updateMaterialSide} from '../../nodes/mat/utils/helpers/MaterialSideHelper';
interface MaterialPropertiesSopParams extends DefaultOperationParams {
	applyToChildren: boolean;
	// side
	tside: boolean;
	doubleSided: boolean;
	front: boolean;
	overrideShadowSide: boolean;
	shadowDoubleSided: boolean;
	shadowFront: boolean;
}

export class MaterialPropertiesSopOperation extends BaseSopOperation {
	static override readonly DEFAULT_PARAMS: MaterialPropertiesSopParams = {
		applyToChildren: false,
		// side
		tside: false,
		doubleSided: false,
		front: true,
		overrideShadowSide: false,
		shadowDoubleSided: false,
		shadowFront: true,
	};
	static override readonly INPUT_CLONED_STATE = InputCloneMode.FROM_NODE;
	static override type(): Readonly<'materialProperties'> {
		return 'materialProperties';
	}

	override async cook(inputCoreGroups: CoreGroup[], params: MaterialPropertiesSopParams) {
		const coreGroup = inputCoreGroups[0];

		const objects: Mesh[] = [];
		for (let object of coreGroup.objects() as Mesh[]) {
			if (isBooleanTrue(params.applyToChildren)) {
				object.traverse((child) => {
					objects.push(child as Mesh);
				});
			} else {
				objects.push(object);
			}
		}
		for (let object of objects) {
			this._updateObject(object, params);
		}
		return coreGroup;
	}
	private _updateObject(object: Mesh, params: MaterialPropertiesSopParams) {
		const material = object.material as Material;
		if (material) {
			this._updateMaterial(material, params);
		}
	}
	private async _updateMaterial(material: Material, params: MaterialPropertiesSopParams) {
		if (isBooleanTrue(params.tside)) {
			updateMaterialSide(material, params);
		}
	}
}