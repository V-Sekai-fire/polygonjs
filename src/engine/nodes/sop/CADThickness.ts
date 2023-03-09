/**
 * Adds a thickness to CAD input objects
 *
 *
 */
import {CADSopNode} from './_BaseCAD';
import {NodeParamsConfig, ParamConfig} from '../utils/params/ParamsConfig';
import {step} from '../../../core/geometry/cad/CadConstant';
import {CoreCadType} from '../../../core/geometry/cad/CadCoreType';
import {
	CadGeometryType,
	TopoDS_Face,
	TopoDS_Shape,
	OpenCascadeInstance,
	cadGeometryTypeFromShape,
} from '../../../core/geometry/cad/CadCommon';
import {traverseFaces} from '../../../core/geometry/cad/CadTraverse';
// import {withCadException} from '../../../core/geometry/cad/CadExceptionHandler';
import {MapUtils} from '../../../core/MapUtils';
import {SetUtils} from '../../../core/SetUtils';
import {Line3, Vector3} from 'three';
import {CoreGroup} from '../../../core/geometry/Group';
import {SopType} from '../../poly/registers/nodes/types/Sop';
import {CadObject} from '../../../core/geometry/cad/CadObject';
import {CadLoaderSync} from '../../../core/geometry/cad/CadLoaderSync';

const line = new Line3();
const normalizedAxis = new Vector3();
const faceCenter = new Vector3();
const projected = new Vector3();
const facesByDist: Map<number, Set<TopoDS_Face>> = new Map();
const faceDists: Set<number> = new Set();

// TODO: find more meaningful name
class CADThicknessSopParamsConfig extends NodeParamsConfig {
	/** @param offset */
	offset = ParamConfig.FLOAT(-0.1, {
		range: [-1, 1],
		rangeLocked: [true, false],
		step,
	});
	/** @param remove faces */
	// removeFaces = ParamConfig.BOOLEAN(true);
	/** @param number of faces to remove */
	facesCount = ParamConfig.INTEGER(1, {
		range: [0, 10],
		rangeLocked: [true, false],
		// visibleIf: {removeFaces: true},
	});
	/** @param axis along which the faces to be removed are sorted */
	facesSortAxis = ParamConfig.VECTOR3([0, 0, 1], {
		// visibleIf: {removeFaces: true},
	});
}
const ParamsConfig = new CADThicknessSopParamsConfig();

export class CADThicknessSopNode extends CADSopNode<CADThicknessSopParamsConfig> {
	override paramsConfig = ParamsConfig;
	static override type() {
		return SopType.CAD_THICKNESS;
	}
	protected override initializeNode() {
		this.io.inputs.setCount(1);
	}

	override cook(inputCoreGroups: CoreGroup[]) {
		const oc = CadLoaderSync.oc();
		const inputCoreGroup = inputCoreGroups[0];

		line.start.set(0, 0, 0);
		normalizedAxis.copy(this.pv.facesSortAxis).normalize();
		line.end.copy(normalizedAxis);
		const newObjects: CadObject<CadGeometryType>[] = [];

		const inputObjects = inputCoreGroup.cadObjects();
		if (inputObjects) {
			for (let inputObject of inputObjects) {
				if (CoreCadType.isShape(inputObject)) {
					const shape = inputObject.cadGeometry();
					const newShape = this._makeSolidByJoin(oc, shape, line);
					if (newShape) {
						const type = cadGeometryTypeFromShape(oc, newShape);
						if (type) {
							newObjects.push(new CadObject(newShape, type));
						} else {
							console.log('no type', shape);
						}
					}
				} else {
					newObjects.push(inputObject);
				}
			}
		}

		this.setCADObjects(newObjects);
	}

	// private _makeSolid(oc: OpenCascadeInstance, shape: TopoDS_Shape, axis: Line3) {
	// 	return this.pv.removeFaces ? this._makeSolidByJoin(oc, shape, axis) : this._makeSolidBySimple(oc, shape);
	// }
	// private _makeSolidBySimple(oc: OpenCascadeInstance, shape: TopoDS_Shape) {
	// 	return withCadException(oc, () => {
	// 		const api = new oc.BRepOffsetAPI_MakeThickSolid();
	// 		api.MakeThickSolidBySimple(shape, this.pv.offset);
	// 		if(api.IsDone())
	// 		return api.Shape();
	// 	});
	// }
	private _makeSolidByJoin(oc: OpenCascadeInstance, shape: TopoDS_Shape, axis: Line3) {
		const facesToRemove = this._getFacesToRemove(oc, shape, axis);
		const faces = new oc.TopTools_ListOfShape_1();
		for (let face of facesToRemove) {
			faces.Append_1(face);
		}

		const api = new oc.BRepOffsetAPI_MakeThickSolid();
		api.MakeThickSolidByJoin(
			shape,
			faces,
			this.pv.offset,
			1e-3,
			oc.BRepOffset_Mode.BRepOffset_Skin as any,
			false,
			false,
			oc.GeomAbs_JoinType.GeomAbs_Arc as any,
			false,
			CadLoaderSync.Message_ProgressRange
		);
		const newShape = api.Shape();
		api.delete();
		faces.delete();
		return newShape;
	}

	private _getFacesToRemove(oc: OpenCascadeInstance, shape: TopoDS_Shape, axis: Line3): TopoDS_Face[] {
		facesByDist.clear();
		faceDists.clear();
		traverseFaces(oc, shape, (face) => {
			// const surface = oc.BRep_Tool.Surface_2(face);

			const surfaceProperties = CadLoaderSync.GProp_GProps;
			oc.BRepGProp.SurfaceProperties_1(face, surfaceProperties, false, false);
			const centerOfMass = surfaceProperties.CentreOfMass();

			faceCenter.set(centerOfMass.X(), centerOfMass.Y(), centerOfMass.Z());
			axis.closestPointToPoint(faceCenter, false, projected);
			const position = projected.dot(axis.end);
			// const currentFace = new oc.TopExp_Explorer_2(
			// 	face,
			// 	oc.TopAbs_ShapeEnum.TopAbs_FACE as any,
			// 	oc.TopAbs_ShapeEnum.TopAbs_SHAPE as any
			// ).Current();
			MapUtils.addToSetAtEntry(facesByDist, position, face);
			faceDists.add(position);
		});
		const dists = SetUtils.toArray(faceDists);
		const sortedDists = dists.sort((a, b) => (a > b ? 1 : -1));
		const facesToRemove: TopoDS_Face[] = [];
		for (let dist of sortedDists) {
			const faces = facesByDist.get(dist);
			if (faces) {
				for (let face of faces) {
					facesToRemove.push(face);
					if (facesToRemove.length >= this.pv.facesCount) {
						return facesToRemove;
					}
				}
			}
		}
		return facesToRemove;
	}
}
