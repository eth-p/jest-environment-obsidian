/**
 * @jest-environment  #meta-test/validation
 */
import { expect, test, jest } from '@jest/globals';

import { BaseComponent } from 'obsidian';

class BaseComponentSubclass extends BaseComponent {}

test('disabled defaults to false', () => {
	const instance = new BaseComponentSubclass();
	expect(instance.disabled).toBe(false);
});

test('setDisabled', () => {
	const instance = new BaseComponentSubclass();

	instance.setDisabled(true);
	expect(instance.disabled).toBe(true);

	instance.setDisabled(false);
	expect(instance.disabled).toBe(false);
});

test('then', () => {
	const instance = new BaseComponentSubclass();
	const cb = jest.fn();

	expect(instance.then(cb)).toBe(instance);
	expect(cb).toBeCalledTimes(1);
	expect(cb).toBeCalledWith(instance);
});
