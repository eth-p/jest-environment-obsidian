/**
 * @jest-environment  #meta-test/internal
 * @jest-environment-options {"missingExports": "error"}
 */
import { expect, test } from '@jest/globals';

test('nonexistent export throws', async () => {
	const obsidian = await import('obsidian');
	await expect(() => (obsidian as any)['__NONEXISTENT_PROPERTY__']).toThrow();
});
