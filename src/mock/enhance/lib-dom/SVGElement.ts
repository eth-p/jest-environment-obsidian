// From Obsidian Type Definitions:
// Version 1.1.1
//
//     interface SVGElement extends Element {
//         setCssStyles(styles: Partial<CSSStyleDeclaration>): void;
//         setCssProps(props: Record<string, string>): void;
//     }
//
import type EnvironmentOptions from '#options';
import { __UNIMPLEMENTED__ } from '#util';
import { __WARNING__ } from '#warnings';

import { setCssProps, setCssStyles } from './HTMLElement';

export default function createExtension(globalThis: typeof global, options: EnvironmentOptions) {
	return class extends globalThis.HTMLElement {
		setCssStyles(styles: Partial<CSSStyleDeclaration>): void {
			const modifiedStyles: Record<string, any> = { ...styles };
			assignUnits(this.style, modifiedStyles);
			setCssStyles(globalThis, this, modifiedStyles);
		}

		setCssProps(props: Record<string, string>): void {
			const modifiedProps = { ...props };
			assignUnits(this.style, modifiedProps);
			setCssProps(this, modifiedProps);
		}
	};
}

function assignUnits(decl: CSSStyleDeclaration, stylesOrProps: Record<string, any>) {
	for (const [key, value] of Object.entries(stylesOrProps)) {
		if (key in decl && typeof value === 'number') {
			stylesOrProps[key] = `${value}px`;
		}
	}
}
