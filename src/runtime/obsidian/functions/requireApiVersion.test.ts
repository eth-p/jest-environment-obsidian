/**
 * @jest-environment #meta-test/validation
 */
import { parseVersion } from '#runtime';
import { apiVersion, requireApiVersion } from 'obsidian';

import { expect, test } from '@jest/globals';

const lowerVersion = (() => {
	// Decrease the least-significant non-zero version component.
	// This will give us a version that is always lower than the apiVersion.
	const vs = parseVersion(apiVersion)!;
	vs.reverse();
	vs[vs.findIndex((n) => n !== 0)]--;
	vs.reverse();
	return vs.join('.');
})();

const higherVersion = (() => {
	// Increase the least-significant non-zero version component.
	// This will give us a version that is always higher than the apiVersion.
	const vs = parseVersion(apiVersion)!;
	vs.reverse();
	vs[vs.findIndex((n) => n !== 0)]++;
	vs.reverse();
	return vs.join('.');
})();

test('true when lower function than current', () => {
	expect(requireApiVersion(lowerVersion)).toBe(true);
});

test('false when higher function than current', () => {
	expect(requireApiVersion(higherVersion)).toBe(false);
});

test('true when invalid version', () => {
	expect(requireApiVersion('not-a-version')).toBe(true);
	expect(requireApiVersion(`v${higherVersion}`)).toBe(true);
});
