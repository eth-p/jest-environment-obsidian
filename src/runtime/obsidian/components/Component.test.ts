/**
 * @jest-environment  #meta-test/validation
 */
import { Component } from 'obsidian';

import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

//
// Utilities.
//

/**
 * Get the children within the component.
 * This utility function will make refactoring easier if the variable name changes.
 */
function _children(component: Component): Component[] & { _add(c: Component): void; _clear(): void } {
	const children = (component as Component & { _children: Component[] })._children as ReturnType<typeof _children>;
	children._add = (c) => children.push(c);
	children._clear = () => children.splice(0, children.length);
	return children;
}

/**
 * Get the unregister functions within the component.
 * This utility function will make refactoring easier if the variable name changes.
 */
function _events(component: Component): Array<() => void> & { _add(e: () => void): void; _clear(): void } {
	const events = (component as Component & { _events: Array<() => void> })._events as ReturnType<typeof _events>;
	events._add = (e) => events.push(e);
	events._clear = () => events.splice(0, events.length);
	return events;
}

/**
 * Get the loaded variable within the component.
 * This utility function will make refactoring easier if the variable name changes.
 */
function _loaded(component: Component): boolean {
	return (component as Component & { _loaded: boolean })._loaded;
}

//
// Common variables.
//

let component!: Component;
afterEach(() => component.unload());
beforeEach(() => {
	component = new Component();
});

//
// Tests.
//

test('constructed with internal variables', () => {
	const component = new Component();
	expect(_loaded(component)).toBe(false);
	expect(_children(component).slice(0)).toStrictEqual([]);
	expect(_events(component).slice(0)).toStrictEqual([]);
});

describe('load', () => {
	test('sets _loaded', () => {
		component.load();
		expect(_loaded(component)).toBe(true);
	});

	test('calls onload', () => {
		let isSetToLoaded!: boolean;
		const onLoad = (component.onload = jest.fn(() => (isSetToLoaded = _loaded(component))));

		component.load();

		expect(onLoad).toBeCalledTimes(1);
		expect(onLoad).toBeCalledWith();
		expect(onLoad.mock.contexts[0]).toBe(component);

		// Should be called after _loaded is set to true.
		expect(isSetToLoaded).toBe(true);
	});

	test('calls children load', () => {
		const child = new Component();
		const childLoad = (child.load = jest.fn());

		_children(component)._add(child);
		component.load();

		expect(childLoad).toBeCalledWith();
		expect(childLoad).toBeCalledTimes(1);
		expect(childLoad.mock.contexts[0]).toBe(child);
	});

	test('calls in order of: self, children', () => {
		const order: string[] = [];
		const child = new Component();
		child.load = () => order.push('child');

		_children(component)._add(child);
		component.onload = () => order.push('self');
		component.load();

		// Should be called *after* the parent onload is called.
		expect(order).toStrictEqual(['self', 'child']);
	});

	test('does nothing if already loaded', () => {
		component.load();

		// Add a child.
		const child = new Component();
		_children(component)._add(child);

		// Add mocks.
		const onLoad = (component.onload = jest.fn());
		const childLoad = (child.load = jest.fn());

		// Call load.
		component.load();
		expect(childLoad).not.toBeCalled();
		expect(onLoad).not.toBeCalled();
	});
});

describe('unload', () => {
	beforeEach(() => component.load());

	test('sets _loaded', () => {
		component.unload();
		expect(_loaded(component)).toBe(false);
	});

	test('calls onunload', () => {
		let isSetToLoaded!: boolean;
		const onUnload = (component.onunload = jest.fn(() => (isSetToLoaded = _loaded(component))));

		component.unload();

		expect(onUnload).toBeCalledTimes(1);
		expect(onUnload).toBeCalledWith();
		expect(onUnload.mock.contexts[0]).toBe(component);

		// Should be called after _loaded is set to false.
		expect(isSetToLoaded).toBe(false);
	});

	test('calls children unload', () => {
		const child = new Component();
		const childUnload = (child.unload = jest.fn());

		_children(component)._add(child);
		component.unload();

		expect(childUnload).toBeCalledWith();
		expect(childUnload).toBeCalledTimes(1);
		expect(childUnload.mock.contexts[0]).toBe(child);
	});

	test('calls in order of: children, events, self', () => {
		const order: string[] = [];
		const child = new Component();
		child.unload = () => order.push('child');

		_children(component)._add(child);
		_events(component)._add(() => order.push('event'));
		component.onunload = () => order.push('self');

		// Call unload function.
		component.unload();

		// Should be called *before* the parent onload is called.
		expect(order).toStrictEqual(['child', 'event', 'self']);
	});

	test('clears events and children arrays', () => {
		const child = new Component();

		_children(component)._add(child);
		_events(component)._add(() => {});

		// Call unload function.
		component.unload();

		// Should be called *before* the parent onload is called.
		expect(_children(component).length).toBe(0);
		expect(_events(component).length).toBe(0);
	});

	test('does nothing if already unloaded', () => {
		component.unload();

		// Create mocks.
		const onUnload = jest.fn();
		const childUnload = jest.fn();
		const onUnregister = jest.fn();

		// Add a child.
		const child = new Component();
		child.unload = childUnload;
		_children(component)._add(child);

		// Add an event.
		_events(component)._add(onUnregister);

		// Call load.
		component.load();
		expect(childUnload).not.toBeCalled();
		expect(onUnregister).not.toBeCalled();
		expect(onUnload).not.toBeCalled();
	});
});

describe('addChild', () => {
	test('adds the child', () => {
		const child = new Component();
		component.addChild(child);
		expect(_children(component)).toContain(child);
	});

	test('does not load child if not loaded', () => {
		const child = new Component();
		const childLoad = (child.load = jest.fn());

		component.addChild(child);
		expect(childLoad).not.toBeCalled();
	});

	test('loads child if loaded', () => {
		const child = new Component();
		const childLoad = (child.load = jest.fn());

		component.load();
		component.addChild(child);
		expect(childLoad).toBeCalled();
	});

	test('returns child', () => {
		const child = new Component();
		expect(component.addChild(child)).toBe(child);
	});
});

describe('removeChild', () => {
	let child!: Component;
	beforeEach(() => {
		child = new Component();
		component.addChild(child);
		component.load();
	});

	test('removes the child', () => {
		component.removeChild(child);
		expect(_children(component)).not.toContain(child);
	});

	test('only removes the child', () => {
		const otherChild = new Component();
		component.addChild(otherChild);
		component.removeChild(child);

		expect(_children(component)).not.toContain(child);
		expect(_children(component)).toContain(otherChild);
	});

	test('unloads child if loaded', () => {
		const childUnload = jest.fn();
		child.unload = childUnload;

		component.removeChild(child);
		expect(childUnload).toBeCalled();
	});

	test('unloads the child, even if unloaded', () => {
		component.unload(); // removes the child
		component.addChild(child); // adds it back

		const childUnload = jest.fn();
		child.unload = childUnload;

		component.removeChild(child);
		expect(childUnload).toBeCalled();
	});

	test('does nothing if the child is not found', () => {
		const otherChild = new Component();

		const childUnload = jest.fn();
		child.unload = childUnload;

		const otherChildUnload = jest.fn();
		otherChild.unload = otherChildUnload;

		component.addChild(otherChild);
		component.removeChild(otherChild);
		expect(childUnload).not.toBeCalled();
		expect(otherChildUnload).toBeCalled();
	});

	test('returns child', () => {
		expect(component.removeChild(child)).toBe(child);
	});

	test('returns child, even if child is not found', () => {
		const otherChild = new Component();
		expect(component.removeChild(otherChild)).toBe(otherChild);
	});
});

describe('removeChild', () => {
	let child!: Component;
	beforeEach(() => {
		child = new Component();
		component.addChild(child);
		component.load();
	});

	test('removes the child', () => {
		component.removeChild(child);
		expect(_children(component)).not.toContain(child);
	});

	test('only removes the child', () => {
		const otherChild = new Component();
		component.addChild(otherChild);
		component.removeChild(child);

		expect(_children(component)).not.toContain(child);
		expect(_children(component)).toContain(otherChild);
	});

	test('unloads child if loaded', () => {
		const childUnload = jest.fn();
		child.unload = childUnload;

		component.removeChild(child);
		expect(childUnload).toBeCalled();
	});

	test('unloads the child, even if unloaded', () => {
		component.unload(); // removes the child
		component.addChild(child); // adds it back

		const childUnload = jest.fn();
		child.unload = childUnload;

		component.removeChild(child);
		expect(childUnload).toBeCalled();
	});

	test('does nothing if the child is not found', () => {
		const otherChild = new Component();

		const childUnload = jest.fn();
		child.unload = childUnload;

		const otherChildUnload = jest.fn();
		otherChild.unload = otherChildUnload;

		component.addChild(otherChild);
		component.removeChild(otherChild);
		expect(childUnload).not.toBeCalled();
		expect(otherChildUnload).toBeCalled();
	});

	test('returns child', () => {
		expect(component.removeChild(child)).toBe(child);
	});

	test('returns child, even if child is not found', () => {
		const otherChild = new Component();
		expect(component.removeChild(otherChild)).toBe(otherChild);
	});
});

describe('register', () => {
	test('adds the function', () => {
		const fn = () => {};
		component.register(fn);
		expect(_events(component)).toContain(fn);
	});

	test('adds the function in order', () => {
		const fn = () => {};
		const fn2 = () => {};

		component.register(fn);
		component.register(fn2);

		expect(_events(component)[0]).toBe(fn);
		expect(_events(component)[1]).toBe(fn2);
	});
});

// TODO: registerEvent
// Once we have an implementation.

describe('registerDomEvent', () => {
	let el!: HTMLDivElement;
	beforeEach(() => {
		el = document.createElement('div');
		el.addEventListener = jest.fn(el.addEventListener);
		el.removeEventListener = jest.fn(el.removeEventListener);
	});

	test('calls Component.register', () => {
		const fn = () => {};
		const register = (component.register = jest.fn(component.register));
		component.registerDomEvent(el, 'abort', fn);

		expect(register).toBeCalledTimes(1);
	});

	test('calls addEventListener on element', () => {
		const fn = () => {};
		component.registerDomEvent(el, 'abort', fn, { passive: false });

		expect(el.addEventListener).toBeCalledTimes(1);
		expect(el.addEventListener).toBeCalledWith('abort', fn, { passive: false });
	});

	test('calls removeEventListener on element as part of unregister', () => {
		const fn = () => {};
		const register = (component.register = jest.fn(component.register));
		component.registerDomEvent(el, 'abort', fn, { passive: false });

		// Call the unregister function.
		register.mock.calls[0][0]();

		// Check that it was called.
		expect(el.removeEventListener).toBeCalledTimes(1);
		expect(el.removeEventListener).toBeCalledWith('abort', fn, { passive: false });
	});
});

describe('registerInterval', () => {
	afterEach(() => {
		_events(component)._clear();
	});

	test('calls Component.register', () => {
		const register = (component.register = jest.fn(component.register));
		component.registerInterval(-1);

		expect(register).toBeCalledTimes(1);
	});
});
