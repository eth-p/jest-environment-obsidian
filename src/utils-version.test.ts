/**
 * @jest-environment #meta-test/internal
 */
import { describe, test } from '@jest/globals';

import { compareVersion } from './utils-version';

describe('_arrayRightPadded', () => {});

describe('_compareVersion', () => {
	test('same version', () => {
		expect(compareVersion([1, 2, 3], [1, 2, 3])).toBe(0);
	});

	test('lower patch version', () => {
		expect(compareVersion([1, 2, 2], [1, 2, 3])).toBe(-1);
	});

	test('lower minor version', () => {
		expect(compareVersion([1, 1, 4], [1, 2, 3])).toBe(-1);
	});

	test('lower major version', () => {
		expect(compareVersion([1, 5, 5], [2, 1, 0])).toBe(-1);
	});

	test('higher patch version', () => {
		expect(compareVersion([1, 2, 3], [1, 2, 2])).toBe(1);
	});

	test('higher minor version', () => {
		expect(compareVersion([1, 2, 3], [1, 1, 4])).toBe(1);
	});

	test('higher major version', () => {
		expect(compareVersion([2, 1, 0], [1, 5, 5])).toBe(1);
	});

	test('empty version is zero', () => {
		expect(compareVersion([], [])).toBe(0);
	});

	test('assumes missing parts are zero', () => {
		expect(compareVersion([1], [1, 0, 0])).toBe(0);
	});
});
