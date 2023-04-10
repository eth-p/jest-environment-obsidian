import { Globals } from '#context';
import EnvironmentOptions from '../../environment-options';
import { extendType } from '../../util';

import DocumentFragment from './lib-dom/DocumentFragment';
import Element from './lib-dom/Element';
import HTMLElement from './lib-dom/HTMLElement';
import Node from './lib-dom/Node';
import SVGElement from './lib-dom/SVGElement';
import Window from './lib-dom/Window';
import domGlobal from './lib-dom/global';
import Array from './lib-ecmascript/Array';
import Math from './lib-ecmascript/Math';
import Number from './lib-ecmascript/Number';
import Object from './lib-ecmascript/Object';
import String from './lib-ecmascript/String';
import esGlobal from './lib-ecmascript/global';

export function patch(globals: Globals, options: EnvironmentOptions) {
	// EMCAScript Extensions
	extendType(globals.Array, Array(globals, options));
	extendType(globals.Math, Math(globals, options));
	extendType(globals.String, String(globals, options));
	extendType(globals.Number, Number(globals, options));
	extendType(globals.Object, Object(globals, options));
	extendType(globals, esGlobal(globals, options));

	// DOM Extensions
	extendType(globals.Node, Node(globals, options));
	extendType(globals.DocumentFragment, DocumentFragment(globals, options));
	extendType(globals.Element, Element(globals, options));
	extendType(globals.HTMLElement, HTMLElement(globals, options));
	extendType(globals.SVGElement, SVGElement(globals, options));
	extendType(globals.Window, Window(globals, options));
	extendType(globals, domGlobal(globals, options));
}
