// From Obsidian Type Definitions:
// Version 1.1.1
//
//     interface NumberConstructor {
//         isNumber(obj: any): obj is number;
//     }
//
import EnvironmentOptions from '#options';

export default function createExtension(globalThis: typeof global, options: EnvironmentOptions) {
	return class extends Number {
		static isNumber(obj: any): obj is number {
			return typeof obj === 'number';
		}
	};
}
