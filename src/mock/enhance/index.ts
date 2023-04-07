import EnvironmentOptions from '../../environment-options';
import { extendType } from '../../util';

import Array from './Array';
import Element from './Element';
import HTMLElement from './HTMLElement';
import Math from './Math';
import Node from './Node';
import Number from './Number';
import SVGElement from './SVGElement';
import String from './String';
import global from './global';

export function patch(globals: any, options: EnvironmentOptions) {
	extendType(globals.Array, Array(globals, options));
	extendType(globals.Math, Math(globals, options));
	extendType(globals.String, String(globals, options));
	extendType(globals.Number, Number(globals, options));
	extendType(globals.Node, Node(globals, options));
	extendType(globals.Element, Element(globals, options));
	extendType(globals.HTMLElement, HTMLElement(globals, options));
	extendType(globals.SVGElement, SVGElement(globals, options));

	extendType(globals, global(globals, options));
}
