import { normalize } from 'node:path';

export function normalizePath(path: string): string {
	// TODO: Verify against Obsidian.
	return normalize(path);
}
