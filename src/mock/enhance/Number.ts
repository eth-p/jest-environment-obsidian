// From Obsidian Type Definitions:
// Version 1.1.1
//
//     interface NumberConstructor {
//         isNumber(obj: any): obj is number;
//     }
//
export default function patch(ctor: NumberConstructor) {
	Object.assign(ctor, {
		//

		isNumber(obj: any): obj is number {
			return typeof obj === 'number';
		},

		//
	});
}
