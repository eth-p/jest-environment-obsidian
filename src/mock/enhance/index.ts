import patchArray from "./Array";
import patchMath from "./Math";

export function patch(globals: any) {
	patchArray(globals.Array);
	patchMath(globals.Math);
}
