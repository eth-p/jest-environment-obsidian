// From Obsidian Type Definitions:
// Version 1.1.1
//
//     interface StringConstructor {
//         isString(obj: any): obj is string;
//     }
//
export default function patch(ctor: StringConstructor) {
	Object.assign(ctor, {
		//

		isString(obj: any): obj is string {
			return typeof obj === 'string';
		},

		//
	});
}
