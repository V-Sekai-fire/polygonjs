import QUnit from 'qunit';

QUnit.module('core');
import './core/ArrayUtils';
import './core/Math';
import './core/ObjectUtils';
import './core/String';
import './core/ThreeToGl';
import './core/Walker';
QUnit.module('core/geometry');
import './core/geometry/Attribute';
import './core/geometry/Group';

QUnit.module('scene');
import './engine/scene/Serializer';
import './engine/scene/ObjectsController';
import './engine/scene/OptimizedNodes';
import './engine/scene/TimeController';

QUnit.module('expressions');
import './engine/expressions/methods/abs';
import './engine/expressions/methods/arg';
import './engine/expressions/methods/argc';
import './engine/expressions/methods/bbox';
import './engine/expressions/methods/ceil';
import './engine/expressions/methods/centroid';
import './engine/expressions/methods/ch';
import './engine/expressions/methods/copRes';
import './engine/expressions/methods/cos';
import './engine/expressions/methods/easing';
import './engine/expressions/methods/floor';
import './engine/expressions/methods/if';
import './engine/expressions/methods/js';
import './engine/expressions/methods/max';
import './engine/expressions/methods/min';
import './engine/expressions/methods/object';
import './engine/expressions/methods/opdigits';
import './engine/expressions/methods/opname';
import './engine/expressions/methods/point';
import './engine/expressions/methods/pointsCount';
import './engine/expressions/methods/precision';
import './engine/expressions/methods/rand';
import './engine/expressions/methods/round';
import './engine/expressions/methods/strCharsCount';
import './engine/expressions/methods/strIndex';
import './engine/expressions/methods/strSub';
import './engine/expressions/Evaluator';
import './engine/expressions/GlobalVariables';
import './engine/expressions/MissingReferences';

QUnit.module('params utils');
import './engine/params/utils/DefaultValues';
import './engine/params/utils/Dirty';
import './engine/params/utils/Expression';
import './engine/params/utils/ReferencedAssets';
import './engine/params/utils/TimeDependent';

QUnit.module('params');
import './engine/params/_Base';
import './engine/params/Boolean';
import './engine/params/Color';
import './engine/params/Float';
import './engine/params/Integer';
import './engine/params/Multiple';
import './engine/params/String';
import './engine/params/Vector3';
import './engine/params/utils/DefaultValues';
import './engine/params/utils/Dirty';
import './engine/params/utils/Expression';
import './engine/params/utils/ReferencedAssets';
import './engine/params/utils/TimeDependent';

QUnit.module('operations');
import './engine/operations/sop/AttribFromTexture';
import './engine/operations/sop/Null';

QUnit.module('nodes utils');
import './engine/nodes/utils/Bypass';
import './engine/nodes/utils/CookController';
import './engine/nodes/utils/ChildrenContext';
import './engine/nodes/utils/Memory';

QUnit.module('actor');
import './engine/nodes/actor/AnimationActionCrossFade';
import './engine/nodes/actor/AnimationActionFadeOut';
import './engine/nodes/actor/AnimationActionPlay';
import './engine/nodes/actor/AnimationActionStop';
import './engine/nodes/actor/AnimationMixer';
import './engine/nodes/actor/Code';
import './engine/nodes/actor/Compare';
import './engine/nodes/actor/GetChildrenAttributes';
import './engine/nodes/actor/GetMaterial';
import './engine/nodes/actor/GetObject';
import './engine/nodes/actor/GetObjectAttribute';
import './engine/nodes/actor/MultScalar';
import './engine/nodes/actor/OnEventChildAttributeUpdated';
import './engine/nodes/actor/OnEventManualTrigger';
import './engine/nodes/actor/OnEventObjectAttributeUpdated';
import './engine/nodes/actor/OnEventObjectClicked';
import './engine/nodes/actor/OnEventObjectHovered';
import './engine/nodes/actor/OnEventScenePlayState';
import './engine/nodes/actor/OnEventSceneReset';
import './engine/nodes/actor/OnEventTick';
import './engine/nodes/actor/Or';
import './engine/nodes/actor/PlayAnimation';
import './engine/nodes/actor/PlayInstrumentNote';
// import './engine/nodes/actor/SetObjectHoveredState';
import './engine/nodes/actor/SetMaterialColor';
import './engine/nodes/actor/SetObjectAttribute';
import './engine/nodes/actor/SetObjectLookAt';
import './engine/nodes/actor/SetObjectRotation';
import './engine/nodes/actor/SetObjectMaterial';
import './engine/nodes/actor/SetObjectPosition';
import './engine/nodes/actor/SetObjectScale';
import './engine/nodes/actor/SetViewer';
import './engine/nodes/actor/Switch';
import './engine/nodes/actor/TriggerFilter';
import './engine/nodes/actor/TwoWaySwitch';

QUnit.module('anim');
import './engine/nodes/anim/Utils/ParamProxy';
import './engine/nodes/anim/Delete';
import './engine/nodes/anim/Merge';
import './engine/nodes/anim/Null';
import './engine/nodes/anim/Subnet';

QUnit.module('anim');
import './engine/nodes/audio/File';

QUnit.module('cop');
import './engine/nodes/cop/AudioAnalyser';
import './engine/nodes/cop/Builder';
import './engine/nodes/cop/Canvas';
import './engine/nodes/cop/Color';
import './engine/nodes/cop/EnvMap';
import './engine/nodes/cop/Gif';
import './engine/nodes/cop/Image';
import './engine/nodes/cop/Palette';
import './engine/nodes/cop/Render';
import './engine/nodes/cop/Snapshot';
import './engine/nodes/cop/Switch';
import './engine/nodes/cop/Video';

QUnit.module('event');
import './engine/nodes/event/Code';
import './engine/nodes/event/Drag';
import './engine/nodes/event/Debounce';
import './engine/nodes/event/Keyboard';
import './engine/nodes/event/Mouse';
import './engine/nodes/event/NodeCook';
import './engine/nodes/event/Param';
import './engine/nodes/event/Pointer';
import './engine/nodes/event/Scene';
import './engine/nodes/event/SetFlag';
import './engine/nodes/event/SetParam';
import './engine/nodes/event/Throttle';
import './engine/nodes/event/Touch';
import './engine/nodes/event/Window';

QUnit.module('gl');
import './engine/nodes/gl/Assemblers/conflicts';
import './engine/nodes/gl/Add';
import './engine/nodes/gl/Attribute';
import './engine/nodes/gl/Constant';
import './engine/nodes/gl/Dot';
import './engine/nodes/gl/IfThen';
import './engine/nodes/gl/Mult';
import './engine/nodes/gl/MultAdd';
import './engine/nodes/gl/Noise';
import './engine/nodes/gl/Param';
import './engine/nodes/gl/Ramp';
import './engine/nodes/gl/Rotate';
import './engine/nodes/gl/SDFGradient';
import './engine/nodes/gl/Switch';
import './engine/nodes/gl/Texture';
import './engine/nodes/gl/TwoWaySwitch';
import './engine/nodes/gl/VaryingWrite';

QUnit.module('manager');
import './engine/nodes/manager/Root';
import './engine/nodes/manager/root/BackgroundController';
import './engine/nodes/manager/root/AudioController';

QUnit.module('mat');
import './engine/nodes/mat/LineBasicBuilder';
import './engine/nodes/mat/MeshBasicBuilder';
import './engine/nodes/mat/MeshLambertBuilder';
import './engine/nodes/mat/MeshStandardBuilder';
import './engine/nodes/mat/MeshPhysicalBuilder';
import './engine/nodes/mat/PointsBuilder';
import './engine/nodes/mat/SpareParams';
import './engine/nodes/mat/Sky';
import './engine/nodes/mat/Uniforms';
import './engine/nodes/mat/VolumeBuilder';

QUnit.module('obj');
import './engine/nodes/obj/utils/DisplayNodeController';
import './engine/nodes/obj/_BaseTransformed';
import './engine/nodes/obj/AmbientLight';
import './engine/nodes/obj/Blend';
import './engine/nodes/obj/ContactShadow';
import './engine/nodes/obj/Geo';
import './engine/nodes/obj/HemisphereLight';
import './engine/nodes/obj/PolarTransform';
import './engine/nodes/obj/Poly';
import './engine/nodes/obj/PositionalAudio';
import './engine/nodes/obj/SpotLight';

QUnit.module('post');
import './engine/nodes/post/Base';
import './engine/nodes/post/DepthOfField';

QUnit.module('sop');
import './engine/nodes/sop/Add';
import './engine/nodes/sop/AnimationCopy';
import './engine/nodes/sop/AttribAddMult';
import './engine/nodes/sop/AttribCast';
import './engine/nodes/sop/AttribCopy';
import './engine/nodes/sop/AttribCreate';
import './engine/nodes/sop/AttribDelete';
import './engine/nodes/sop/AttribFromTexture';
import './engine/nodes/sop/AttribId';
import './engine/nodes/sop/AttribNormalize';
import './engine/nodes/sop/AttribPromote';
import './engine/nodes/sop/AttribRemap';
import './engine/nodes/sop/AttribRename';
import './engine/nodes/sop/AttribSetAtIndex';
import './engine/nodes/sop/AttribTransfer';
import './engine/nodes/sop/BboxScatter';
import './engine/nodes/sop/Blend';
import './engine/nodes/sop/Boolean';
import './engine/nodes/sop/Box';
import './engine/nodes/sop/BoxLines';
import './engine/nodes/sop/BVH';
import './engine/nodes/sop/BVHVisualizer';
import './engine/nodes/sop/Cache';
import './engine/nodes/sop/CameraPlane';
import './engine/nodes/sop/CameraProject';
import './engine/nodes/sop/Center';
import './engine/nodes/sop/Circle';
import './engine/nodes/sop/Circle3Points';
import './engine/nodes/sop/Clip';
import './engine/nodes/sop/Code';
import './engine/nodes/sop/Color';
import './engine/nodes/sop/Cone';
import './engine/nodes/sop/Copy';
import './engine/nodes/sop/CSS2DObject';
import './engine/nodes/sop/Data';
import './engine/nodes/sop/DataUrl';
import './engine/nodes/sop/Decal';
import './engine/nodes/sop/Delay';
import './engine/nodes/sop/Delete';
import './engine/nodes/sop/DrawRange';
import './engine/nodes/sop/Face';
import './engine/nodes/sop/File';
import './engine/nodes/sop/FileGLTF';
import './engine/nodes/sop/FileMulti';
import './engine/nodes/sop/Fuse';
import './engine/nodes/sop/HeightMap';
import './engine/nodes/sop/Hexagons';
import './engine/nodes/sop/Hierarchy';
import './engine/nodes/sop/Icosahedron';
import './engine/nodes/sop/Instance';
import './engine/nodes/sop/InstancesCount';
import './engine/nodes/sop/InstanceUpdate';
import './engine/nodes/sop/Jitter';
import './engine/nodes/sop/Layer';
import './engine/nodes/sop/Line';
import './engine/nodes/sop/Lod';
import './engine/nodes/sop/Material';
import './engine/nodes/sop/MaterialProperties';
import './engine/nodes/sop/Merge';
import './engine/nodes/sop/Metaball';
import './engine/nodes/sop/Noise';
import './engine/nodes/sop/Normals';
import './engine/nodes/sop/NormalsHelper';
import './engine/nodes/sop/Null';
import './engine/nodes/sop/ObjectMerge';
import './engine/nodes/sop/ObjectProperties';
import './engine/nodes/sop/OceanPlane';
import './engine/nodes/sop/Palette';
import './engine/nodes/sop/ParticlesSystemGpu';
import './engine/nodes/sop/particlesSystemGPU/ParticlesAssembler';
import './engine/nodes/sop/particlesSystemGPU/ParticlesPersistedConfig';
import './engine/nodes/sop/Peak';
import './engine/nodes/sop/Plane';
import './engine/nodes/sop/Point';
import './engine/nodes/sop/PointLight';
import './engine/nodes/sop/PolarTransform';
import './engine/nodes/sop/Poly';
import './engine/nodes/sop/Polywire';
import './engine/nodes/sop/Ray';
import './engine/nodes/sop/Reflector';
import './engine/nodes/sop/Resample';
import './engine/nodes/sop/RoundedBox';
import './engine/nodes/sop/Scatter';
import './engine/nodes/sop/Shear';
import './engine/nodes/sop/Skin';
import './engine/nodes/sop/Solver';
import './engine/nodes/sop/Sort';
import './engine/nodes/sop/Sphere';
import './engine/nodes/sop/Subdivide';
import './engine/nodes/sop/Subnet';
import './engine/nodes/sop/Svg';
import './engine/nodes/sop/Switch';
import './engine/nodes/sop/Text';
import './engine/nodes/sop/TextureCopy';
import './engine/nodes/sop/TextureProperties';
import './engine/nodes/sop/Torus';
import './engine/nodes/sop/TorusKnot';
import './engine/nodes/sop/Transform';
import './engine/nodes/sop/TransformCopy';
import './engine/nodes/sop/TransformReset';
import './engine/nodes/sop/Tube';
import './engine/nodes/sop/UvProject';
import './engine/nodes/sop/UvTransform';
import './engine/nodes/sop/UvUnwrap';

QUnit.module('viewer');
import './engine/viewers/_Base';
import './engine/viewers/Callbacks';
import './engine/viewers/Controls';
import './engine/viewers/Events';
import './engine/viewers/Shadows';
