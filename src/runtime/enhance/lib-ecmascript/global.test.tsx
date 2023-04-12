/**
 * @jest-environment #meta-test/validation
 */
import 'obsidian';

import { expect, test } from '@jest/globals';

test('isBoolean', () => {
	expect(isBoolean(true)).toBe(true);
	expect(isBoolean(false)).toBe(true);

	expect(isBoolean('true')).toBe(false);
	expect(isBoolean(1)).toBe(false);
	expect(isBoolean(() => {})).toBe(false);
	expect(isBoolean(null)).toBe(false);
	expect(isBoolean(undefined)).toBe(false);
});
