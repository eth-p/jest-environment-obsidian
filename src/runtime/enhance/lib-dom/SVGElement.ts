// From Obsidian Type Definitions:
// Version 1.1.1
//
//     interface SVGElement extends Element {
//         setCssStyles(styles: Partial<CSSStyleDeclaration>): void;
//         setCssProps(props: Record<string, string>): void;
//     }
//
import { _setCssProps, _setCssStyles } from './HTMLElement';

SVGElement.prototype.setCssStyles = function setCssStyles(styles: Partial<CSSStyleDeclaration>): void {
	const modifiedStyles: Record<string, any> = { ...styles };
	assignUnits(this.style, modifiedStyles);
	_setCssStyles(this, modifiedStyles);
};

SVGElement.prototype.setCssProps = function setCssProps(props: Record<string, string>): void {
	const modifiedProps = { ...props };
	assignUnits(this.style, modifiedProps);
	_setCssProps(this, modifiedProps);
};

function assignUnits(decl: CSSStyleDeclaration, stylesOrProps: Record<string, any>) {
	for (const [key, value] of Object.entries(stylesOrProps)) {
		if (key in decl && typeof value === 'number') {
			stylesOrProps[key] = `${value}px`;
		}
	}
}
