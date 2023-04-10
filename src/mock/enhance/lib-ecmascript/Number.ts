// From Obsidian Type Definitions:
// Version 1.1.1
//
//     interface NumberConstructor {
//         isNumber(obj: any): obj is number;
//     }
//
import type { Globals } from '#context';
import EnvironmentOptions from '#options';

export default function createExtension(context: Globals, options: EnvironmentOptions) {
	return class extends Number {
		static isNumber(obj: any): obj is number {
			return typeof obj === 'number';
		}
	};
}
