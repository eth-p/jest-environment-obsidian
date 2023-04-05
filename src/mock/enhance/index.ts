import EnvironmentOptions from '../../environment-options';
import { extendType } from '../../util';

import Array from './Array';
import Element from './Element';
import Math from './Math';
import Node from './Node';
import Number from './Number';
import String from './String';

export function patch(globals: any, options: EnvironmentOptions) {
	extendType(globals.Array, Array(globals, options));
	extendType(globals.Math, Math(globals, options));
	extendType(globals.String, String(globals, options));
	extendType(globals.Number, Number(globals, options));
	extendType(globals.Node, Node(globals, options));
	extendType(globals.Element, Element(globals, options));
}
