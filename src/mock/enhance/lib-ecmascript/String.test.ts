/**
 * @jest-environment <rootDir>/src/environment.ts
 */
import 'obsidian';

import { expect, test } from '@jest/globals';

test('isString', () => {
	expect(String.isString('yes')).toBe(true);
	expect(String.isString('')).toBe(true);

	expect(String.isString(true)).toBe(false);
	expect(String.isString(null)).toBe(false);
	expect(String.isString(undefined)).toBe(false);
	expect(String.isString({})).toBe(false);
	expect(String.isString(() => 'no')).toBe(false);
});

test('contains', () => {
	expect('foo'.contains('foo')).toBe(true);
	expect('foo'.contains('food')).toBe(false);
	expect('foo'.contains('oo')).toBe(true);
	expect('foo'.contains('f')).toBe(true);
	expect('foo'.contains('')).toBe(true);
});

test('format', () => {
	expect('foo {0}'.format('bar')).toBe('foo bar');
	expect('foo {0}'.format(['bar', 'baz'] as any)).toBe('foo bar,baz');
	expect('{0}'.format(null as any)).toBe(`${null}`);
	expect('{0}'.format()).toBe('{0}');

	// Special case: `undefined` is treated as missing.
	expect('{0}'.format(undefined as any)).toBe('{0}');
});
