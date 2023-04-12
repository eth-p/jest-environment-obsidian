// From Obsidian Type Definitions:
// Version 1.1.1
//
//     interface Node {
//         detach(): void;
//         empty(): void;
//         insertAfter<T extends Node>(node: T, child: Node | null): T;
//         indexOf(other: Node): number;
//         setChildrenInPlace(children: Node[]): void;
//         appendText(val: string): void;
//         instanceOf<T>(type: {
//             new (): T;
//         }): this is T;
//         doc: Document;
//         win: Window;
//         constructorWin: Window;
//     }
//
//     interface Node {
//         createEl<K extends keyof HTMLElementTagNameMap>(tag: K, o?: DomElementInfo | string, callback?: (el: HTMLElementTagNameMap[K]) => void): HTMLElementTagNameMap[K];
//         createDiv(o?: DomElementInfo | string, callback?: (el: HTMLDivElement) => void): HTMLDivElement;
//         createSpan(o?: DomElementInfo | string, callback?: (el: HTMLSpanElement) => void): HTMLSpanElement;
//         createSvg<K extends keyof SVGElementTagNameMap>(tag: K, o?: SvgElementInfo | string, callback?: (el: SVGElementTagNameMap[K]) => void): SVGElementTagNameMap[K];
//     }
//
import { __UNIMPLEMENTED__ } from '#runtime';

import { _createEl, _createSvg, infoFrom } from './_createEl';

Node.prototype.instanceOf = function instanceOf<T>(type: { new (): T }): boolean {
	return this instanceof type;
};

Node.prototype.empty = function empty(): void {
	_empty(this);
};

Node.prototype.detach = function detach(): void {
	if (this.parentNode != null) {
		this.parentNode.removeChild(this);
	}
};

Node.prototype.insertAfter = function insertAfter<T extends Node>(nodeToInsert: T, relativeTo: Node | null): T {
	if (relativeTo == null) {
		return this.insertBefore(nodeToInsert, this.firstChild);
	}

	return this.insertBefore(nodeToInsert, relativeTo.nextSibling);
};

Node.prototype.indexOf = function indexOf(other: Node): number {
	for (let i = 0; i < this.childNodes.length; i++) {
		if (this.childNodes[i] === other) {
			return i;
		}
	}

	return -1;
};

Node.prototype.setChildrenInPlace = function setChildrenInPlace(children: Node[]): void {
	__UNIMPLEMENTED__();
};

Node.prototype.appendText = function appendText(val: string): void {
	const node = document.createTextNode(val);
	this.appendChild(node);
};

Object.defineProperty(Node.prototype, 'doc', {
	get(): Document {
		return document;
	},
});

Object.defineProperty(Node.prototype, 'win', {
	get(): Window {
		return window;
	},
});

Object.defineProperty(Node.prototype, 'constructorWin', {
	get(): Window {
		return window;
	},
});

Node.prototype.createEl = function createEl<K extends keyof HTMLElementTagNameMap>(
	tag: K,
	o?: DomElementInfo | string,
	callback?: (el: HTMLElementTagNameMap[K]) => void,
): HTMLElementTagNameMap[K] {
	const info = infoFrom(o);
	info.parent = this;

	return _createEl(tag, info, callback);
};

Node.prototype.createDiv = function createDiv(
	o?: DomElementInfo | string,
	callback?: (el: HTMLDivElement) => void,
): HTMLDivElement {
	return this.createEl('div', o, callback);
};

Node.prototype.createSpan = function createSpan(
	o?: DomElementInfo | string,
	callback?: (el: HTMLSpanElement) => void,
): HTMLSpanElement {
	return this.createEl('span', o, callback);
};

Node.prototype.createSvg = function createSvg<K extends keyof SVGElementTagNameMap>(
	tag: K,
	o?: SvgElementInfo | string,
	callback?: (el: SVGElementTagNameMap[K]) => void,
): SVGElementTagNameMap[K] {
	const info = infoFrom(o);
	info.parent = this;

	return _createSvg(tag, info, callback);
};

export function _empty(node: Node) {
	while (node.firstChild != null) {
		node.removeChild(node.firstChild);
	}
}
