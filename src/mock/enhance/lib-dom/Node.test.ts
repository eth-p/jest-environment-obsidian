/**
 * @jest-environment <rootDir>/src/environment.ts
 */
import { expect, test } from '@jest/globals';
import 'obsidian';

test('isInstanceOf', () => {
	const textNode = document.createTextNode("text");
	const divNode = document.createElement("div");

	expect(textNode.instanceOf(Text)).toBe(true);
	expect(textNode.instanceOf(Element)).toBe(false);

	expect(divNode.instanceOf(HTMLElement)).toBe(true);
	expect(divNode.instanceOf(HTMLDivElement)).toBe(true);
	expect(divNode.instanceOf(Text)).toBe(false);
});

test('empty', () => {
	const container = document.createElement("div");

	// Sanity check.
	expect(container.hasChildNodes()).toBe(false);

	// Add something.
	container.appendChild(document.createTextNode("text"));
	container.appendChild(document.createElement("button"));
	expect(container.hasChildNodes()).toBe(true);

	// Call empty().
	expect(() => container.empty()).not.toThrow();
	expect(container.hasChildNodes()).toBe(false);
});

test('detach', () => {
	const container = document.createElement("div");
	const target = document.createElement("div");

	container.appendChild(target);

	// Sanity check.
	expect(container.firstElementChild).toBe(target);
	expect(target.parentNode).toBe(container);

	// Call detach.
	expect(() => target.detach()).not.toThrow();
	expect(container.firstElementChild).toBe(null);
	expect(target.parentNode).toBe(null);
});

test('insertAfter', () => {
	const container = document.createElement("div");
	const anchor = document.createElement("a");
	const afterAnchor = document.createElement("a");
	const target = document.createElement("div");

	container.appendChild(anchor);
	container.appendChild(afterAnchor);

	// Call insertAfter() with anchor.
	expect(() => container.insertAfter(target, anchor)).not.toThrow();
	expect(target.parentNode).toBe(container);
	expect(target.previousElementSibling).toBe(anchor);
	expect(target.nextElementSibling).toBe(afterAnchor);

	// Call insertAfter() with nothing after anchor.
	expect(() => container.insertAfter(target, afterAnchor)).not.toThrow();
	expect(target.parentNode).toBe(container);
	expect(target.previousElementSibling).toBe(afterAnchor);
	expect(target.nextElementSibling).toBe(null);

	// Call insertAfter() with nothing.
	expect(() => container.insertAfter(target, null)).not.toThrow();
	expect(target.parentNode).toBe(container);
	expect(target.previousElementSibling).toBe(null);
	expect(target.nextElementSibling).toBe(anchor);
});

test('indexOf', () => {
	const container = document.createElement("div");
	const child1 = document.createElement("a");
	const child2 = document.createElement("a");
	const notChild = document.createElement("span");

	container.appendChild(child1);
	container.appendChild(child2);

	expect(container.indexOf(notChild)).toBe(-1);
	expect(container.indexOf(child1)).toBe(0);
	expect(container.indexOf(child2)).toBe(1);
});

test('appendText', () => {
	const container = document.createElement("div");
	const child1 = document.createElement("a");
	child1.textContent = ' bar';

	container.appendChild(document.createTextNode("foo"));
	container.appendChild(child1);

	// Sanity.
	expect(container.childNodes.length).toBe(2);
	expect(container.textContent).toBe("foo bar");

	// Append text.
	container.appendText(" baz");
	expect(container.childNodes.length).toBe(3);
	expect(container.textContent).toBe("foo bar baz");

	// Append text again.
	container.appendText("!");
	expect(container.childNodes.length).toBe(4);
	expect(container.textContent).toBe("foo bar baz!");
});

test('win', () => {
	const container = document.createElement("div");
	expect(container.win).toBe(window);
});

test('doc', () => {
	const container = document.createElement("div");
	expect(container.doc).toBe(document);
});

test('constructorWin', () => {
	const container = document.createElement("div");
	expect(container.constructorWin).toBe(window);
});


