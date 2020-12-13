import {CATEGORY_SOP} from "./Category";
import {AddSopNode} from "../../../nodes/sop/Add";
import {AnimationCopySopNode} from "../../../nodes/sop/AnimationCopy";
import {AnimationMixerSopNode} from "../../../nodes/sop/AnimationMixer";
import {AnimationsSopNode} from "../../../nodes/sop/Animations";
import {AttribAddMultSopNode} from "../../../nodes/sop/AttribAddMult";
import {AttribCopySopNode} from "../../../nodes/sop/AttribCopy";
import {AttribCreateSopNode} from "../../../nodes/sop/AttribCreate";
import {AttribDeleteSopNode} from "../../../nodes/sop/AttribDelete";
import {AttribFromTextureSopNode} from "../../../nodes/sop/AttribFromTexture";
import {AttribNormalizeSopNode} from "../../../nodes/sop/AttribNormalize";
import {AttribPromoteSopNode} from "../../../nodes/sop/AttribPromote";
import {AttribRemapSopNode} from "../../../nodes/sop/AttribRemap";
import {AttribRenameSopNode} from "../../../nodes/sop/AttribRename";
import {AttribTransferSopNode} from "../../../nodes/sop/AttribTransfer";
import {BboxScatterSopNode} from "../../../nodes/sop/BboxScatter";
import {BlendSopNode} from "../../../nodes/sop/Blend";
import {BoxSopNode} from "../../../nodes/sop/Box";
import {CacheSopNode} from "../../../nodes/sop/Cache";
import {CenterSopNode} from "../../../nodes/sop/Center";
import {CircleSopNode} from "../../../nodes/sop/Circle";
import {Circle3PointsSopNode} from "../../../nodes/sop/Circle3Points";
import {ColorSopNode} from "../../../nodes/sop/Color";
import {ConeSopNode} from "../../../nodes/sop/Cone";
import {CopSopNode} from "../../../nodes/sop/Cop";
import {CopySopNode} from "../../../nodes/sop/Copy";
import {Css2DObjectSopNode} from "../../../nodes/sop/Css2DObject";
import {DataSopNode} from "../../../nodes/sop/Data";
import {DataUrlSopNode} from "../../../nodes/sop/DataUrl";
import {DelaySopNode} from "../../../nodes/sop/Delay";
import {DeleteSopNode} from "../../../nodes/sop/Delete";
import {DrawRangeSopNode} from "../../../nodes/sop/DrawRange";
import {EventsSopNode} from "../../../nodes/sop/Events";
import {FaceSopNode} from "../../../nodes/sop/Face";
import {FileSopNode} from "../../../nodes/sop/File";
import {FuseSopNode} from "../../../nodes/sop/Fuse";
import {HexagonsSopNode} from "../../../nodes/sop/Hexagons";
import {HierarchySopNode} from "../../../nodes/sop/Hierarchy";
import {HeightMapSopNode} from "../../../nodes/sop/HeightMap";
import {IcosahedronSopNode} from "../../../nodes/sop/Icosahedron";
import {InstanceSopNode} from "../../../nodes/sop/Instance";
import {InstancesCountSopNode} from "../../../nodes/sop/InstancesCount";
import {JitterSopNode} from "../../../nodes/sop/Jitter";
import {JsPointSopNode} from "../../../nodes/sop/JsPoint";
import {LayerSopNode} from "../../../nodes/sop/Layer";
import {LineSopNode} from "../../../nodes/sop/Line";
import {LODSopNode} from "../../../nodes/sop/LOD";
import {MapboxLayerSopNode} from "../../../nodes/sop/MapboxLayer";
import {MapboxPlaneSopNode} from "../../../nodes/sop/MapboxPlane";
import {MapboxTransformSopNode} from "../../../nodes/sop/MapboxTransform";
import {MaterialSopNode} from "../../../nodes/sop/Material";
import {MaterialsSopNode} from "../../../nodes/sop/Materials";
import {MergeSopNode} from "../../../nodes/sop/Merge";
import {NoiseSopNode} from "../../../nodes/sop/Noise";
import {NormalsSopNode} from "../../../nodes/sop/Normals";
import {NullSopNode} from "../../../nodes/sop/Null";
import {ObjectMergeSopNode} from "../../../nodes/sop/ObjectMerge";
import {ObjectPropertiesSopNode} from "../../../nodes/sop/ObjectProperties";
import {OcclusionSopNode} from "../../../nodes/sop/Occlusion";
import {OperationsComposerSopNode} from "../../../nodes/sop/OperationsComposer";
import {ParticlesSystemGpuSopNode} from "../../../nodes/sop/ParticlesSystemGpu";
import {PeakSopNode} from "../../../nodes/sop/Peak";
import {PhysicsRBDAttributesSopNode} from "../../../nodes/sop/PhysicsRBDAttributes";
import {PhysicsForceAttributesSopNode} from "../../../nodes/sop/PhysicsForceAttributes";
import {PhysicsSolverSopNode} from "../../../nodes/sop/PhysicsSolver";
import {PlaneSopNode} from "../../../nodes/sop/Plane";
import {PointSopNode} from "../../../nodes/sop/Point";
import {PolySopNode} from "../../../nodes/sop/Poly";
import {PolywireSopNode} from "../../../nodes/sop/Polywire";
import {PostProcessSopNode} from "../../../nodes/sop/PostProcess";
import {RaySopNode} from "../../../nodes/sop/Ray";
import {RenderersSopNode} from "../../../nodes/sop/Renderers";
import {ResampleSopNode} from "../../../nodes/sop/Resample";
import {RoundedBoxSopNode} from "../../../nodes/sop/RoundedBox";
import {ScatterSopNode} from "../../../nodes/sop/Scatter";
import {SkinSopNode} from "../../../nodes/sop/Skin";
import {SphereSopNode} from "../../../nodes/sop/Sphere";
import {SplitSopNode} from "../../../nodes/sop/Split";
import {SubdivideSopNode} from "../../../nodes/sop/Subdivide";
import {SubnetSopNode} from "../../../nodes/sop/Subnet";
import {SubnetInputSopNode} from "../../../nodes/sop/SubnetInput";
import {SubnetOutputSopNode} from "../../../nodes/sop/SubnetOutput";
import {SwitchSopNode} from "../../../nodes/sop/Switch";
import {TetrahedronSopNode} from "../../../nodes/sop/Tetrahedron";
import {TextSopNode} from "../../../nodes/sop/Text";
import {TexturePropertiesSopNode} from "../../../nodes/sop/TextureProperties";
import {TorusSopNode} from "../../../nodes/sop/Torus";
import {TorusKnotSopNode} from "../../../nodes/sop/TorusKnot";
import {TransformSopNode} from "../../../nodes/sop/Transform";
import {TransformCopySopNode} from "../../../nodes/sop/TransformCopy";
import {TransformMultiSopNode} from "../../../nodes/sop/TransformMulti";
import {TransformResetSopNode} from "../../../nodes/sop/TransformReset";
import {TubeSopNode} from "../../../nodes/sop/Tube";
import {UvProjectSopNode} from "../../../nodes/sop/UvProject";
import {AddSopOperation} from "../../../../core/operations/sop/Add";
import {AttribAddMultSopOperation} from "../../../../core/operations/sop/AttribAddMult";
import {AttribCopySopOperation} from "../../../../core/operations/sop/AttribCopy";
import {AttribCreateSopOperation} from "../../../../core/operations/sop/AttribCreate";
import {AttribNormalizeSopOperation} from "../../../../core/operations/sop/AttribNormalize";
import {AttribFromTextureSopOperation} from "../../../../core/operations/sop/AttribFromTexture";
import {AttribPromoteSopOperation} from "../../../../core/operations/sop/AttribPromote";
import {BoxSopOperation} from "../../../../core/operations/sop/Box";
import {CenterSopOperation} from "../../../../core/operations/sop/Center";
import {CircleSopOperation} from "../../../../core/operations/sop/Circle";
import {Css2DObjectSopOperation} from "../../../../core/operations/sop/Css2DObject";
import {FileSopOperation} from "../../../../core/operations/sop/File";
import {HierarchySopOperation} from "../../../../core/operations/sop/Hierarchy";
import {IcosahedronSopOperation} from "../../../../core/operations/sop/Icosahedron";
import {InstanceSopOperation} from "../../../../core/operations/sop/Instance";
import {JitterSopOperation} from "../../../../core/operations/sop/Jitter";
import {MergeSopOperation} from "../../../../core/operations/sop/Merge";
import {MaterialSopOperation} from "../../../../core/operations/sop/Material";
import {NullSopOperation} from "../../../../core/operations/sop/Null";
import {ObjectPropertiesSopOperation} from "../../../../core/operations/sop/ObjectProperties";
import {PeakSopOperation} from "../../../../core/operations/sop/Peak";
import {PlaneSopOperation} from "../../../../core/operations/sop/Plane";
import {RoundedBoxSopOperation} from "../../../../core/operations/sop/RoundedBox";
import {ScatterSopOperation} from "../../../../core/operations/sop/Scatter";
import {SphereSopOperation} from "../../../../core/operations/sop/Sphere";
import {SubdivideSopOperation} from "../../../../core/operations/sop/Subdivide";
import {TexturePropertiesSopOperation} from "../../../../core/operations/sop/TextureProperties";
import {TorusSopOperation} from "../../../../core/operations/sop/Torus";
import {TorusKnotSopOperation} from "../../../../core/operations/sop/TorusKnot";
import {TransformSopOperation} from "../../../../core/operations/sop/Transform";
export class SopRegister {
  static run(poly) {
    poly.registerOperation(AddSopOperation);
    poly.registerOperation(AttribAddMultSopOperation);
    poly.registerOperation(AttribCopySopOperation);
    poly.registerOperation(AttribCreateSopOperation);
    poly.registerOperation(AttribNormalizeSopOperation);
    poly.registerOperation(AttribFromTextureSopOperation);
    poly.registerOperation(AttribPromoteSopOperation);
    poly.registerOperation(BoxSopOperation);
    poly.registerOperation(CenterSopOperation);
    poly.registerOperation(CircleSopOperation);
    poly.registerOperation(Css2DObjectSopOperation);
    poly.registerOperation(FileSopOperation);
    poly.registerOperation(HierarchySopOperation);
    poly.registerOperation(IcosahedronSopOperation);
    poly.registerOperation(InstanceSopOperation);
    poly.registerOperation(JitterSopOperation);
    poly.registerOperation(MergeSopOperation);
    poly.registerOperation(MaterialSopOperation);
    poly.registerOperation(NullSopOperation);
    poly.registerOperation(ObjectPropertiesSopOperation);
    poly.registerOperation(PeakSopOperation);
    poly.registerOperation(PlaneSopOperation);
    poly.registerOperation(RoundedBoxSopOperation);
    poly.registerOperation(ScatterSopOperation);
    poly.registerOperation(SphereSopOperation);
    poly.registerOperation(SubdivideSopOperation);
    poly.registerOperation(TexturePropertiesSopOperation);
    poly.registerOperation(TorusSopOperation);
    poly.registerOperation(TorusKnotSopOperation);
    poly.registerOperation(TransformSopOperation);
    poly.registerNode(AddSopNode, CATEGORY_SOP.INPUT);
    poly.registerNode(AnimationCopySopNode, CATEGORY_SOP.ANIMATION);
    poly.registerNode(AnimationMixerSopNode, CATEGORY_SOP.ANIMATION);
    poly.registerNode(AnimationsSopNode, CATEGORY_SOP.NETWORK);
    poly.registerNode(AttribAddMultSopNode, CATEGORY_SOP.ATTRIBUTE);
    poly.registerNode(AttribCopySopNode, CATEGORY_SOP.ATTRIBUTE);
    poly.registerNode(AttribCreateSopNode, CATEGORY_SOP.ATTRIBUTE);
    poly.registerNode(AttribDeleteSopNode, CATEGORY_SOP.ATTRIBUTE);
    poly.registerNode(AttribFromTextureSopNode, CATEGORY_SOP.ATTRIBUTE);
    poly.registerNode(AttribNormalizeSopNode, CATEGORY_SOP.ATTRIBUTE);
    poly.registerNode(AttribPromoteSopNode, CATEGORY_SOP.ATTRIBUTE);
    poly.registerNode(AttribRemapSopNode, CATEGORY_SOP.ATTRIBUTE);
    poly.registerNode(AttribRenameSopNode, CATEGORY_SOP.ATTRIBUTE);
    poly.registerNode(AttribTransferSopNode, CATEGORY_SOP.ATTRIBUTE);
    poly.registerNode(BboxScatterSopNode, CATEGORY_SOP.MODIFIER);
    poly.registerNode(BlendSopNode, CATEGORY_SOP.MODIFIER);
    poly.registerNode(BoxSopNode, CATEGORY_SOP.PRIMITIVES);
    poly.registerNode(CacheSopNode, CATEGORY_SOP.MISC);
    poly.registerNode(CenterSopNode, CATEGORY_SOP.PRIMITIVES);
    poly.registerNode(CircleSopNode, CATEGORY_SOP.PRIMITIVES);
    poly.registerNode(Circle3PointsSopNode, CATEGORY_SOP.PRIMITIVES);
    poly.registerNode(ColorSopNode, CATEGORY_SOP.MODIFIER);
    poly.registerNode(ConeSopNode, CATEGORY_SOP.PRIMITIVES);
    poly.registerNode(CopSopNode, CATEGORY_SOP.NETWORK);
    poly.registerNode(CopySopNode, CATEGORY_SOP.MODIFIER);
    poly.registerNode(Css2DObjectSopNode, CATEGORY_SOP.PRIMITIVES);
    poly.registerNode(DataSopNode, CATEGORY_SOP.INPUT);
    poly.registerNode(DataUrlSopNode, CATEGORY_SOP.INPUT);
    poly.registerNode(DelaySopNode, CATEGORY_SOP.MISC);
    poly.registerNode(DeleteSopNode, CATEGORY_SOP.MODIFIER);
    poly.registerNode(DrawRangeSopNode, CATEGORY_SOP.MODIFIER);
    poly.registerNode(EventsSopNode, CATEGORY_SOP.NETWORK);
    poly.registerNode(FaceSopNode, CATEGORY_SOP.MODIFIER);
    poly.registerNode(FileSopNode, CATEGORY_SOP.INPUT);
    poly.registerNode(FuseSopNode, CATEGORY_SOP.MODIFIER);
    poly.registerNode(HexagonsSopNode, CATEGORY_SOP.PRIMITIVES);
    poly.registerNode(HeightMapSopNode, CATEGORY_SOP.MODIFIER);
    poly.registerNode(HierarchySopNode, CATEGORY_SOP.MISC);
    poly.registerNode(IcosahedronSopNode, CATEGORY_SOP.PRIMITIVES);
    poly.registerNode(InstanceSopNode, CATEGORY_SOP.RENDER);
    poly.registerNode(InstancesCountSopNode, CATEGORY_SOP.RENDER);
    poly.registerNode(JitterSopNode, CATEGORY_SOP.MODIFIER);
    poly.registerNode(JsPointSopNode, CATEGORY_SOP.ADVANCED);
    poly.registerNode(LayerSopNode, CATEGORY_SOP.MODIFIER);
    poly.registerNode(LineSopNode, CATEGORY_SOP.PRIMITIVES);
    poly.registerNode(LODSopNode, CATEGORY_SOP.ADVANCED);
    poly.registerNode(MapboxLayerSopNode, CATEGORY_SOP.MAP);
    poly.registerNode(MapboxPlaneSopNode, CATEGORY_SOP.MAP);
    poly.registerNode(MapboxTransformSopNode, CATEGORY_SOP.MAP);
    poly.registerNode(MaterialSopNode, CATEGORY_SOP.RENDER);
    poly.registerNode(MaterialsSopNode, CATEGORY_SOP.NETWORK);
    poly.registerNode(MergeSopNode, CATEGORY_SOP.MISC);
    poly.registerNode(NoiseSopNode, CATEGORY_SOP.MISC);
    poly.registerNode(NormalsSopNode, CATEGORY_SOP.MODIFIER);
    poly.registerNode(NullSopNode, CATEGORY_SOP.MISC);
    poly.registerNode(ObjectMergeSopNode, CATEGORY_SOP.INPUT);
    poly.registerNode(ObjectPropertiesSopNode, CATEGORY_SOP.MODIFIER);
    poly.registerNode(OcclusionSopNode, CATEGORY_SOP.RENDER);
    poly.registerNode(OperationsComposerSopNode, CATEGORY_SOP.ADVANCED, {user_allowed: false});
    poly.registerNode(ParticlesSystemGpuSopNode, CATEGORY_SOP.DYNAMICS);
    poly.registerNode(PeakSopNode, CATEGORY_SOP.MODIFIER);
    poly.registerNode(PhysicsRBDAttributesSopNode, CATEGORY_SOP.PHYSICS);
    poly.registerNode(PhysicsForceAttributesSopNode, CATEGORY_SOP.PHYSICS);
    poly.registerNode(PhysicsSolverSopNode, CATEGORY_SOP.PHYSICS);
    poly.registerNode(PlaneSopNode, CATEGORY_SOP.PRIMITIVES);
    poly.registerNode(PointSopNode, CATEGORY_SOP.MODIFIER);
    poly.registerNode(PolySopNode, CATEGORY_SOP.ADVANCED);
    poly.registerNode(PolywireSopNode, CATEGORY_SOP.MODIFIER);
    poly.registerNode(PostProcessSopNode, CATEGORY_SOP.NETWORK);
    poly.registerNode(RaySopNode, CATEGORY_SOP.MODIFIER);
    poly.registerNode(RenderersSopNode, CATEGORY_SOP.NETWORK);
    poly.registerNode(ResampleSopNode, CATEGORY_SOP.MODIFIER);
    poly.registerNode(RoundedBoxSopNode, CATEGORY_SOP.INPUT);
    poly.registerNode(ScatterSopNode, CATEGORY_SOP.MODIFIER);
    poly.registerNode(SkinSopNode, CATEGORY_SOP.MODIFIER);
    poly.registerNode(SphereSopNode, CATEGORY_SOP.PRIMITIVES);
    poly.registerNode(SplitSopNode, CATEGORY_SOP.MODIFIER);
    poly.registerNode(SubdivideSopNode, CATEGORY_SOP.MODIFIER);
    poly.registerNode(SubnetSopNode, CATEGORY_SOP.MISC);
    poly.registerNode(SubnetInputSopNode, CATEGORY_SOP.MISC);
    poly.registerNode(SubnetOutputSopNode, CATEGORY_SOP.MISC);
    poly.registerNode(SwitchSopNode, CATEGORY_SOP.MISC);
    poly.registerNode(TetrahedronSopNode, CATEGORY_SOP.PRIMITIVES);
    poly.registerNode(TextSopNode, CATEGORY_SOP.PRIMITIVES);
    poly.registerNode(TexturePropertiesSopNode, CATEGORY_SOP.MODIFIER);
    poly.registerNode(TorusSopNode, CATEGORY_SOP.PRIMITIVES);
    poly.registerNode(TorusKnotSopNode, CATEGORY_SOP.PRIMITIVES);
    poly.registerNode(TransformSopNode, CATEGORY_SOP.MODIFIER);
    poly.registerNode(TransformCopySopNode, CATEGORY_SOP.MODIFIER);
    poly.registerNode(TransformMultiSopNode, CATEGORY_SOP.MODIFIER);
    poly.registerNode(TransformResetSopNode, CATEGORY_SOP.MODIFIER);
    poly.registerNode(TubeSopNode, CATEGORY_SOP.PRIMITIVES);
    poly.registerNode(UvProjectSopNode, CATEGORY_SOP.MODIFIER);
  }
}
