/**
 * Create points from a an array of json dictionaries
 *
 * @remarks
 * This node is similar to the [Data SOP], but will fetch the data from a url.
 *
 */
import {TypedSopNode} from './_Base';
import {JsonDataLoader} from '../../../core/loader/geometry/JsonData';
import {NodeParamsConfig, ParamConfig} from '../utils/params/ParamsConfig';
import {BaseParamType} from '../../params/_Base';
import {BaseNodeType} from '../_Base';
import {CsvLoader} from '../../../core/loader/geometry/Csv';
import {BufferGeometry} from 'three/src/core/BufferGeometry';
import {ObjectType} from '../../../core/geometry/Constant';

export enum DataType {
	JSON = 'json',
	CSV = 'csv',
}
export const DATA_TYPES: DataType[] = [DataType.JSON, DataType.CSV];

class DataUrlSopParamsConfig extends NodeParamsConfig {
	/** @param sets if the data is interpreted as json or csv */
	data_type = ParamConfig.INTEGER(DATA_TYPES.indexOf(DataType.JSON), {
		menu: {
			entries: DATA_TYPES.map((t, i) => {
				return {
					name: t,
					value: i,
				};
			}),
		},
	});
	/** @param the url to fetch the data from */
	url = ParamConfig.STRING('/examples/sop/data_url/basic.json');

	//
	// JSON params
	//
	/** @param if the data is inside the payload, defines the prefix to read it from here */
	json_data_keys_prefix = ParamConfig.STRING('', {
		visibleIf: {data_type: DATA_TYPES.indexOf(DataType.JSON)},
	});
	/** @param which entries are skipped */
	skip_entries = ParamConfig.STRING('', {
		visibleIf: {data_type: DATA_TYPES.indexOf(DataType.JSON)},
	});
	/** @param sets if some attributes should be converted */
	convert = ParamConfig.BOOLEAN(0, {
		visibleIf: {data_type: DATA_TYPES.indexOf(DataType.JSON)},
	});
	/** @param sets which attributes should be converted from string to numeric */
	convert_to_numeric = ParamConfig.STRING('', {
		visibleIf: {
			data_type: DATA_TYPES.indexOf(DataType.JSON),
			convert: 1,
		},
	});

	//
	// CSV params
	//
	/** @param when fetching from a csv, the attribute names will not be present. Those can then be mentioned here */
	read_attrib_names_from_file = ParamConfig.BOOLEAN(1, {
		visibleIf: {data_type: DATA_TYPES.indexOf(DataType.CSV)},
	});
	/** @param list of attributes names when fetching from a csv */
	attrib_names = ParamConfig.STRING('height scale', {
		visibleIf: {
			data_type: DATA_TYPES.indexOf(DataType.CSV),
			read_attrib_names_from_file: 0,
		},
	});

	//
	// reload
	//
	/** @param reload the url */
	reload = ParamConfig.BUTTON(null, {
		callback: (node: BaseNodeType, param: BaseParamType) => {
			DataUrlSopNode.PARAM_CALLBACK_reload(node as DataUrlSopNode, param);
		},
	});
}
const ParamsConfig = new DataUrlSopParamsConfig();

export class DataUrlSopNode extends TypedSopNode<DataUrlSopParamsConfig> {
	params_config = ParamsConfig;
	static type() {
		return 'dataUrl';
	}

	async cook() {
		switch (DATA_TYPES[this.pv.data_type]) {
			case DataType.JSON:
				return this._load_json();
			case DataType.CSV:
				return this._load_csv();
		}
	}
	private _url() {
		const assets_root = this.scene.assets_controller.assets_root();
		if (assets_root) {
			return `${assets_root}${this.pv.url}`;
		} else {
			return this.pv.url;
		}
	}
	//
	//
	// JSON
	//
	//
	private _load_json() {
		const loader = new JsonDataLoader({
			data_keys_prefix: this.pv.json_data_keys_prefix,
			skip_entries: this.pv.skip_entries,
			do_convert: this.pv.convert,
			convert_to_numeric: this.pv.convert_to_numeric,
		});

		loader.load(this._url(), this._on_load.bind(this), undefined, this._on_error.bind(this));
	}

	_on_load(geometry: BufferGeometry) {
		this.set_geometry(geometry, ObjectType.POINTS);
	}
	_on_error(error: ErrorEvent) {
		this.states.error.set(`could not load geometry from ${this._url()} (${error})`);
		this.cook_controller.end_cook();
	}

	//
	//
	// CSV
	//
	//
	async _load_csv() {
		const attrib_names = this.pv.read_attrib_names_from_file ? undefined : this.pv.attrib_names.split(' ');
		const loader = new CsvLoader(attrib_names);
		const geometry = await loader.load(this._url());
		if (geometry) {
			this.set_geometry(geometry, ObjectType.POINTS);
		} else {
			this.states.error.set('could not generate points');
		}
	}

	// async _on_open_url(){
	// 	const url = await this.param('url').eval_p()
	// 	const a = document.createElement('a')
	// 	a.href = url
	// 	a.setAttribute('target', '_blank')
	// 	a.click()
	// }

	static PARAM_CALLBACK_reload(node: DataUrlSopNode, param: BaseParamType) {
		node.param_callback_reload();
	}
	param_callback_reload() {
		// this._previous_param_url = null

		// set the param dirty is preferable, in case this is used to refresh a local asset
		this.p.url.set_dirty();
		// this.set_dirty()
	}
}
