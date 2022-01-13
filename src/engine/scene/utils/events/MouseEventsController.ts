import {BaseSceneEventsController} from './_BaseEventsController';
import {MouseEventNode} from '../../../nodes/event/Mouse';

// https://developer.mozilla.org/en-US/docs/Web/Events
enum MouseEventType {
	auxclick = 'auxclick',
	click = 'click',
	contextmenu = 'contextmenu',
	dblclick = 'dblclick',
	mousedown = 'mousedown',
	mouseenter = 'mouseenter',
	mouseleave = 'mouseleave',
	mousemove = 'mousemove',
	mouseover = 'mouseover',
	mouseout = 'mouseout',
	mouseup = 'mouseup',
	pointerlockchange = 'pointerlockchange',
	pointerlockerror = 'pointerlockerror',
	select = 'select',
	wheel = 'wheel',
}
export const ACCEPTED_MOUSE_EVENT_TYPES: MouseEventType[] = [
	MouseEventType.auxclick,
	MouseEventType.click,
	MouseEventType.contextmenu,
	MouseEventType.dblclick,
	MouseEventType.mousedown,
	MouseEventType.mouseenter,
	MouseEventType.mouseleave,
	MouseEventType.mousemove,
	MouseEventType.mouseover,
	MouseEventType.mouseout,
	MouseEventType.mouseup,
	MouseEventType.pointerlockchange,
	MouseEventType.pointerlockerror,
	MouseEventType.select,
	MouseEventType.wheel,
];

export class MouseEventsController extends BaseSceneEventsController<MouseEvent, MouseEventNode> {
	protected _requireCanvasEventListeners: boolean = true;
	type() {
		return 'mouse';
	}
	acceptedEventTypes() {
		return new Set(ACCEPTED_MOUSE_EVENT_TYPES.map((n) => `${n}`));
	}
	// accepts_event(event: MouseEvent) {
	// 	return ACCEPTED_MOUSE_EVENT_TYPES.includes(event.type as MouseEventType);
	// }
}
