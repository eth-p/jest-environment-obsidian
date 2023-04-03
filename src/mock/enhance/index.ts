import { extendType } from '../../util';

import Array from './Array';
import Math from './Math';
import Number from './Number';
import String from './String';

export function patch(globals: any) {
	extendType(globals.Array, Array(globals));
	extendType(globals.Math, Math(globals));
	extendType(globals.String, String(globals));
	extendType(globals.Number, Number(globals));
}
