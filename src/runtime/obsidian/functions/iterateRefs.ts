import { ReferenceCache } from 'obsidian';

export function iterateRefs(refs: ReferenceCache[], cb: (ref: ReferenceCache) => boolean | void): boolean {
	// TODO: Verify against Obsidian.
	let result = false;
	for (const ref of refs) {
		if (cb(ref)) result = true;
	}
	return result;
}
