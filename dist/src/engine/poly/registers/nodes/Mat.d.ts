import { LineBasicMatNode } from '../../../nodes/mat/LineBasic';
import { MeshBasicMatNode } from '../../../nodes/mat/MeshBasic';
import { MeshBasicBuilderMatNode } from '../../../nodes/mat/MeshBasicBuilder';
import { MeshLambertMatNode } from '../../../nodes/mat/MeshLambert';
import { MeshLambertBuilderMatNode } from '../../../nodes/mat/MeshLambertBuilder';
import { MeshPhongMatNode } from '../../../nodes/mat/MeshPhong';
import { MeshStandardMatNode } from '../../../nodes/mat/MeshStandard';
import { MeshStandardBuilderMatNode } from '../../../nodes/mat/MeshStandardBuilder';
import { MeshSubsurfaceScatteringMatNode } from '../../../nodes/mat/MeshSubsurfaceScattering';
import { PointsMatNode } from '../../../nodes/mat/Points';
import { PointsBuilderMatNode } from '../../../nodes/mat/PointsBuilder';
import { ShadowMatNode } from '../../../nodes/mat/Shadow';
import { SkyMatNode } from '../../../nodes/mat/Sky';
import { VolumeMatNode } from '../../../nodes/mat/Volume';
import { VolumeBuilderMatNode } from '../../../nodes/mat/VolumeBuilder';
export interface MatNodeChildrenMap {
    line_basic: LineBasicMatNode;
    mesh_basic: MeshBasicMatNode;
    mesh_basic_builder: MeshBasicBuilderMatNode;
    mesh_lambert: MeshLambertMatNode;
    mesh_lambert_builder: MeshLambertBuilderMatNode;
    mesh_phong: MeshPhongMatNode;
    mesh_standard: MeshStandardMatNode;
    mesh_standard_builder: MeshStandardBuilderMatNode;
    mesh_subsurface_scattering: MeshSubsurfaceScatteringMatNode;
    points: PointsMatNode;
    points_builder: PointsBuilderMatNode;
    shadow: ShadowMatNode;
    sky: SkyMatNode;
    volume: VolumeMatNode;
    volume_builder: VolumeBuilderMatNode;
}
import { Poly } from '../../../Poly';
export declare class MatRegister {
    static run(poly: Poly): void;
}
