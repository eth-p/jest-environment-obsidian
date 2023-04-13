/**
 * @jest-environment jest-environment-obsidian
 */
import { test } from '@jest/globals';

import { createBox } from './something';

test('createBox creates title', () => {
	const box = createBox('my title', 'my contents');

	expect(box.querySelector('.title')).not.toBeNull();
	expect(box.querySelector('.title')?.textContent).toBe('my title');
});

test('createBox says hello', () => {
	const box = createBox('my title', 'my contents');

	expect(box.querySelector('.title')).not.toBeNull();
	expect(box.textContent?.includes("Hello")).toBe(true);
});
