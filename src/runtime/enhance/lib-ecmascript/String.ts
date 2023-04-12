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

String.prototype.contains = function contains(target: string) {
	return this.includes(target);
};

String.prototype.format = function format(...args: string[]) {
	// Special case: If any value is strictly `undefined`, it should be replaced with the formatting arg.
	return this.replace(/\{(\d+)\}/g, (match, num) => (args[num] === undefined ? match : `${args[num]}`));
};

String.isString = function isString(obj: any): obj is string {
	return typeof obj === 'string';
};
