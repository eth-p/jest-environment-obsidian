/**
 * @jest-environment #meta-test/internal
 */
import { describe, test } from '@jest/globals';

import { arrayPadEnd } from './utils-array';

describe('arrayPadEnd', () => {
	test('returns copy', () => {
		const arr = [1, 2];
		expect(arrayPadEnd(arr, arr.length, 0)).not.toBe(arr);
	});

	test('when provided length is smaller', () => {
		expect(arrayPadEnd([1], 0, 0)).toStrictEqual([1]);
	});

	test('when provided length is larger', () => {
		expect(arrayPadEnd([1], 2, 0)).toStrictEqual([1, 0]);
	});

	test('uses fill value', () => {
		expect(arrayPadEnd([1], 2, 2)).toStrictEqual([1, 2]);
	});
});
