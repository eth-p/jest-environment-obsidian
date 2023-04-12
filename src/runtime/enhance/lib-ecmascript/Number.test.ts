/**
 * @jest-environment #meta-test/validation
 */
import 'obsidian';

import { expect, test } from '@jest/globals';

test('isNumber', () => {
	expect(Number.isNumber(2)).toBe(true);
	expect(Number.isNumber(NaN)).toBe(true);

	expect(Number.isNumber('')).toBe(false);
	expect(Number.isNumber(null)).toBe(false);
	expect(Number.isNumber(undefined)).toBe(false);
});
