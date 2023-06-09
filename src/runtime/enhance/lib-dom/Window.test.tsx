/**
 * @jest-environment #meta-test/validation
 */
import 'obsidian';

import { expect, test } from '@jest/globals';

test('activeWindow', () => {
	expect(window.activeWindow).toBe(window);
});

test('activeDocument', () => {
	expect(window.activeDocument).toBe(document);
});

test('sleep', async () => {
	let waited = false;
	await window.sleep(2).then(() => (waited = true));
	expect(waited).toBe(true);
});

test('nextFrame', async () => {
	let waited = false;
	await window.nextFrame().then(() => (waited = true));
	expect(waited).toBe(true);
});
