/**
 * @jest-environment  #meta-test/validation
 */
import { EventRef, Events } from 'obsidian';

import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { MockedFunction } from 'jest-mock';

//
// Utilities.
//

function _events(ev: Events): Record<string, EventRef[]> {
	return (ev as Events & { _: Record<string, EventRef[]> })._;
}

//
// Common variables.
//

let events!: Events;
beforeEach(() => {
	events = new Events();
});

//
// Tests.
//

test('constructed with internal variables', () => {
	const events = new Events();
	expect(typeof _events(events)).toBe('object');
	expect(Object.entries(_events(events))).toStrictEqual([]);
});

describe('on', () => {
	test('adds event', () => {
		events.on('test', () => {});
		expect(_events(events)['test']).toBeInstanceOf(Array);
	});

	test('adds same event multiple times', () => {
		const fn = () => {};
		events.on('test', fn);
		events.on('test', fn);
		expect(_events(events)['test'].length).toBe(2);
	});

	test('returns same ref as used by internal event array', () => {
		const ref = events.on('test', () => {});
		expect(_events(events)['test']).toContain(ref);
	});

	test('ref contains event name', () => {
		const name = 'test';
		const ref = events.on(name, () => {});

		const propKeys = [...Object.getOwnPropertySymbols(ref), ...Object.getOwnPropertyNames(ref)];
		const propVals = propKeys.map((p) => (ref as any)[p]);
		expect(propVals).toContain(name);
	});

	test('ref contains listener context', () => {
		const ctx = { foo: 'bar' };
		const ref = events.on('test', () => {}, ctx);

		const propKeys = [...Object.getOwnPropertySymbols(ref), ...Object.getOwnPropertyNames(ref)];
		const propVals = propKeys.map((p) => (ref as any)[p]);
		expect(propVals).toContain(ctx);
	});

	test('ref contains listener function', () => {
		const fn = () => {};
		const ref = events.on('test', fn);

		const propKeys = [...Object.getOwnPropertySymbols(ref), ...Object.getOwnPropertyNames(ref)];
		const propVals = propKeys.map((p) => (ref as any)[p]);
		expect(propVals).toContain(fn);
	});
});

describe('off', () => {
	const name = 'test';
	let fn!: () => void;
	let fn2!: () => void;
	let fnRef!: EventRef;
	let fn2Ref!: EventRef;

	beforeEach(() => {
		fn = jest.fn();
		fn2 = jest.fn();
		fnRef = events.on(name, fn);
		fn2Ref = events.on(name, fn2);
	});

	test('removes event', () => {
		events.off(name, fn2);
		expect(_events(events)[name]).not.toContain(fn2Ref);
	});

	test('removes only from the correct name', () => {
		const otherRef = events.on('other', fn2);
		events.off(name, fn2);

		expect(_events(events)[name]).not.toContain(fn2Ref);
		expect(_events(events)['other']).toContain(otherRef);
	});

	test('retains order', () => {
		const fn3Ref = events.on(name, () => {});
		events.off(name, fn2);

		expect(_events(events)[name][0]).toBe(fnRef);
		expect(_events(events)[name][1]).toBe(fn3Ref);
	});

	test('does not mutate event listener array', () => {
		const listenerArray = _events(events)[name];
		events.off(name, fn2);
		expect(_events(events)[name]).not.toBe(listenerArray);
	});

	test('removes multiple instances of the same event', () => {
		const fn2Ref2 = events.on(name, fn2);
		events.off(name, fn2);

		expect(_events(events)[name]).not.toContain(fn2Ref);
		expect(_events(events)[name]).not.toContain(fn2Ref2);
	});

	test('does nothing if event name not found', () => {
		events.off('not-an-event', () => {});

		expect(_events(events)[name]).toContain(fnRef);
		expect(_events(events)[name]).toContain(fn2Ref);
	});

	test('does nothing if event listener not found', () => {
		events.off(name, () => {});

		expect(_events(events)[name]).toContain(fnRef);
		expect(_events(events)[name]).toContain(fn2Ref);
	});

	test('removes array if no events left', () => {
		events.off(name, fn);
		events.off(name, fn2);

		expect(_events(events)[name]).toBeUndefined();
		expect(name in _events(events)).toBe(false);
	});

	test('is independent from offref', () => {
		const offref = (events.offref = jest.fn());
		events.off(name, fn2);
		expect(offref).not.toBeCalled();
	});
});

describe('offref', () => {
	const name = 'test';
	let fn!: () => void;
	let fn2!: () => void;
	let fnRef!: EventRef;
	let fn2Ref!: EventRef;

	beforeEach(() => {
		fn = jest.fn();
		fn2 = jest.fn();
		fnRef = events.on(name, fn);
		fn2Ref = events.on(name, fn2);
	});

	test('removes event', () => {
		events.offref(fn2Ref);
		expect(_events(events)[name]).not.toContain(fn2Ref);
	});

	test('removes only the single ref if there are multiple events with the same listener', () => {
		const fn2Ref2 = events.on(name, fn2);
		events.offref(fn2Ref);

		expect(_events(events)[name]).not.toContain(fn2Ref);
		expect(_events(events)[name]).toContain(fn2Ref2);
	});

	test('retains order', () => {
		const fn3Ref = events.on(name, () => {});
		events.offref(fn2Ref);

		expect(_events(events)[name][0]).toBe(fnRef);
		expect(_events(events)[name][1]).toBe(fn3Ref);
	});

	test('does not mutate event listener array', () => {
		const listenerArray = _events(events)[name];
		events.offref(fn2Ref);
		expect(_events(events)[name]).not.toBe(listenerArray);
	});

	test('does nothing if event ref not from the instance', () => {
		const other = new Events();
		const otherRef = other.on(name, () => {});
		events.offref(otherRef);

		expect(_events(events)[name]).toContain(fnRef);
		expect(_events(events)[name]).toContain(fn2Ref);
		expect(_events(other)[name]).toContain(otherRef);
	});

	test('does nothing if event ref is invalid', () => {
		events.offref({});

		expect(_events(events)[name]).toContain(fnRef);
		expect(_events(events)[name]).toContain(fn2Ref);
	});

	test('removes array if no events left', () => {
		events.offref(fnRef);
		events.offref(fn2Ref);

		expect(_events(events)[name]).toBeUndefined();
		expect(name in _events(events)).toBe(false);
	});

	test('is independent from off', () => {
		const off = (events.off = jest.fn());
		events.offref(fnRef);
		expect(off).not.toBeCalled();
	});
});

describe('trigger', () => {
	const name = 'test';
	let fn!: MockedFunction<() => void>;
	let fnRef!: EventRef;

	beforeEach(() => {
		fn = jest.fn();
		fnRef = events.on(name, fn);
	});

	test('calls the function', () => {
		events.trigger(name);
		expect(fn).toBeCalledTimes(1);
	});

	test('calls the function with params', () => {
		events.trigger(name, 'foo', 'bar');
		expect(fn).toBeCalledWith('foo', 'bar');
	});

	test('calls the function with undefined context by default', () => {
		events.trigger(name, 'foo', 'bar');
		expect(fn.mock.contexts[0]).toBeUndefined();
	});

	test('calls the function with provided context', () => {
		events.on('with-context', fn, 'the context');
		events.trigger('with-context');
		expect(fn.mock.contexts[0]).toBe('the context');
	});

	test('calls in order of added', () => {
		const order: number[] = [];
		const name = 'ordered';

		events.on(name, () => order.push(1));
		events.on(name, () => order.push(2));
		events.on(name, () => order.push(3));

		events.trigger(name);
		expect(order).toStrictEqual([1, 2, 3]);
	});

	test('throw does not prevent remaining listeners from getting called', () => {
		const fn = jest.fn();
		const throwError = jest.fn(() => {
			throw new Error('Expected Error');
		});

		events.on(name, throwError);
		events.on(name, fn);

		events.trigger(name);

		expect(throwError).toBeCalled();
		expect(throwError.mock.results[0].type).toBe('throw');
		expect(fn).toBeCalled();
	});

	test('calls tryTrigger to trigger', () => {
		const tryTrigger = (events.tryTrigger = jest.fn(events.tryTrigger));
		events.trigger(name, 'foo', 'bar');
		expect(tryTrigger).toBeCalledTimes(1);
		expect(tryTrigger).toBeCalledWith(fnRef, ['foo', 'bar']);
	});
});

describe('tryTrigger', () => {
	const name = 'test';
	let fn!: MockedFunction<() => void>;
	let ref!: EventRef;

	beforeEach(() => {
		fn = jest.fn();
		ref = events.on(name, fn);
	});

	test('calls the function', () => {
		events.tryTrigger(ref, []);
		expect(fn).toBeCalledTimes(1);
	});

	test('calls the function with params', () => {
		events.tryTrigger(ref, ['foo', 'bar']);
		expect(fn).toBeCalledWith('foo', 'bar');
	});

	test('calls the function with undefined context by default', () => {
		events.tryTrigger(ref, []);
		expect(fn.mock.contexts[0]).toBeUndefined();
	});

	test('calls the function with provided context', () => {
		const ref = events.on('with-context', fn, 'the context');
		events.tryTrigger(ref, []);
		expect(fn.mock.contexts[0]).toBe('the context');
	});

	test('ignores thrown errors', () => {
		fn.mockImplementation(() => {
			throw new Error('Expected Error');
		});

		expect(() => events.tryTrigger(ref, [])).not.toThrow();
		expect(fn).toBeCalledTimes(1);
	});
});
