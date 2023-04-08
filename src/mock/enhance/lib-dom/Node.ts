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
import type EnvironmentOptions from '#options';
import { __UNIMPLEMENTED__ } from '#util';

import { createEl, createSvg, infoFrom } from './_createEl';

export default function createExtension(globalThis: typeof global, options: EnvironmentOptions) {
	return class extends globalThis.Node {
		instanceOf<T>(type: { new (): T }): boolean {
			return this instanceof type;
		}

		empty(): void {
			empty(this);
		}

		detach(): void {
			if (this.parentNode != null) {
				this.parentNode.removeChild(this);
			}
		}

		insertAfter<T extends Node>(nodeToInsert: T, relativeTo: Node | null): T {
			if (relativeTo == null) {
				return this.insertBefore(nodeToInsert, this.firstChild);
			}

			return this.insertBefore(nodeToInsert, relativeTo.nextSibling);
		}

		indexOf(other: Node): number {
			for (let i = 0; i < this.childNodes.length; i++) {
				if (this.childNodes[i] === other) {
					return i;
				}
			}

			return -1;
		}

		setChildrenInPlace(children: Node[]): void {
			__UNIMPLEMENTED__();
		}

		appendText(val: string): void {
			const node = globalThis.document.createTextNode(val);
			this.appendChild(node);
		}

		get doc(): Document {
			return globalThis.document;
		}

		get win(): Window {
			return globalThis.window;
		}

		get constructorWin(): Window {
			return this.win;
		}

		createEl<K extends keyof HTMLElementTagNameMap>(
			tag: K,
			o?: DomElementInfo | string,
			callback?: (el: HTMLElementTagNameMap[K]) => void,
		): HTMLElementTagNameMap[K] {
			const info = infoFrom(o);
			info.parent = this;

			return createEl(globalThis, tag, info, callback);
		}

		createDiv(o?: DomElementInfo | string, callback?: (el: HTMLDivElement) => void): HTMLDivElement {
			return this.createEl('div', o, callback);
		}

		createSpan(o?: DomElementInfo | string, callback?: (el: HTMLSpanElement) => void): HTMLSpanElement {
			return this.createEl('span', o, callback);
		}

		createSvg<K extends keyof SVGElementTagNameMap>(
			tag: K,
			o?: SvgElementInfo | string,
			callback?: (el: SVGElementTagNameMap[K]) => void,
		): SVGElementTagNameMap[K] {
			const info = infoFrom(o);
			info.parent = this;

			return createSvg(globalThis, tag, info, callback);
		}
	};
}

export function empty(node: Node) {
	while (node.firstChild != null) {
		node.removeChild(node.firstChild);
	}
}
