// From Obsidian Type Definitions:
// Version 1.1.1
//
//     interface DocumentFragment extends Node, NonElementParentNode, ParentNode {
//         find(selector: string): HTMLElement;
//         findAll(selector: string): HTMLElement[];
//     }
//
import { _find, _findAll } from './Element';

/**
 * Finds an element within the document fragment by querying a selector.
 * @param selector The selector query.
 */
DocumentFragment.prototype.find = function find(selector: string): HTMLElement {
	return _find(this as DocumentFragment, selector) as HTMLElement;
};

/**
 * Finds zero or more elements within the document fragment by querying a selector.
 * @param selector The selector query.
 */
DocumentFragment.prototype.findAll = function findAll(selector: string): HTMLElement[] {
	return _findAll(this as DocumentFragment, selector) as HTMLElement[];
};
