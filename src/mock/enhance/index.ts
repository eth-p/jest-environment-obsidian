import EnvironmentOptions from '../../environment-options';
import { extendType } from '../../util';

import domGlobal from './lib-dom/global';
import Element from './lib-dom/Element';
import HTMLElement from './lib-dom/HTMLElement';
import Node from './lib-dom/Node';
import SVGElement from './lib-dom/SVGElement';
import Array from './lib-ecmascript/Array';
import Math from './lib-ecmascript/Math';
import Number from './lib-ecmascript/Number';
import String from './lib-ecmascript/String';

export function patch(globals: any, options: EnvironmentOptions) {
	// EMCAScript Extensions
	extendType(globals.Array, Array(globals, options));
	extendType(globals.Math, Math(globals, options));
	extendType(globals.String, String(globals, options));
	extendType(globals.Number, Number(globals, options));

	// DOM Extensions
	extendType(globals.Node, Node(globals, options));
	extendType(globals.Element, Element(globals, options));
	extendType(globals.HTMLElement, HTMLElement(globals, options));
	extendType(globals.SVGElement, SVGElement(globals, options));
	extendType(globals, domGlobal(globals, options));
}
