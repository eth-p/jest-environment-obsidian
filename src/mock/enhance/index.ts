import patchArray from "./Array";

export function patch(globals: any) {
	patchArray(globals.Array);
}
