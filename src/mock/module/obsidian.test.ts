/**
 * @jest-environment <rootDir>/src/environment.ts
 * @obsidian-version 99.99.99
 */
import { apiVersion } from 'obsidian';

import { expect, test } from '@jest/globals';

test('apiVersion is configurable', async () => {
	expect(apiVersion).toBe('99.99.99');
});
