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
import type { Globals } from '#context';
import type EnvironmentOptions from '#options';
import { __UNIMPLEMENTED__ } from '#util';

export default function createExtension(context: Globals, options: EnvironmentOptions) {
	return class extends context.Window {
		sleep(ms: number): Promise<void> {
			return sleep(context, ms);
		}

		nextFrame(): Promise<void> {
			return nextFrame(context);
		}

		get activeWindow(): Window {
			return context.window;
		}

		get activeDocument(): Document {
			return context.document;
		}
	};
}

export function sleep(context: Globals, ms: number): Promise<void> {
	// Do not actually wait for that amount of time.
	return new context.Promise((resolve) => {
		context.setTimeout(resolve, 0);
	});
}

export function nextFrame(context: Globals): Promise<void> {
	return new context.Promise((resolve) => {
		context.requestAnimationFrame(() => resolve());
	});
}
