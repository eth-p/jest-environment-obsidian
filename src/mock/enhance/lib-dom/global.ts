// From Obsidian Type Definitions:
// Version 1.1.1
//
//     function fish(selector: string): HTMLElement | null;
//     function fishAll(selector: string): HTMLElement[];
//
//     function createEl<K extends keyof HTMLElementTagNameMap>(tag: K, o?: DomElementInfo | string, callback?: (el: HTMLElementTagNameMap[K]) => void): HTMLElementTagNameMap[K];
//     function createDiv(o?: DomElementInfo | string, callback?: (el: HTMLDivElement) => void): HTMLDivElement;
//     function createSpan(o?: DomElementInfo | string, callback?: (el: HTMLSpanElement) => void): HTMLSpanElement;
//     function createSvg<K extends keyof SVGElementTagNameMap>(tag: K, o?: SvgElementInfo | string, callback?: (el: SVGElementTagNameMap[K]) => void): SVGElementTagNameMap[K];
//     function createFragment(callback?: (el: DocumentFragment) => void): DocumentFragment;
//
//     function ajax(options: AjaxOptions): void;
//     function ajaxPromise(options: AjaxOptions): Promise<any>;
//     function ready(fn: () => any): void;
//     function sleep(ms: number): Promise<void>;
//     function nextFrame(): Promise<void>;
//     let activeWindow: Window;
//     let activeDocument: Document;
//
import type EnvironmentOptions from '#options';
import { __UNIMPLEMENTED__ } from '#util';

import { nextFrame, sleep } from './Window';
import { createEl, createSvg } from './_createEl';

export default function createExtension(globalThis: typeof global, options: EnvironmentOptions) {
	const global = function () {} as unknown as { new (): any };
	global.prototype = globalThis;

	return class extends global {
		static fish(selector: string): HTMLElement | null {
			return globalThis.document.querySelector(selector);
		}

		static fishAll(selector: string): HTMLElement[] {
			return Array.from(globalThis.document.querySelectorAll(selector));
		}

		static createEl<K extends keyof HTMLElementTagNameMap>(
			tag: K,
			o?: DomElementInfo | string,
			callback?: (el: HTMLElementTagNameMap[K]) => void,
		): HTMLElementTagNameMap[K] {
			return createEl(globalThis, tag, o, callback);
		}

		static createDiv(o?: DomElementInfo | string, callback?: (el: HTMLDivElement) => void): HTMLDivElement {
			return createEl(globalThis, 'div', o, callback);
		}

		static createSpan(o?: DomElementInfo | string, callback?: (el: HTMLSpanElement) => void): HTMLSpanElement {
			return createEl(globalThis, 'span', o, callback);
		}

		static createSvg<K extends keyof SVGElementTagNameMap>(
			tag: K,
			o?: SvgElementInfo | string,
			callback?: (el: SVGElementTagNameMap[K]) => void,
		): SVGElementTagNameMap[K] {
			return createSvg(globalThis, tag, o, callback);
		}

		static createFragment(callback?: (el: DocumentFragment) => void): DocumentFragment {
			const frag = document.createDocumentFragment();
			if (callback) callback(frag);
			return frag;
		}

		static ajax(options: AjaxOptions): void {
			__UNIMPLEMENTED__();
		}

		static ajaxPromise(options: AjaxOptions): Promise<any> {
			__UNIMPLEMENTED__();
		}

		static ready(fn: () => any): void {
			// Normally this would call if document.readyState is not "loading", or
			// add it as event listener to "DOMContentReady". For tests, call it after a short delay.
			//
			// We use a delay so to user doesn't rely on it being called immediately.
			globalThis.setTimeout(() => fn(), 1);
		}

		static sleep(ms: number): Promise<void> {
			return sleep(globalThis, ms);
		}

		static nextFrame(): Promise<void> {
			return nextFrame(globalThis);
		}

		static get activeWindow(): Window {
			return globalThis.window;
		}

		static get activeDocument(): Document {
			return globalThis.document;
		}
	};
}
