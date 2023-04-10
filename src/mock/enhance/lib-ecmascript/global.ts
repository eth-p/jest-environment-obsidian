// From Obsidian Type Definitions:
// Version 1.1.1
//
//     function isBoolean(obj: any): obj is boolean;
//     function fish(selector: string): HTMLElement | null;
//     function fishAll(selector: string): HTMLElement[];
//
import type { Globals } from '#context';
import type EnvironmentOptions from '#options';

export default function createExtension(context: Globals, options: EnvironmentOptions) {
	const global = function () {} as unknown as { new (): any };
	global.prototype = context;

	return class extends global {
		static isBoolean(obj: any): obj is boolean {
			return typeof obj === 'boolean';
		}

		static fish(selector: string): HTMLElement | null {
			return context.document.querySelector(selector);
		}

		static fishAll(selector: string): HTMLElement[] {
			return Array.from(context.document.querySelectorAll(selector));
		}
	};
}
