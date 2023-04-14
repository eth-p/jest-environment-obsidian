/**
 * @jest-environment #meta-test/validation
 */
import { BaseComponent, ValueComponent } from 'obsidian';

import { beforeEach, describe, expect, jest, test } from '@jest/globals';

class ValueComponentSubclass extends ValueComponent<string> {
	#value: string;

	public constructor(value: string) {
		super();
		this.#value = value;
	}

	public getValue(): string {
		return this.#value;
	}

	public setValue(value: string): this {
		this.#value = value;
		return this;
	}
}

test('inherits from BaseComponent', () => {
	const instance = new ValueComponentSubclass('');
	expect(instance).toBeInstanceOf(BaseComponent);
});

describe('registerOptionListeners', () => {
	let listeners!: Record<string, (v?: string) => string>;
	let instance!: ValueComponent<string>;
	beforeEach(() => {
		listeners = {};
		instance = new ValueComponentSubclass('');
	});

	test('adds listener to map', () => {
		instance.registerOptionListener(listeners, 'foo');
		expect(Object.keys(listeners).length).toBe(1);
		expect(typeof listeners['foo']).toBe('function');
	});

	test('listener calls getValue', () => {
		const getValue = (instance.getValue = jest.fn(instance.getValue));
		instance.registerOptionListener(listeners, 'foo');

		// When provided undefined value.
		listeners['foo'](undefined);
		expect(getValue).toBeCalled();
		expect(getValue).toBeCalledWith();

		// When provided value.
		getValue.mockClear();
		listeners['foo']('bar');
		expect(getValue).toBeCalled();
		expect(getValue).toBeCalledWith();
	});

	test('listener does not call setValue when provided undefined', () => {
		const setValue = (instance.setValue = jest.fn(instance.setValue));

		instance.registerOptionListener(listeners, 'foo');
		listeners['foo']();

		expect(setValue).not.toBeCalled();
	});

	test('listener calls setValue when provided value', () => {
		const setValue = (instance.setValue = jest.fn(instance.setValue));

		instance.registerOptionListener(listeners, 'foo');
		listeners['foo']('bar');

		expect(setValue).toBeCalled();
		expect(setValue).toBeCalledWith('bar');
	});
});
