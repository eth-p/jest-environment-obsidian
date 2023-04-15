import { compareVersion, parseVersion } from '#runtime';

import { apiVersion } from '../variables/apiVersion';

export function requireApiVersion(version: string): boolean {
	const current = parseVersion(apiVersion);
	const target = parseVersion(version);
	if (current == null || target == null) return true;

	return compareVersion(current, target) >= 0;
}
