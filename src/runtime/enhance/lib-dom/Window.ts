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

Window.prototype.sleep = function sleep(ms: number): Promise<void> {
	return _sleep(ms);
};

Window.prototype.nextFrame = function nextFrame(): Promise<void> {
	return _nextFrame();
};

Object.defineProperty(Window.prototype, 'activeWindow', {
	get(): Window {
		return window;
	},
});

Object.defineProperty(Window.prototype, 'activeDocument', {
	get(): Document {
		return document;
	},
});

export function _sleep(ms: number): Promise<void> {
	// Do not actually wait for that amount of time.
	return new Promise((resolve) => {
		setTimeout(resolve, 0);
	});
}

export function _nextFrame(): Promise<void> {
	return new Promise((resolve) => {
		requestAnimationFrame(() => resolve());
	});
}
