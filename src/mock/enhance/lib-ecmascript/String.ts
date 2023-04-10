// From Obsidian Type Definitions:
// Version 1.1.1
//
//     interface String {
//         contains(target: string): boolean;
//         startsWith(searchString: string, position?: number): boolean;
//         endsWith(target: string, length?: number): boolean;
//         format(...args: string[]): string;
//     }
//
//     interface StringConstructor {
//         isString(obj: any): obj is string;
//     }
//
import type { Globals } from '#context';
import type EnvironmentOptions from '#options';

export default function createExtension(context: Globals, options: EnvironmentOptions) {
	return class extends String {
		static isString(obj: any): obj is string {
			return typeof obj === 'string';
		}

		contains(target: string) {
			return this.includes(target);
		}

		format(...args: string[]) {
			// Special case: If any value is strictly `undefined`, it should be replaced with the formatting arg.
			return this.replace(/\{(\d+)\}/g, (match, num) => (args[num] === undefined ? match : `${args[num]}`));
		}

		// --> startsWith is part of ES6
		// --> endsWith is part of ES6
	};
}
