// From Obsidian Type Definitions:
// Version 1.1.1
//
//     interface DocumentFragment extends Node, NonElementParentNode, ParentNode {
//         find(selector: string): HTMLElement;
//         findAll(selector: string): HTMLElement[];
//     }
//
import type EnvironmentOptions from '#options';
import { __UNIMPLEMENTED__ } from '#util';

import { find, findAll } from './Element';

export default function createExtension(globalThis: typeof global, options: EnvironmentOptions) {
	return class extends globalThis.DocumentFragment {
		find(selector: string): HTMLElement {
			return find(this as DocumentFragment, selector) as HTMLElement;
		}

		findAll(selector: string): HTMLElement[] {
			return findAll(this as DocumentFragment, selector) as HTMLElement[];
		}
	};
}
