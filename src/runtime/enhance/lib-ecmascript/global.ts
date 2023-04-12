// From Obsidian Type Definitions:
// Version 1.1.1
//
//     function isBoolean(obj: any): obj is boolean;
//

globalThis.isBoolean = function isBoolean(obj: any): obj is boolean {
	return typeof obj === 'boolean';
};
