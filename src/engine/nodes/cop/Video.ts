/**
 * Imports a video
 *
 * @remarks
 * TIP: to ensure that your video starts as soon as possible, make sure to pre-process it with a tool like qt-faststart. There are many places where you can find it, but here are some suggestions:
 *
 * - download it from [https://pypi.org/project/qtfaststart/](https://pypi.org/project/qtfaststart/)
 * - download it from [https://manpages.debian.org/stretch/ffmpeg/qt-faststart.1.en.html](https://manpages.debian.org/stretch/ffmpeg/qt-faststart.1.en.html)
 * - with ffmpeg, you can use the following command line: `ffmpeg -i in.mp4 -c copy -map 0 -movflags +faststart out.mp4
`

In a future version of this node, it will also be possible to link it to a video tag that could already be in your html DOM. This way, you could sets multiple source tags (one with mp4 and one with ogv) instead of a single url.

 */
import {Constructor} from '../../../types/GlobalTypes';
import {VideoTexture} from 'three/src/textures/VideoTexture';
import {Texture} from 'three/src/textures/Texture';
import {TypedCopNode} from './_Base';
import {CoreLoaderTexture} from '../../../core/loader/Texture';

import {BaseNodeType} from '../_Base';
import {BaseParamType} from '../../params/_Base';
import {NodeParamsConfig, ParamConfig} from '../utils/params/ParamsConfig';
import {FileType} from '../../params/utils/OptionsController';
import {isUrlVideo} from '../../../core/FileTypeController';
import {TextureParamsController, TextureParamConfig} from './utils/TextureParamsController';
import {isBooleanTrue} from '../../../core/BooleanValue';
import {CoreBaseLoader} from '../../../core/loader/_Base';
import {InputCloneMode} from '../../poly/InputCloneMode';
import {CopType} from '../../poly/registers/nodes/types/Cop';
import {FileTypeCheckCopParamConfig} from './utils/CheckFileType';

function VideoCopParamConfig<TBase extends Constructor>(Base: TBase) {
	return class Mixin extends Base {
		/** @param url to fetch the video from */
		url = ParamConfig.STRING('', {
			fileBrowse: {type: [FileType.TEXTURE_VIDEO]},
		});
		/** @param reload the video */
		reload = ParamConfig.BUTTON(null, {
			callback: (node: BaseNodeType, param: BaseParamType) => {
				VideoCopNode.PARAM_CALLBACK_reload(node as VideoCopNode, param);
			},
		});
		/** @param play the video */
		play = ParamConfig.BOOLEAN(1, {
			cook: false,
			callback: (node: BaseNodeType) => {
				VideoCopNode.PARAM_CALLBACK_video_update_play(node as VideoCopNode);
			},
		});
		/** @param set the video muted attribute */
		muted = ParamConfig.BOOLEAN(1, {
			cook: false,
			callback: (node: BaseNodeType) => {
				VideoCopNode.PARAM_CALLBACK_video_update_muted(node as VideoCopNode);
			},
		});
		/** @param set the video loop attribute */
		loop = ParamConfig.BOOLEAN(1, {
			cook: false,
			callback: (node: BaseNodeType) => {
				VideoCopNode.PARAM_CALLBACK_video_update_loop(node as VideoCopNode);
			},
		});
		/** @param set the video time */
		videoTime = ParamConfig.FLOAT(0, {
			cook: false,
			// do not use videoTime, as calling "this._video.currentTime =" every frame is really expensive
		});
		/** @param seek the video at the time specified in videoTime */
		setVideoTime = ParamConfig.BUTTON(null, {
			cook: false,
			callback: (node: BaseNodeType) => {
				VideoCopNode.PARAM_CALLBACK_video_update_time(node as VideoCopNode);
			},
		});
	};
}

class VideoCopParamsConfig extends FileTypeCheckCopParamConfig(
	TextureParamConfig(VideoCopParamConfig(NodeParamsConfig))
) {}

const ParamsConfig = new VideoCopParamsConfig();

export class VideoCopNode extends TypedCopNode<VideoCopParamsConfig> {
	override paramsConfig = ParamsConfig;
	static override type() {
		return CopType.VIDEO;
	}
	override async requiredModules() {
		if (this.p.url.isDirty()) {
			await this.p.url.compute();
		}
		const ext = CoreBaseLoader.extension(this.pv.url || '');
		return CoreLoaderTexture.module_names(ext);
	}

	private _video: HTMLVideoElement | undefined;
	HTMLVideoElement() {
		return this._video;
	}
	// private _data_texture_controller: DataTextureController | undefined;
	private _texture_loader: CoreLoaderTexture | undefined;
	public readonly textureParamsController: TextureParamsController = new TextureParamsController(this);
	static override displayedInputNames(): string[] {
		return ['optional texture to copy attributes from'];
	}
	override initializeNode() {
		this.io.inputs.setCount(0, 1);
		this.io.inputs.initInputsClonedState(InputCloneMode.NEVER);
	}
	override async cook(input_contents: Texture[]) {
		if (isBooleanTrue(this.pv.checkFileType) && !isUrlVideo(this.pv.url)) {
			this.states.error.set('url is not a video');
		} else {
			const texture = await this._load_texture(this.pv.url);

			if (texture) {
				this._video = texture.image;
				if (this._video) {
					document.body.appendChild(this._video);
				}
				const inputTexture = input_contents[0];
				if (inputTexture) {
					TextureParamsController.copyTextureAttributes(texture, inputTexture);
				}

				this.video_update_loop();
				this.video_update_muted();
				this.video_update_play();
				this.video_update_time();
				await this.textureParamsController.update(texture);
				this.setTexture(texture);
			} else {
				this.cookController.endCook();
			}
		}
	}
	override dispose() {
		super.dispose();
		if (this._video) {
			this._video.parentElement?.removeChild(this._video);
		}
	}

	static PARAM_CALLBACK_video_update_time(node: VideoCopNode) {
		node.video_update_time();
	}
	static PARAM_CALLBACK_video_update_play(node: VideoCopNode) {
		node.video_update_play();
	}
	static PARAM_CALLBACK_video_update_muted(node: VideoCopNode) {
		node.video_update_muted();
	}
	static PARAM_CALLBACK_video_update_loop(node: VideoCopNode) {
		node.video_update_loop();
	}
	private async video_update_time() {
		if (this._video) {
			const param = this.p.videoTime;
			if (param.isDirty()) {
				await param.compute();
			}
			this._video.currentTime = param.value;
		}
	}
	private video_update_muted() {
		if (this._video) {
			this._video.muted = isBooleanTrue(this.pv.muted);
		}
	}
	private video_update_loop() {
		if (this._video) {
			this._video.loop = isBooleanTrue(this.pv.loop);
		}
	}

	private video_update_play() {
		if (this._video) {
			if (isBooleanTrue(this.pv.play)) {
				this._video.play();
			} else {
				this._video.pause();
			}
		}
	}
	//
	//
	// UTILS
	//
	//
	static PARAM_CALLBACK_reload(node: VideoCopNode, param: BaseParamType) {
		node.paramCallbackReload();
	}
	private paramCallbackReload() {
		// set the param dirty is preferable to just the successors, in case the expression result needs to be updated
		// this.p.url.set_successors_dirty();
		this.p.url.setDirty();
	}

	private async _load_texture(url: string) {
		let texture: Texture | VideoTexture | null = null;
		const url_param = this.p.url;
		this._texture_loader =
			this._texture_loader ||
			new CoreLoaderTexture(url, url_param, this, this.scene(), {
				forceVideo: !isBooleanTrue(this.pv.checkFileType),
			});
		try {
			texture = await this._texture_loader.load_texture_from_url_or_op({
				tdataType: this.pv.ttype && this.pv.tadvanced,
				dataType: this.pv.type,
			});
			if (texture) {
				texture.matrixAutoUpdate = false;
			}
		} catch (e) {}
		if (!texture) {
			this.states.error.set(`could not load texture '${url}'`);
		}
		return texture;
	}
}
