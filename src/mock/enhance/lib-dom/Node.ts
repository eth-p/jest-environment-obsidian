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
import type EnvironmentOptions from '#options';
import { __UNIMPLEMENTED__ } from '#util';

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
	};
}

export function empty(node: Node) {
	while (node.firstChild != null) {
		node.removeChild(node.firstChild);
	}
}