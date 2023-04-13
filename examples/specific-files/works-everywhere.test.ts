import { test } from '@jest/globals';

import sayHello from './works-everywhere';

test('sayHello says hello', () => {
	expect(sayHello("world")).toBe("Hello, world!");
});

test('obsidian environment is not available', () => {
	expect(import("obsidian")).rejects.toThrow();
	expect(() => eval("HTMLElement")).toThrow();
});
