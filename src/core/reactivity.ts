//
// https://antfu.me/posts/watch-with-reactivity
//

import {computed, ref, effect, isRef, isReactive, EffectScheduler, stop} from '@vue/reactivity';
import {CoreType} from './Type';

function traverse(value: any, seen = new Set()) {
	console.log(value);
	if (!CoreType.isObject(value) || seen.has(value)) {
		return value;
	}

	seen.add(value); // prevent circular reference
	if (CoreType.isArray(value)) {
		for (let i = 0; i < value.length; i++) traverse(value[i], seen);
	} else {
		for (const key of Object.keys(value)) traverse((value as any)[key], seen);
	}
	return value;
}

interface WatchOptions {
	deep: boolean;
	lazy?: boolean;
}
function watch(source: any, fn: EffectScheduler, options?: WatchOptions) {
	options = options || {deep: false, lazy: false};
	const {deep, lazy} = options;
	let getter = isRef(source) ? () => source.value : isReactive(source) ? () => source : source;
	console.log(source, isRef(source), getter, fn);
	if (deep) {
		getter = () => traverse(getter());
	}

	const runner = effect(getter, {
		lazy,
		scheduler: fn,
	});

	return () => stop(runner);
}

export {computed, ref, watch};
