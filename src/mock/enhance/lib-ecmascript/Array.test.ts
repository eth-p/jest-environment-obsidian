/**
 * @jest-environment <rootDir>/src/environment.ts
 * @validation-test
 */
import 'obsidian';

import { expect, test } from '@jest/globals';

test('first', async () => {
	expect([].first()).toBe(undefined);
	expect(['first', '.', '..', '...', 'last'].first()).toBe('first');
});

test('last', async () => {
	expect([].last()).toBe(undefined);
	expect(['first', '.', '..', '...', 'last'].last()).toBe('last');
});

test('remove', async () => {
	const arr = ['foo', 'bar', 'foo'];
	arr.remove('foo');
	expect(arr).toStrictEqual(['bar']);
});

test('contains', async () => {
	const arr = ['foo', 'bar', 'foo'];
	expect(arr.contains('bar')).toBe(true);
	expect(arr.contains('nope')).toBe(false);
});

test('combine', async () => {
	expect(Array.combine([[], [], []])).toStrictEqual([]);
	expect(Array.combine([])).toStrictEqual([]);
	expect(Array.combine([[1], [2]])).toStrictEqual([1, 2]);
	expect(Array.combine([[1, 3], [2], [4]])).toStrictEqual([1, 3, 2, 4]);
});
