/**
 * @jest-environment <rootDir>/src/environment.ts
 *
 * @obsidian-conformance strict
 */
import { withElementInDocument } from '#testutil/utils';
import 'obsidian';

import { describe, expect, test } from '@jest/globals';

describe('fish', () => {
	test('returns selection', () => {
		const el: HTMLElement = (
			<div>
				<div id="target" />
			</div>
		);

		withElementInDocument(el, () => {
			const target = el.querySelector('#target')! as HTMLElement;
			expect(fish('#target')).toBe(target);
		});
	});

	test('returns null', () => {
		const el: HTMLElement = <div></div>;

		withElementInDocument(el, () => {
			expect(fish('unknown')).toBeNull();
		});
	});
});

describe('fishAll', () => {
	test('returns single', () => {
		const el: HTMLElement = (
			<div>
				<div id="target" />
			</div>
		);

		withElementInDocument(el, () => {
			const target = Array.from(el.querySelectorAll('#target')) as HTMLElement[];
			expect(fishAll('#target')).toStrictEqual(target);
		});
	});

	test('returns multiple', () => {
		const el: HTMLElement = (
			<div>
				<div className="target" />
				<div className="target" />
			</div>
		);

		withElementInDocument(el, () => {
			const target = Array.from(el.querySelectorAll('.target')) as HTMLElement[];
			expect(fishAll('.target')).toStrictEqual(target);
		});
	});

	test('returns empty', () => {
		const el: HTMLElement = <div></div>;

		withElementInDocument(el, () => {
			expect(fishAll('not-a-tag')).toStrictEqual([]);
		});
	});
});

describe('createEl', () => {
	const SHOULD_BE_NULL = 'should-be-null';

	// This suite tests the general implementation of createEl.
	// In particular, this is important for validating against Obsidian's implementation.

	test('calls callback', () => {
		let received: HTMLElement | undefined = undefined;
		const el = createEl('div', undefined, (el) => {
			received = el;
		});

		expect(received).toBe(el);
	});

	test('appends to parent by default', () => {
		const parent = (
			<div>
				<span />
			</div>
		);

		const el = createEl('div', { parent });
		expect(el.parentElement).toBe(parent);
		expect(el.previousElementSibling).not.toBeNull();
	});

	test('appends to parent', () => {
		const parent = (
			<div>
				<span />
			</div>
		);

		const el = createEl('div', { parent, prepend: false });
		expect(el.parentElement).toBe(parent);
		expect(el.previousElementSibling).not.toBeNull();
	});

	test('prepends to parent', () => {
		const parent = (
			<div>
				<span />
			</div>
		);

		const el = createEl('div', { parent, prepend: true });
		expect(el.parentElement).toBe(parent);
		expect(el.previousElementSibling).toBeNull();
	});

	test('adds class if DomElementInfo is string', () => {
		const el = createEl('div', 'foo');
		expect(Array.from(el.classList.values())).toStrictEqual(['foo']);
	});

	test('DomElementInfo baseline', () => {
		// Baseline.
		//
		// Supported:   cls, parent, text, title, attr.
		// Unsupported: value, type, href, placeholder.
		const parent = <div />;
		const el = createEl('div', {
			parent,
			cls: 'test-class',
			text: 'test-text',
			title: 'test-title',
			placeholder: SHOULD_BE_NULL,
			value: SHOULD_BE_NULL,
			type: SHOULD_BE_NULL,
			href: SHOULD_BE_NULL,
			attr: {
				'data-test': 'test-attr',
			},
		});

		// Ensure `parent` works.
		expect(el.parentElement).toBe(parent);

		// Ensure `cls` works.
		expect(Array.from(el.classList.values())).toStrictEqual(['test-class']);

		// Ensure `text` works.
		expect(el.textContent).toBe('test-text');

		// Ensure `title` works.
		expect(el.title).toBe('test-title');
		expect(el.getAttribute('title')).toBe('test-title');

		// Ensure `placeholder` ignored.
		expect('placeholder' in el).toBe(false);
		expect(el.getAttribute('placeholder')).toBeNull();

		// Ensure `value` ignored.
		expect('value' in el).toBe(false);
		expect(el.getAttribute('value')).toBeNull();

		// Ensure `type` ignored.
		expect('type' in el).toBe(false);
		expect(el.getAttribute('type')).toBeNull();

		// Ensure `href` ignored.
		expect('href' in el).toBe(false);
		expect(el.getAttribute('href')).toBeNull();

		// Ensure `attr` works.
		expect(el.getAttribute('data-test')).toBe('test-attr');
	});

	test('DomElementInfo for HTMLInputElement', () => {
		const el = createEl('input', {
			placeholder: 'test-placeholder',
			value: 'test-value',
			type: 'text',
			href: SHOULD_BE_NULL,
		});

		expect(el.getAttribute('href')).toBeNull();

		expect(el.placeholder).toBe('test-placeholder');
		expect(el.getAttribute('placeholder')).toBe('test-placeholder');

		expect(el.value).toBe('test-value');
		expect(el.getAttribute('value')).toBeNull();

		expect(el.type).toBe('text');
		expect(el.getAttribute('type')).toBe('text');
	});

	test('DomElementInfo for HTMLOptionElement', () => {
		const el = createEl('option', {
			placeholder: SHOULD_BE_NULL,
			value: 'test-value',
			type: SHOULD_BE_NULL,
			href: SHOULD_BE_NULL,
		});

		expect(el.getAttribute('placeholder')).toBeNull();
		expect(el.getAttribute('type')).toBeNull();

		expect(el.value).toBe('test-value');
		expect(el.getAttribute('value')).toBe('test-value');
	});

	test('DomElementInfo for HTMLSelectElement', () => {
		const el = createEl('select', {
			placeholder: SHOULD_BE_NULL,
			value: 'test-value',
			type: SHOULD_BE_NULL,
			href: SHOULD_BE_NULL,
		});

		expect(el.getAttribute('href')).toBeNull();
		expect(el.getAttribute('placeholder')).toBeNull();
		expect(el.getAttribute('type')).toBeNull();

		// Compare `value`.
		// NOTE: Even if we set a value, it will be reset to an empty string.
		//       This is because the <select> has no options.
		expect(el.value).toBe('');
		expect(el.getAttribute('value')).toBeNull();
	});

	test('DomElementInfo for HTMLStyleElement', () => {
		const el = createEl('style', {
			placeholder: SHOULD_BE_NULL,
			value: SHOULD_BE_NULL,
			type: 'text/css',
			href: SHOULD_BE_NULL,
		});

		expect(el.getAttribute('value')).toBeNull();
		expect(el.getAttribute('placeholder')).toBeNull();
		expect(el.getAttribute('href')).toBeNull();

		expect(el.getAttribute('type')).toBe('text/css');
	});

	test('DomElementInfo for HTMLLinkElement', () => {
		const el = createEl('link', {
			placeholder: SHOULD_BE_NULL,
			value: SHOULD_BE_NULL,
			type: SHOULD_BE_NULL,
			href: 'about:blank',
		});

		expect(el.getAttribute('value')).toBeNull();
		expect(el.getAttribute('placeholder')).toBeNull();
		expect(el.getAttribute('type')).toBeNull();

		expect(el.href).toBe('about:blank');
		expect(el.getAttribute('href')).toBe('about:blank');
	});

	test('DomElementInfo for HTMLAnchorElement', () => {
		const el = createEl('a', {
			placeholder: SHOULD_BE_NULL,
			value: SHOULD_BE_NULL,
			type: SHOULD_BE_NULL,
			href: 'about:blank',
		});

		expect(el.getAttribute('value')).toBeNull();
		expect(el.getAttribute('placeholder')).toBeNull();
		expect(el.getAttribute('type')).toBeNull();

		expect(el.href).toBe('about:blank');
		expect(el.getAttribute('href')).toBe('about:blank');
	});

	test('DomElementInfo for HTMLBaseElement', () => {
		const el = createEl('base', {
			placeholder: SHOULD_BE_NULL,
			value: SHOULD_BE_NULL,
			type: SHOULD_BE_NULL,
			href: 'about:blank',
		});

		expect(el.getAttribute('value')).toBeNull();
		expect(el.getAttribute('placeholder')).toBeNull();
		expect(el.getAttribute('type')).toBeNull();

		expect(el.href).toBe('about:blank');
		expect(el.getAttribute('href')).toBe('about:blank');
	});
});
