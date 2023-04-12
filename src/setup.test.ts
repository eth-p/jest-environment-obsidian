/**
 * @jest-environment  #meta-test/internal
 */
import { expect, test } from '@jest/globals';

test('obsidian module resolves to shim', async () => {
	await expect(() => import('obsidian')).not.toThrow();
});

test('obsidian global extensions are applied', async () => {
	await expect(() => eval('createEl')).not.toThrow();
});

test('obsidian prototype extensions are applied', async () => {
	await expect(typeof HTMLElement.prototype.createEl).toBe('function');
});
