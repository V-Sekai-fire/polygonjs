import {RegisterableProperty} from '../AnimatedPropertiesRegister';
import {AnimPropertyTarget} from '../PropertyTarget';
import {TimelineBuilder} from '../TimelineBuilder';

export interface RegisterOptions {
	registerproperties?: boolean;
	propertyTarget?: AnimPropertyTarget;
}
export interface StartOptions extends RegisterOptions {
	timelineBuilder: TimelineBuilder;
	timeline: gsap.core.Timeline;
	vars: gsap.TweenVars;
	target: object;
	registerableProp: RegisterableProperty;
}

export interface AddToTimelineOptions extends RegisterOptions {
	timelineBuilder: TimelineBuilder;
	timeline: gsap.core.Timeline;
	target: AnimPropertyTarget;
}

export enum Operation {
	SET = 'set',
	ADD = 'add',
	SUBTRACT = 'subtract',
}
export const OPERATIONS: Operation[] = [Operation.SET, Operation.ADD, Operation.SUBTRACT];

export interface AnimationRepeatParams {
	count: number;
	delay: number;
	yoyo: boolean;
}
