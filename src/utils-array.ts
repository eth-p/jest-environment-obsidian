/**
 * Creates a right-padded copy of an array.
 *
 * @param arr The array to copy.
 * @param length The length of the array to pad to.
 * @param fill The values to pad with.
 *
 * @returns The padded copy.
 */
export function arrayPadEnd<T, L extends number>(arr: T[], length: L, fill: T): T[] & { length: L } {
	const padded = new Array(length).fill(fill);
	padded.splice(0, arr.length, ...arr);
	return padded as T[] & { length: L };
}
