/**
 * @jest-environment <rootDir>/src/environment.ts
 */
import 'obsidian';

import { describe, expect, test } from '@jest/globals';

describe('isEmpty', () => {
	test('empty', () => {
		expect(Object.isEmpty({})).toBe(true);
	});

	test('empty, but with prototype', () => {
		const proto = {
			foo: 'bar',
		};

		const obj = Object.create(proto);
		expect(obj.foo).toBe('bar');
		expect(Object.isEmpty(obj)).toBe(true);
	});

	test('not empty', () => {
		expect(Object.isEmpty({ foo: 'bar' })).toBe(false);
	});
});

describe('each', () => {
	test('iterates all own keys and values', () => {
		const reconstructed: Record<string, unknown> = {};
		const obj = {
			foo: 'bar',
			bar: 'baz',
		};

		Object.each(obj, (v, k) => {
			reconstructed[k!] = v;
		});

		expect(reconstructed).toStrictEqual(obj);
	});

	test('ignores prototype values', () => {
		const reconstructed: Record<string, unknown> = {};
		const proto = {
			foo: 'bar',
		};

		const obj = Object.create(proto);

		Object.each(obj, (v, k) => {
			reconstructed[k!] = v;
		});

		expect(reconstructed).toStrictEqual({});
	});

	test('sets thisArg', () => {
		let self: unknown;
		const expectedSelf = 'foo';

		Object.each(
			{ bar: 'baz' },
			function (this: unknown, v, k) {
				self = this;
			},
			expectedSelf,
		);

		expect(self).toStrictEqual(expectedSelf);
	});

	test('returns true', () => {
		expect(Object.each({foo: "bar"}, () => {})).toBe(true);
	});

	test('returns false if predicate returns false', () => {
		expect(Object.each({foo: "bar"}, () => false)).toBe(false);
	});

	test('predicate returning falsey value is not treated as false', () => {
		expect(Object.each({foo: "bar"}, () => 0 as any)).toBe(true);
		expect(Object.each({foo: "bar"}, () => null as any)).toBe(true);
		expect(Object.each({foo: "bar"}, () => '' as any)).toBe(true);
	});

	test('predicate returning false stops iteration', () => {
		const reconstructed: Record<string, unknown> = {};

		Object.each({foo: true, bar: false, baz: true}, (v, k) => {
			reconstructed[k!] = v;
			return v;
		});

		expect(reconstructed).toStrictEqual({foo: true, bar: false});
	});
});
