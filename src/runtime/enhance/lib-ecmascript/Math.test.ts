/**
 * @jest-environment #meta-test/validation
 */
import 'obsidian';

import { expect, test } from '@jest/globals';

test('clamp', async () => {
	expect(Math.clamp(5, 0, 10)).toBe(5);
	expect(Math.clamp(5, 7, 10)).toBe(7);
	expect(Math.clamp(5, 0, 3)).toBe(3);
});

test('square', async () => {
	expect(Math.square(2)).toBe(4);
});
