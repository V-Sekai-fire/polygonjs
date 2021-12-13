import {Vector3} from 'three/src/math/Vector3';
import {Quaternion} from 'three/src/math/Quaternion';
import {Clock} from 'three/src/core/Clock';
import {Object3D} from 'three/src/core/Object3D';
import {Listener} from 'tone/build/esm/core/context/Listener';
import {AnyAudioContext} from 'tone/build/esm/core/context/AudioContext';
import {Gain} from 'tone/build/esm/core/context/Gain';
import {CorePositionalAudio} from './PositionalAudio';
import {AudioController} from './AudioController';

const _position = new Vector3();
const _quaternion = new Quaternion();
const _scale = new Vector3();
const _orientation = new Vector3();

export class CoreAudioListener extends Object3D {
	private context: AnyAudioContext;
	// private type = 'AudioListener';
	private timeDelta = 0;
	private _clock = new Clock();
	// private volume: Volume;
	private gain: Gain;
	constructor() {
		super();

		const listener = new Listener();
		this.context = listener.context.rawContext;
		this.gain = new Gain();
		// this.gain.connect(listener);

		// this.gain = this.context.createGain();
		this.gain.connect(this.context.destination);
	}

	async addInput(positionalAudioNode: CorePositionalAudio) {
		await AudioController.start();
		positionalAudioNode.connect(this.gain);
	}
	dispose() {
		this.gain.disconnect();
	}

	// removeFilter() {
	// 	if (this.filter !== null) {
	// 		this.gain.disconnect(this.filter);
	// 		this.filter.disconnect(this.context.destination);
	// 		this.gain.connect(this.context.destination);
	// 		this.filter = null;
	// 	}

	// 	return this;
	// }

	// getFilter() {
	// 	return this.filter;
	// }

	// setFilter(value) {
	// 	if (this.filter !== null) {
	// 		this.gain.disconnect(this.filter);
	// 		this.filter.disconnect(this.context.destination);
	// 	} else {
	// 		this.gain.disconnect(this.context.destination);
	// 	}

	// 	this.filter = value;
	// 	this.gain.connect(this.filter);
	// 	this.filter.connect(this.context.destination);

	// 	return this;
	// }

	// getMasterVolume() {
	// 	return this.gain.gain.value;
	// }

	setMasterVolume(value: number) {
		this.gain.gain.setTargetAtTime(value, this.context.currentTime, 0.01);
		// this.volume.volume.setTargetAtTime(value, this.context.currentTime, 0.01);

		return this;
	}

	updateMatrixWorld(force: boolean) {
		super.updateMatrixWorld(force);

		const listener = this.context.listener;
		const up = this.up;

		this.timeDelta = this._clock.getDelta();

		this.matrixWorld.decompose(_position, _quaternion, _scale);

		_orientation.set(0, 0, -1).applyQuaternion(_quaternion);

		if (listener.positionX) {
			// code path for Chrome (see #14393)

			const endTime = this.context.currentTime + this.timeDelta;

			listener.positionX.linearRampToValueAtTime(_position.x, endTime);
			listener.positionY.linearRampToValueAtTime(_position.y, endTime);
			listener.positionZ.linearRampToValueAtTime(_position.z, endTime);
			listener.forwardX.linearRampToValueAtTime(_orientation.x, endTime);
			listener.forwardY.linearRampToValueAtTime(_orientation.y, endTime);
			listener.forwardZ.linearRampToValueAtTime(_orientation.z, endTime);
			listener.upX.linearRampToValueAtTime(up.x, endTime);
			listener.upY.linearRampToValueAtTime(up.y, endTime);
			listener.upZ.linearRampToValueAtTime(up.z, endTime);
		} else {
			listener.setPosition(_position.x, _position.y, _position.z);
			listener.setOrientation(_orientation.x, _orientation.y, _orientation.z, up.x, up.y, up.z);
		}
	}
}
