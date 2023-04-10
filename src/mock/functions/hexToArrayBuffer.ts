export function hexToArrayBuffer(hex: string): ArrayBuffer {
	// TODO: Verify against Obsidian.
	const length = hex.length / 2;

	const array = new Uint8Array(length);
	for (let i = 0; i < length; i++) {
		array[i] = parseInt(hex.substring(i * 2, i * 2 + 1), 16);
	}

	return array.buffer;
}
