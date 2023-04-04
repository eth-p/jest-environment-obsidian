import type { JSX, WithChildren } from './jsx-intrinsics';

export type { JSX } from './jsx-intrinsics';

export const Fragment = Symbol('documentFragment');

function createElement<T extends keyof JSX.IntrinsicElements>(
	tagName: T,
	attributes: JSX.IntrinsicElements[T],
): Element {
	const targetEl = document.createElement(tagName);

	// Set element attributes.
	for (let [attrName, attrValue] of Object.entries(attributes)) {
		const name = attributeNameMap.get(attrName) ?? attrName;
		const value = serializeAttributeValue(name, attrValue);
		if (value !== undefined) {
			targetEl.setAttribute(name, attrValue);
		}
	}

	// Add the children.
	for (const child of getChildren(attributes as Record<string, unknown>)) {
		targetEl.appendChild(child);
	}

	return targetEl;
}

function createFragment(value: typeof Fragment, attributes: { children: Array<unknown> }): DocumentFragment {
	const targetEl = document.createDocumentFragment();

	// Add the children.
	for (const child of getChildren(attributes as Record<string, unknown>)) {
		targetEl.appendChild(child);
	}

	return targetEl;
}

/**
 * Creates a DOM Element.
 *
 * @param tagName The element tag name.
 * @param attributes The element attributes.
 */
export function jsx<T extends keyof JSX.IntrinsicElements>(
	tagName: T,
	attributes: WithChildren<JSX.IntrinsicElements[T]>,
): JSX.DOMElements[T];

/**
 * Creates a DOM fragment.
 *
 * @param fragment A symbol.
 * @param attributes An object with only children.
 */
export function jsx<T extends keyof JSX.IntrinsicElements>(
	fragment: typeof Fragment,
	attributes: WithChildren<Record<string, never>>,
): JSX.DOMElements[T];

/**
 * A JSX factory that uses the DOM API.
 * This is used to make testing a little bit easier.
 *
 * @internal
 */
export function jsx(tagName: string | typeof Fragment, attributes: WithChildren<object>): Element | DocumentFragment {
	if (tagName === Fragment) {
		return createFragment(Fragment, attributes);
	}

	return createElement(tagName as any, attributes);
}

export const jsxs = jsx;

const attributeNameMap = new Map([
	['className', 'class'], //
]);

/**
 * Converts an attribute value to a string.
 *
 * @param name The attribute name.
 * @param value The attribute value.
 *
 * @returns The attribute value as a string, or undefined if it should not be added.
 */
function serializeAttributeValue(name: string, value: any): string | undefined {
	switch (typeof value) {
		case 'string':
		case 'number':
		case 'bigint':
			return `${value}`;

		case 'boolean':
			return name;
	}
}

/**
 * Extracts the children nodes from JSX attributes.
 */
function getChildren(attributes: Record<string, unknown>): Node[] {
	const childrenArray = attributes.children instanceof Array ? attributes.children : [attributes.children];
	const childrenNodes = [];

	for (const child of childrenArray) {
		if (child == null) continue;

		if (child instanceof Node) {
			childrenNodes.push(child);
			continue;
		}

		if (typeof child === 'string') {
			const textNode = document.createTextNode(child);
			childrenNodes.push(textNode);
			continue;
		}

		if (typeof child === 'boolean') {
			continue;
		}

		throw new Error('JSX factory only supports HTML element children.');
	}

	return childrenNodes;
}
