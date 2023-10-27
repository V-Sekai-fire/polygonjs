import {AnimationNamesExpression} from '../../../expressions/methods/animationNames';
import {ArgExpression} from '../../../expressions/methods/arg';
import {ArgcExpression} from '../../../expressions/methods/argc';
import {BboxExpression} from '../../../expressions/methods/bbox';
import {BlobExpression} from '../../../expressions/methods/blob';
import {CameraNameExpression} from '../../../expressions/methods/cameraName';
import {CameraNamesExpression} from '../../../expressions/methods/cameraNames';
import {CamerasCountExpression} from '../../../expressions/methods/camerasCount';
import {CentroidExpression} from '../../../expressions/methods/centroid';
import {ChExpression} from '../../../expressions/methods/ch';
import {ChsopExpression} from '../../../expressions/methods/chsop';
import {CopyExpression} from '../../../expressions/methods/copy';
import {CopResExpression} from '../../../expressions/methods/copRes';
import {isDeviceMobileExpression} from '../../../expressions/methods/isDeviceMobile';
import {isDeviceTouchExpression} from '../../../expressions/methods/isDeviceTouch';
import {LenExpression} from '../../../expressions/methods/len';
import {JoinExpression} from '../../../expressions/methods/join';
import {JsExpression} from '../../../expressions/methods/js';
import {ObjectExpression} from '../../../expressions/methods/object';
import {ObjectsCountExpression} from '../../../expressions/methods/objectsCount';
import {ObjectNameExpression} from '../../../expressions/methods/objectName';
import {ObjectNamesExpression} from '../../../expressions/methods/objectNames';
import {OpdigitsExpression} from '../../../expressions/methods/opdigits';
import {OpnameExpression} from '../../../expressions/methods/opname';
import {PadzeroExpression} from '../../../expressions/methods/padzero';
import {PlayerModeExpression} from '../../../expressions/methods/playerMode';
import {PointExpression} from '../../../expressions/methods/point';
import {PointsCountExpression} from '../../../expressions/methods/pointsCount';
import {SmoothstepExpression} from '../../../expressions/methods/smoothstep';
import {SmootherstepExpression} from '../../../expressions/methods/smootherstep';
import {SolverIterationExpression} from '../../../expressions/methods/solverIteration';
import {StrCharsCountExpression} from '../../../expressions/methods/strCharsCount';
import {StrConcatExpression} from '../../../expressions/methods/strConcat';
import {StrIndexExpression} from '../../../expressions/methods/strIndex';
import {StrSubExpression} from '../../../expressions/methods/strSub';
import {ViewerSizeExpression} from '../../../expressions/methods/viewerSize';
import {WindowSizeExpression} from '../../../expressions/methods/windowSize';

import {BaseMethod} from '../../../expressions/methods/_Base';
export interface ExpressionMap extends PolyDictionary<typeof BaseMethod> {
	animationNames: typeof AnimationNamesExpression;
	arg: typeof ArgExpression;
	argc: typeof ArgcExpression;
	bbox: typeof BboxExpression;
	blob: typeof BlobExpression;
	cameraName: typeof CameraNameExpression;
	cameraNames: typeof CameraNamesExpression;
	camerasCount: typeof CamerasCountExpression;
	centroid: typeof CentroidExpression;
	ch: typeof ChExpression;
	chsop: typeof ChsopExpression;
	copy: typeof CopyExpression;
	copRes: typeof CopResExpression;
	isDeviceMobile: typeof isDeviceMobileExpression;
	isDeviceTouch: typeof isDeviceTouchExpression;
	join: typeof JoinExpression;
	js: typeof JsExpression;
	len: typeof LenExpression;
	object: typeof ObjectExpression;
	objectsCount: typeof ObjectsCountExpression;
	objectName: typeof ObjectNameExpression;
	objectNames: typeof ObjectNamesExpression;
	opdigits: typeof OpdigitsExpression;
	opname: typeof OpnameExpression;
	padzero: typeof PadzeroExpression;
	playerMode: typeof PlayerModeExpression;
	point: typeof PointExpression;
	pointsCount: typeof PointsCountExpression;
	smoothstep: typeof SmoothstepExpression;
	smootherstep: typeof SmootherstepExpression;
	solverIteration: typeof SolverIterationExpression;
	strCharsCount: typeof StrCharsCountExpression;
	strConcat: typeof StrConcatExpression;
	strIndex: typeof StrIndexExpression;
	strSub: typeof StrSubExpression;
	viewerSize: typeof ViewerSizeExpression;
	windowSize: typeof WindowSizeExpression;
}

import {PolyEngine} from '../../../Poly';
import {PolyDictionary} from '../../../../types/GlobalTypes';
import {ExpressionType} from '../../../expressions/methods/Common';
export class AllExpressionsRegister {
	static run(poly: PolyEngine) {
		poly.expressionsRegister.register(AnimationNamesExpression, ExpressionType.animationNames);
		poly.expressionsRegister.register(ArgExpression, ExpressionType.arg);
		poly.expressionsRegister.register(ArgcExpression, ExpressionType.argc);
		poly.expressionsRegister.register(BboxExpression, ExpressionType.bbox);
		poly.expressionsRegister.register(BlobExpression, ExpressionType.blob);
		poly.expressionsRegister.register(CameraNameExpression, ExpressionType.cameraName);
		poly.expressionsRegister.register(CameraNamesExpression, ExpressionType.cameraNames);
		poly.expressionsRegister.register(CamerasCountExpression, ExpressionType.camerasCount);
		poly.expressionsRegister.register(CentroidExpression, ExpressionType.centroid);
		poly.expressionsRegister.register(ChExpression, ExpressionType.ch);
		poly.expressionsRegister.register(ChsopExpression, ExpressionType.chsop);
		poly.expressionsRegister.register(CopyExpression, ExpressionType.copy);
		poly.expressionsRegister.register(CopResExpression, ExpressionType.copRes);
		poly.expressionsRegister.register(isDeviceMobileExpression, ExpressionType.isDeviceMobile);
		poly.expressionsRegister.register(isDeviceTouchExpression, ExpressionType.isDeviceTouch);
		poly.expressionsRegister.register(LenExpression, ExpressionType.len);
		poly.expressionsRegister.register(JoinExpression, ExpressionType.join);
		poly.expressionsRegister.register(JsExpression, ExpressionType.js);
		poly.expressionsRegister.register(ObjectExpression, ExpressionType.object);
		poly.expressionsRegister.register(ObjectsCountExpression, ExpressionType.objectsCount);
		poly.expressionsRegister.register(ObjectNameExpression, ExpressionType.objectName);
		poly.expressionsRegister.register(ObjectNamesExpression, ExpressionType.objectNames);
		poly.expressionsRegister.register(OpdigitsExpression, ExpressionType.opdigits);
		poly.expressionsRegister.register(OpnameExpression, ExpressionType.opname);
		poly.expressionsRegister.register(PadzeroExpression, ExpressionType.padzero);
		poly.expressionsRegister.register(PlayerModeExpression, ExpressionType.playerMode);
		poly.expressionsRegister.register(PointExpression, ExpressionType.point);
		poly.expressionsRegister.register(PointsCountExpression, ExpressionType.pointsCount);
		poly.expressionsRegister.register(SmoothstepExpression, ExpressionType.smoothstep);
		poly.expressionsRegister.register(SmootherstepExpression, ExpressionType.smootherstep);
		poly.expressionsRegister.register(SolverIterationExpression, ExpressionType.solverIteration);
		poly.expressionsRegister.register(StrCharsCountExpression, ExpressionType.strCharsCount);
		poly.expressionsRegister.register(StrConcatExpression, ExpressionType.strConcat);
		poly.expressionsRegister.register(StrIndexExpression, ExpressionType.strIndex);
		poly.expressionsRegister.register(StrSubExpression, ExpressionType.strSub);
		poly.expressionsRegister.register(ViewerSizeExpression, ExpressionType.viewerSize);
		poly.expressionsRegister.register(WindowSizeExpression, ExpressionType.windowSize);
	}
}
