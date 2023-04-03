// From Obsidian Type Definitions:
// Version 1.1.1
//
//     interface NumberConstructor {
//         isNumber(obj: any): obj is number;
//     }
//

export default function createExtension(globalThis: typeof global) {
	return class extends Number {
		static isNumber(obj: any): obj is number {
			return typeof obj === 'number';
		}
	};
}
