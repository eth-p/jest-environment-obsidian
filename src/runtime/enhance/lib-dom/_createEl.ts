import { __WARNING__, getCallerName } from '#runtime';

/**
 * Reimplementation of Obsidian's createEl function.
 *
 * @param context The environment context.
 * @param tag The tag to create.
 * @param info The element info, or if it's a string, the classname.
 * @param callback A callback function.
 * @returns The created element.
 */
export function _createEl<K extends keyof HTMLElementTagNameMap>(
	tag: K,
	info?: DomElementInfo | string,
	callback?: (el: HTMLElementTagNameMap[K]) => void,
): HTMLElementTagNameMap[K] {
	const el = document.createElement(tag) as HTMLElementTagNameMap[K];
	const opts = infoFrom(info);

	doSetClass(el, opts.cls);
	doSetText(el, opts.text);
	doSetAttributes(el, opts.attr);
	doSetTitle(el, opts.title);
	doSetValue(el, opts.value);
	doSetType(el, opts.type);
	doSetPlaceholder(el, opts.placeholder);
	doSetHref(el, opts.href);

	return finalize(el, opts, callback);
}

/**
 * Reimplementation of Obsidian's createSvg function.
 *
 * @param context The environment context.
 * @param tag The tag to create.
 * @param info The element info, or if it's a string, the classname.
 * @param callback A callback function.
 * @returns The created element.
 */
export function _createSvg<K extends keyof SVGElementTagNameMap>(
	tag: K,
	info?: SvgElementInfo | string,
	callback?: (el: SVGElementTagNameMap[K]) => void,
): SVGElementTagNameMap[K] {
	const el = document.createElementNS('http://www.w3.org/2000/svg', tag) as SVGElementTagNameMap[K];
	const opts = infoFrom(info);

	doSetClass(el, opts.cls);
	doSetAttributes(el, opts.attr);

	return finalize(el, opts, callback);
}

export function infoFrom<I extends DomElementInfo | SvgElementInfo>(info: I | string | undefined): I {
	if (info == null) return {} as I;
	if (typeof info === 'string') return { cls: info } as I;
	return info;
}

export function doSetClass(el: HTMLElement | SVGElement, cls: (DomElementInfo | SvgElementInfo)['cls']): void {
	if (cls === undefined) return;
	const classes = typeof cls === 'string' ? [cls] : cls;

	for (const className of classes) {
		if (className.includes(' ')) {
			__WARNING__('IllegalCssClassName', getCallerName(), 'cls', className);
		}
	}

	el.classList.add(...classes);
}

export function doSetText(el: HTMLElement, text: DomElementInfo['text']): void {
	if (text == null) return;
	el.setText(text);
}

export function doSetAttributes(el: HTMLElement | SVGElement, attr: (DomElementInfo | SvgElementInfo)['attr']): void {
	if (attr == null) return;
	el.setAttrs(attr);
}

export function doSetTitle(el: HTMLElement, title: DomElementInfo['title']): void {
	if (title == null) return;
	el.title = title;
}

export function doSetValue(el: HTMLElement, value: DomElementInfo['value']): boolean {
	if (value == null) return false;

	if (el instanceof HTMLSelectElement || el instanceof HTMLInputElement || el instanceof HTMLOptionElement) {
		el.value = value;
		return true;
	}

	return false;
}

export function doSetType(el: HTMLElement, type: DomElementInfo['type']): boolean {
	if (type == null) return false;

	if (el instanceof HTMLInputElement) {
		el.type = type;
		return true;
	}

	if (el instanceof HTMLStyleElement) {
		el.setAttribute('type', type);
		return true;
	}

	return false;
}

export function doSetPlaceholder(el: HTMLElement, placeholder: DomElementInfo['placeholder']): boolean {
	if (placeholder == null) return false;

	if (el instanceof HTMLInputElement) {
		el.placeholder = placeholder;
		return true;
	}

	return false;
}

export function doSetHref(el: HTMLElement, href: DomElementInfo['href']): boolean {
	if (href == null) return false;

	if (el instanceof HTMLBaseElement || el instanceof HTMLAnchorElement || el instanceof HTMLLinkElement) {
		el.href = href;
		return true;
	}

	return false;
}

export function finalize<T extends HTMLElement | SVGElement>(
	el: T,
	info: DomElementInfo | SvgElementInfo,
	callback?: (el: T) => void,
): T {
	if (callback) {
		callback(el);
	}

	// If a parent is provided, insert it.
	const parent = info.parent;
	if (parent != null) {
		if (info.prepend) {
			parent.insertBefore(el, parent.firstChild);
		} else {
			parent.appendChild(el);
		}
	}

	// Return the element.
	return el;
}
