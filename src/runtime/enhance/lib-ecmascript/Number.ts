// From Obsidian Type Definitions:
// Version 1.1.1
//
//     interface NumberConstructor {
//         isNumber(obj: any): obj is number;
//     }
//

Number.isNumber = function isNumber(obj: any): obj is number {
	return typeof obj === 'number';
};
