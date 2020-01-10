import CoreUIData from 'src/core/UIData';
import {Vector2} from 'three/src/math/Vector2';
import {Color} from 'three/src/math/Color';
import {BaseNode} from '../_Base';

export class UIData extends CoreUIData {
	private _position: Vector2;
	private _width: number = 50;
	private _border_radius: number = 3;
	private _color: Color = new Color(0.75, 0.75, 0.75);
	private _icon: string | null = null;
	private _layout_vertical: boolean = true;
	private _comment: string;

	constructor(private node: BaseNode, x: number = 0, y: number = 0) {
		super();
		this._position = new Vector2(x || 0, y || 0);
	}

	set_border_radius(radius: number) {
		this._border_radius = radius;
	}
	border_radius() {
		return this._border_radius;
	}
	set_width(width: number) {
		this._width = width;
	}
	width() {
		return this._width;
	}
	set_comment(comment: string) {
		this._comment = comment;
		this.node.emit('ui_data_updated', this.to_json());
	}
	comment(): string {
		return this._comment;
	}
	set_color(color: Color) {
		this._color = color;
	}
	color() {
		return this._color;
	}
	set_icon(icon: string) {
		this._icon = icon;
	}
	icon() {
		return this._icon;
	}
	set_layout_horizontal() {
		this._layout_vertical = false;
	}
	is_layout_vertical() {
		return this._layout_vertical;
	}

	copy(ui_data: UIData) {
		this._position.copy(ui_data.position());
		this._color.copy(ui_data.color());
	}

	position() {
		return this._position;
	}

	set_position(new_position: Vector2) {
		this._position.copy(new_position);
		this.node.emit('ui_data_updated', this.to_json());
	}

	translate(offset: Vector2, snap: boolean = false) {
		this._position.add(offset);

		if (snap) {
			this._position.x = Math.round(this._position.x);
			this._position.y = Math.round(this._position.y);
		}

		this.node.emit('ui_data_updated', this.to_json());
	}
	// arguments_to_vector(x: number,y: number){
	// 	if (arguments.length === 2) {
	// 		this._position.x = arguments[0];
	// 		this._position.y = arguments[1];
	// 	} else {
	// 		this._position.x = new_position.x;
	// 		this._position.y = new_position.y;
	// 	}
	// }
	to_json() {
		return {
			x: this._position.x,
			y: this._position.y,
			comment: this._comment,
		};
	}
}
