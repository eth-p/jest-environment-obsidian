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
