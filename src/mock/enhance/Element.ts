// From Obsidian Type Definitions:
// Version 1.1.1
//
//     interface Element extends Node {
//         getText(): string;
//         setText(val: string | DocumentFragment): void;
//         addClass(...classes: string[]): void;
//         addClasses(classes: string[]): void;
//         removeClass(...classes: string[]): void;
//         removeClasses(classes: string[]): void;
//         toggleClass(classes: string | string[], value: boolean): void;
//         hasClass(cls: string): boolean;
//         setAttr(qualifiedName: string, value: string | number | boolean | null): void;
//         setAttrs(obj: {
//             [key: string]: string | number | boolean | null;
//         }): void;
//         getAttr(qualifiedName: string): string | null;
//         matchParent(selector: string, lastParent?: Element): Element | null;
//         getCssPropertyValue(property: string, pseudoElement?: string): string;
//         isActiveElement(): boolean;
//     }
//
import EnvironmentOptions from '../../environment-options';
import { __UNIMPLEMENTED__ } from '../../util';

import { empty } from './Node';

export default function createExtension(globalThis: typeof global, options: EnvironmentOptions) {
	return class extends globalThis.Element {
		getText(): string {
			return this.textContent ?? '';
		}

		setText(val: string | DocumentFragment): void {
			if (typeof val === 'string') {
				this.textContent = val;
				return;
			}

			empty(this);
			this.appendChild(val);
		}

		addClass(...classes: string[]): void {
			this.classList.add(...classes);
		}

		addClasses(classes: string[]): void {
			this.classList.add(...classes);
		}

		removeClass(...classes: string[]): void {
			this.classList.remove(...classes);
		}

		removeClasses(classes: string[]): void {
			this.classList.remove(...classes);
		}

		toggleClass(classes: string | string[], value: boolean): void {
			if (typeof classes === 'string') {
				this.classList.toggle(classes, value);
				return;
			}

			for (const cls of classes) {
				this.classList.toggle(cls, value);
			}
		}

		hasClass(cls: string): boolean {
			return this.classList.contains(cls);
		}

		setAttr(qualifiedName: string, value: string | number | boolean | null): void {
			if (value === null) {
				this.removeAttribute(qualifiedName);
				return;
			}

			this.setAttribute(qualifiedName, `${value}`);
		}

		setAttrs(obj: { [key: string]: string | number | boolean | null }): void {
			Object.entries(obj).forEach(([name, value]) => this.setAttr(name, value));
		}

		getAttr(qualifiedName: string): string | null {
			return this.getAttribute(qualifiedName);
		}

		matchParent(selector: string, lastParent?: Element): Element | null {
			__UNIMPLEMENTED__();
		}

		getCssPropertyValue(property: string, pseudoElement?: string): string {
			__UNIMPLEMENTED__();
		}

		isActiveElement(): boolean {
			__UNIMPLEMENTED__();
		}
	};
}
