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
import { __UNIMPLEMENTED__ } from '#runtime';

import { _nextFrame, _sleep } from './Window';
import { _createEl, _createSvg } from './_createEl';

globalThis.fish = function fish(selector: string): HTMLElement | null {
	return document.querySelector(selector);
};

globalThis.fishAll = function fishAll(selector: string): HTMLElement[] {
	return Array.from(document.querySelectorAll(selector));
};

globalThis.createEl = function createEl<K extends keyof HTMLElementTagNameMap>(
	tag: K,
	o?: DomElementInfo | string,
	callback?: (el: HTMLElementTagNameMap[K]) => void,
): HTMLElementTagNameMap[K] {
	return _createEl(tag, o, callback);
};

globalThis.createDiv = function createDiv(
	o?: DomElementInfo | string,
	callback?: (el: HTMLDivElement) => void,
): HTMLDivElement {
	return _createEl('div', o, callback);
};

globalThis.createSpan = function createSpan(
	o?: DomElementInfo | string,
	callback?: (el: HTMLSpanElement) => void,
): HTMLSpanElement {
	return _createEl('span', o, callback);
};

globalThis.createSvg = function createSvg<K extends keyof SVGElementTagNameMap>(
	tag: K,
	o?: SvgElementInfo | string,
	callback?: (el: SVGElementTagNameMap[K]) => void,
): SVGElementTagNameMap[K] {
	return _createSvg(tag, o, callback);
};

globalThis.createFragment = function createFragment(callback?: (el: DocumentFragment) => void): DocumentFragment {
	const frag = document.createDocumentFragment();
	if (callback) callback(frag);
	return frag;
};

globalThis.ajax = function ajax(options: AjaxOptions): void {
	__UNIMPLEMENTED__();
};

globalThis.ajaxPromise = function ajaxPromise(options: AjaxOptions): Promise<any> {
	__UNIMPLEMENTED__();
};

globalThis.ready = function ready(fn: () => any): void {
	// Normally this would call if document.readyState is not "loading", or
	// add it as event listener to "DOMContentReady". For tests, call it after a short delay.
	//
	// We use a delay so to user doesn't rely on it being called immediately.
	setTimeout(() => fn(), 1);
};

globalThis.sleep = function sleep(ms: number): Promise<void> {
	return _sleep(ms);
};

globalThis.nextFrame = function nextFrame(): Promise<void> {
	return _nextFrame();
};

Object.defineProperty(globalThis, 'activeWindow', {
	get() {
		return window;
	},
});

Object.defineProperty(globalThis, 'activeDocument', {
	get() {
		return document;
	},
});
