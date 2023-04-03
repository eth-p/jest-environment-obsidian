/**
 * @jest-environment <rootDir>/src/environment.ts
 */
import { expect, test } from '@jest/globals';
import 'obsidian';

test('isString', () => {
	expect(String.isString("yes")).toBe(true);
	expect(String.isString("")).toBe(true);

	expect(String.isString(true)).toBe(false);
	expect(String.isString(null)).toBe(false);
	expect(String.isString(undefined)).toBe(false);
	expect(String.isString({})).toBe(false);
	expect(String.isString(() => "no")).toBe(false);
});
