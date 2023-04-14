/**
 * @jest-environment  #meta-test/internal
 * @jest-environment-options {"missingExports": "warning"}
 * @obsidian-jest-ignore missing-export-stub
 */
import { getEnvironment } from '#runtime';

import { expect, test } from '@jest/globals';

test('nonexistent export warnings', async () => {
	const obsidian = await import('obsidian');
	expect((obsidian as any)['__NONEXISTENT_PROPERTY__']).toBeUndefined();
	expect(getEnvironment().warnings.count).toBe(1);
});
