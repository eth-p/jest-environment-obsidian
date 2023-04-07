/**
 * @jest-environment <rootDir>/src/environment.ts
 */
import { expect, test } from '@jest/globals';
import 'obsidian';

test('isNumber', () => {
	expect(Number.isNumber(2)).toBe(true);
	expect(Number.isNumber(NaN)).toBe(true);

	expect(Number.isNumber("")).toBe(false);
	expect(Number.isNumber(null)).toBe(false);
	expect(Number.isNumber(undefined)).toBe(false);
});
