// From Obsidian Type Definitions:
// Version 1.1.1
//
//     interface ObjectConstructor {
//         isEmpty(object: Record<string, any>): boolean;
//         each<T>(object: {
//             [key: string]: T;
//         }, callback: (value: T, key?: string) => boolean | void, context?: any): boolean;
//     }
//

Object.isEmpty = function isEmpty(obj: Record<string, any>): boolean {
	return Object.entries(obj).length === 0;
};

Object.each = function each<T>(
	obj: Record<string, T>,
	cb: (value: T, key?: string) => boolean | void,
	context?: any,
): boolean {
	for (const [key, val] of Object.entries(obj)) {
		if (cb.call(context, val, key) === false) {
			return false;
		}
	}

	return true;
};
