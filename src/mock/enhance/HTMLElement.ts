// From Obsidian Type Definitions:
// Version 1.1.1
//
//     interface HTMLElement extends Element {
//         show(): void;
//         hide(): void;
//         toggle(show: boolean): void;
//         toggleVisibility(visible: boolean): void;
//         isShown(): boolean;
//         setCssStyles(styles: Partial<CSSStyleDeclaration>): void;
//         setCssProps(props: Record<string, string>): void;
//         readonly innerWidth: number;
//         readonly innerHeight: number;
//     }
//
import EnvironmentOptions from '../../environment-options';
import { __UNIMPLEMENTED__ } from '../../util';
import { printWarning } from '../../warnings';

export default function createExtension(globalThis: typeof global, options: EnvironmentOptions) {
	return class extends globalThis.HTMLElement {
		show(): void {
			if (this.style.getPropertyValue('display') !== 'none') {
				return;
			}

			// If there was a display property before hiding, put it back.
			const oldDisplay = this.getAttribute('data-display');
			if (oldDisplay !== null) {
				this.removeAttribute('data-display');
				this.style.setProperty('display', oldDisplay);
				return;
			}

			// If there wasn't a display property before, remove it.
			this.style.removeProperty('display');
		}

		hide(): void {
			const oldDisplay = this.style.getPropertyValue('display');
			if (oldDisplay !== '') {
				this.setAttribute('data-display', oldDisplay);
			}

			this.style.setProperty('display', 'none');
		}

		toggle(show: boolean): void {
			if (show) {
				this.show();
			} else {
				this.hide();
			}
		}

		toggleVisibility(visible: boolean): void {
			if (visible) {
				this.style.removeProperty('visibility');
			} else {
				this.style.setProperty('visibility', 'hidden');
			}
		}

		isShown(): boolean {
			// Strict conformance.
			if (options.conformance === 'strict') {
				if (!globalThis.document.contains(this)) {
					printWarning(
						globalThis,
						options,
						'node-must-be-within-document',
						'HTMLElement.prototype.isShown',
						"Under strict conformance, this function will always return false when that happens.",
					);
					return false;
				}
			}

			// Special cases.
			if (this instanceof globalThis.HTMLHtmlElement) return false;
			if (this instanceof globalThis.HTMLBodyElement) return false;

			const styles = globalThis.window.getComputedStyle(this);
			let position = styles.getPropertyValue('position');
			if (position === '') position = this.style.getPropertyValue('position');
			if (position === 'fixed') return false;

			// Walk upwards, checking.
			for (let target: Element | null = this; target != null; target = target.parentElement) {
				if (!(target instanceof globalThis.HTMLElement)) continue;

				const styles = globalThis.window.getComputedStyle(target);
				let display = styles.getPropertyValue('display');
				if (display === '') display = this.style.getPropertyValue('display');
				if (display === 'none') return false;
			}

			return true;
		}

		setCssStyles(styles: Partial<CSSStyleDeclaration>): void {
			for (const [key, value] of Object.entries(styles)) {
				(this.style as Record<string, any>)[key] = value;
			}
		}

		setCssProps(props: Record<string, string>): void {
			for (const [key, value] of Object.entries(props)) {
				this.style.setProperty(key, value);
			}
		}

		get innerWidth(): number {
			__UNIMPLEMENTED__();
			return 0;
		}

		get innerHeight(): number {
			__UNIMPLEMENTED__();
			return 0;
		}
	};
}