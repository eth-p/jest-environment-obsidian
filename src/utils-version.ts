import { arrayPadEnd } from './utils-array';

const REGEX_VERSION = /^((?:[0-9]+\.)*[0-9]+)(-.*)?$/;

export type Version = Array<number>;

/**
 * Parses a version string into an array of numbers.
 *
 * @param version The version string.
 * @returns The parsed version, or null if the version string is invalid.
 */
export function parseVersion(version: string): Version | null {
	const [_, numbers] = REGEX_VERSION.exec(version) ?? [null, null];
	if (numbers == null) return null;

	// Parse each part of the version string.
	const parts = numbers.split('.').map((n) => parseInt(n, 10));
	if (parts.find(isNaN) !== undefined) return null;

	// If all of it was parsed successfully, return it.
	return parts;
}

/**
 * Compares two version arrays.
 *
 * @param a The first version.
 * @param b The second version.
 * @returns `-`1 if the first version is lower, `0` if both are equal, or `1` if the first version is higher.
 */
export function compareVersion(a: Version, b: Version): -1 | 0 | 1 {
	const length = Math.max(a.length, b.length);
	const aPadded = arrayPadEnd(a, length, 0);
	const bPadded = arrayPadEnd(b, length, 0);

	for (let i = 0; i < length; i++) {
		const delta = aPadded[i] - bPadded[i];
		if (delta !== 0) return Math.sign(delta) as -1 | 0 | 1;
	}

	return 0;
}
