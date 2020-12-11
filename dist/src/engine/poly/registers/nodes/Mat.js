import {CATEGORY_MAT} from "./Category";
import {LineBasicMatNode} from "../../../nodes/mat/LineBasic";
import {MeshBasicMatNode} from "../../../nodes/mat/MeshBasic";
import {MeshBasicBuilderMatNode} from "../../../nodes/mat/MeshBasicBuilder";
import {MeshLambertMatNode} from "../../../nodes/mat/MeshLambert";
import {MeshLambertBuilderMatNode} from "../../../nodes/mat/MeshLambertBuilder";
import {MeshPhongMatNode} from "../../../nodes/mat/MeshPhong";
import {MeshStandardMatNode} from "../../../nodes/mat/MeshStandard";
import {MeshStandardBuilderMatNode} from "../../../nodes/mat/MeshStandardBuilder";
import {MeshSubsurfaceScatteringMatNode} from "../../../nodes/mat/MeshSubsurfaceScattering";
import {PointsMatNode} from "../../../nodes/mat/Points";
import {PointsBuilderMatNode} from "../../../nodes/mat/PointsBuilder";
import {ShadowMatNode} from "../../../nodes/mat/Shadow";
import {SkyMatNode} from "../../../nodes/mat/Sky";
import {VolumeMatNode} from "../../../nodes/mat/Volume";
import {VolumeBuilderMatNode} from "../../../nodes/mat/VolumeBuilder";
export class MatRegister {
  static run(poly) {
    poly.register_node(LineBasicMatNode, CATEGORY_MAT.LINE);
    poly.register_node(MeshBasicMatNode, CATEGORY_MAT.MESH);
    poly.register_node(MeshBasicBuilderMatNode, CATEGORY_MAT.ADVANCED);
    poly.register_node(MeshLambertMatNode, CATEGORY_MAT.MESH);
    poly.register_node(MeshLambertBuilderMatNode, CATEGORY_MAT.ADVANCED);
    poly.register_node(MeshPhongMatNode, CATEGORY_MAT.MESH);
    poly.register_node(MeshStandardMatNode, CATEGORY_MAT.MESH);
    poly.register_node(MeshStandardBuilderMatNode, CATEGORY_MAT.ADVANCED);
    poly.register_node(MeshSubsurfaceScatteringMatNode, CATEGORY_MAT.MESH);
    poly.register_node(PointsMatNode, CATEGORY_MAT.POINTS);
    poly.register_node(PointsBuilderMatNode, CATEGORY_MAT.ADVANCED);
    poly.register_node(ShadowMatNode, CATEGORY_MAT.ADVANCED);
    poly.register_node(SkyMatNode, CATEGORY_MAT.MESH);
    poly.register_node(VolumeMatNode, CATEGORY_MAT.VOLUME);
    poly.register_node(VolumeBuilderMatNode, CATEGORY_MAT.VOLUME);
  }
}
