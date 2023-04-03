import patchArray from "./Array";
import patchMath from "./Math";
import patchString from "./String";

export function patch(globals: any) {
	patchArray(globals.Array);
	patchMath(globals.Math);
	patchString(globals.String);
}
