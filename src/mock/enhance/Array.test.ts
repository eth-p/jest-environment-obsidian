/**
 * @jest-environment <rootDir>/src/environment.ts
 */
import { expect, test } from '@jest/globals';
import 'obsidian';

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
