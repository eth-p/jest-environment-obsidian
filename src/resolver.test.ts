/**
 * @jest-environment <rootDir>/src/environment.ts
 */
import { expect, test } from '@jest/globals';

test('obsidian module is mocked', async () => {
	await expect(() => import('obsidian')).not.toThrow();
});
