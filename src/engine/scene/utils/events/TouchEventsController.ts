import {BaseSceneEventsController} from './_BaseEventsController';
import {PointerEventNode} from '../../../nodes/event/Pointer';

// https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
enum TouchEventType {
	touchstart = 'touchstart',
	touchmove = 'touchmove',
	touchend = 'touchend',
}
export const ACCEPTED_TOUCH_EVENT_TYPES: TouchEventType[] = [
	TouchEventType.touchstart,
	TouchEventType.touchmove,
	TouchEventType.touchend,
];

export class TouchEventsController extends BaseSceneEventsController<MouseEvent, PointerEventNode> {
	protected override _requireCanvasEventListeners: boolean = true;
	type() {
		return 'touch';
	}
	acceptedEventTypes() {
		return new Set(ACCEPTED_TOUCH_EVENT_TYPES.map((n) => `${n}`));
	}
}
