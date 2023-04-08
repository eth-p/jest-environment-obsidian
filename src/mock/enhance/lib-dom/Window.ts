// From Obsidian Type Definitions:
// Version 1.1.1
//
//     interface Window extends EventTarget, AnimationFrameProvider, GlobalEventHandlers, WindowEventHandlers, WindowLocalStorage, WindowOrWorkerGlobalScope, WindowSessionStorage {
//         activeWindow: Window;
//         activeDocument: Document;
//         sleep(ms: number): Promise<void>;
//         nextFrame(): Promise<void>;
//     }
//
import type EnvironmentOptions from '#options';
import { __UNIMPLEMENTED__ } from '#util';

export default function createExtension(globalThis: typeof global, options: EnvironmentOptions) {
	return class extends globalThis.Window {
		sleep(ms: number): Promise<void> {
			return sleep(globalThis, ms);
		}

		nextFrame(): Promise<void> {
			return nextFrame(globalThis);
		}

		get activeWindow(): Window {
			return globalThis.window;
		}

		get activeDocument(): Document {
			return globalThis.document;
		}
	};
}

export function sleep(context: typeof global, ms: number): Promise<void> {
	// Do not actually wait for that amount of time.
	return new context.Promise((resolve) => {
		context.setTimeout(resolve, 0);
	});
}

export function nextFrame(context: typeof global): Promise<void> {
	return new context.Promise((resolve) => {
		context.requestAnimationFrame(() => resolve());
	});
}
