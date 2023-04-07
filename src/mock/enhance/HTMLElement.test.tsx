/**
 * @jest-environment <rootDir>/src/environment.ts
 *
 * @obsidian-conformance strict
 * @obsidian-jest-ignore node-must-be-within-document
 * @obsidian-jest-ignore set-css-styles-does-not-set-unknown-properties
 * @obsidian-jest-ignore set-css-styles-does-not-set-variables
 */
import 'obsidian';

import { beforeEach, describe, expect, test } from '@jest/globals';

import { withElementInDocument } from '../../testutil/utils';

describe('hide', () => {
	let el!: HTMLDivElement;
	beforeEach(() => {
		el = <div />;
	});

	test('element', () => {
		el.hide();
		expect(el.style.getPropertyValue('display')).toBe('none');
		expect(el.getAttribute('data-display')).toBeNull();
	});

	test('element with display', () => {
		el.style.setProperty('display', 'flex');

		el.hide();
		expect(el.style.getPropertyValue('display')).toBe('none');
		expect(el.getAttribute('data-display')).toBe('flex');
	});
});

describe('show', () => {
	let el!: HTMLDivElement;
	beforeEach(() => {
		el = <div />;
	});

	test('element that was hidden', () => {
		el.hide();

		el.show();
		expect(el.style.getPropertyValue('display')).toBe('');
		expect(el.getAttribute('data-display')).toBeNull();
	});

	test('element that is visible', () => {
		el.show();
		expect(el.style.getPropertyValue('display')).toBe('');
		expect(el.getAttribute('data-display')).toBeNull();
	});

	test('element that has display style', () => {
		el.style.setProperty('display', 'flex');

		// Should not overwrite display.
		el.show();
		expect(el.style.getPropertyValue('display')).toBe('flex');
		expect(el.getAttribute('data-display')).toBeNull();
	});

	test('element that has display style and data-display', () => {
		el.style.setProperty('display', 'flex');
		el.setAttribute('data-display', 'grid');

		// Should not overwrite display.
		el.show();
		expect(el.style.getPropertyValue('display')).toBe('flex');
		expect(el.getAttribute('data-display')).toBe('grid');
	});

	test('element that has display style and was hidden', () => {
		el.style.setProperty('display', 'flex');
		el.hide();

		// Should remove data-display after being used.
		el.show();
		expect(el.style.getPropertyValue('display')).toBe('flex');
		expect(el.getAttribute('data-display')).toBeNull();
	});
});

describe('toggle', () => {
	test('false', () => {
		const el: HTMLDivElement = <div />;
		el.toggle(false);
		expect(el.style.getPropertyValue('display')).toBe('none');
	});

	test('true', () => {
		const el: HTMLDivElement = <div style="display: none" />;
		el.toggle(true);
		expect(el.style.getPropertyValue('display')).toBe('');
	});
});

describe('toggleVisibility', () => {
	let el!: HTMLDivElement;
	beforeEach(() => {
		el = <div />;
	});

	test('false', () => {
		el.toggleVisibility(false);
		expect(el.style.getPropertyValue('visibility')).toBe('hidden');
	});

	test('true', () => {
		el.style.setProperty('visibility', 'hidden');
		el.toggleVisibility(true);
		expect(el.style.getPropertyValue('visibility')).toBe('');
	});
});

describe('isShown', () => {
	test('element has display none', () => {
		withElementInDocument(<div style="display: none" />, (el) => {
			expect(el.isShown()).toBe(false);
		});
	});

	test('element parent has display none', () => {
		const el: HTMLElement = (
			<div style="display: none">
				<div id="target" />
			</div>
		);

		withElementInDocument(el, () => {
			const target = el.querySelector('#target')! as HTMLElement;
			expect(target.isShown()).toBe(false);
		});
	});

	test('element parents are visible', () => {
		const el: HTMLElement = (
			<div>
				<div id="target" />
			</div>
		);

		withElementInDocument(el, () => {
			const target = el.querySelector('#target')! as HTMLElement;
			expect(target.isShown()).toBe(true);
		});
	});

	test('special case, false when position fixed', () => {
		const el: HTMLElement = (
			<div>
				<div id="target" style="position: fixed" />
			</div>
		);

		withElementInDocument(el, () => {
			const target = el.querySelector('#target')! as HTMLElement;
			expect(target.isShown()).toBe(false);
		});
	});

	test('special case, false when body element', () => {
		const target = document.body as HTMLBodyElement;
		expect(target.isShown()).toBe(false);
	});

	test('special case, false when html element', () => {
		const el = document.body.parentElement as HTMLHtmlElement;
		expect(el.isShown()).toBe(false);
	});

	test('strict conformance, false when not within document', () => {
		const el: HTMLElement = (
			<div>
				<div id="target" />
			</div>
		);

		const target = el.querySelector('#target')! as HTMLElement;
		expect(target.isShown()).toBe(false);
	});
});

describe('setCssStyles', () => {
	let el!: HTMLDivElement;
	beforeEach(() => {
		el = <div />;
	});

	test('not a string', () => {
		// @ts-expect-error -- TypeScript doesn't pick up on this type definition for some reason.
		el.setCssStyles({
			width: 3,
		});

		expect(el.style.width).toBe('');
	});

	test('not a valid property', () => {
		// @ts-expect-error -- TypeScript doesn't pick up on this type definition for some reason.
		el.setCssStyles({
			'-not-valid': '1em',
		});

		expect(el.style.width).toBe('');
		expect((el.style as unknown as Record<string, string>)['-not-valid']).toBe('1em');
		expect(el.style.getPropertyValue('-not-valid')).toBe('');
	});

	test('is a css variable property', () => {
		// @ts-expect-error -- TypeScript doesn't pick up on this type definition for some reason.
		el.setCssStyles({
			'--my-var': '1em',
		});

		expect(el.style.width).toBe('');
		expect((el.style as unknown as Record<string, string>)['--my-var']).toBe('1em');
		expect(el.style.getPropertyValue('--my-var')).toBe('');
	});

	test('valid properties', () => {
		// @ts-expect-error -- TypeScript doesn't pick up on this type definition for some reason.
		el.setCssStyles({
			width: '3px',
			height: '6px',
		});

		expect(el.style.width).toBe('3px');
		expect(el.style.height).toBe('6px');
	});
});

describe('setCssProps', () => {
	let el!: HTMLDivElement;
	beforeEach(() => {
		el = <div />;
	});

	test('not a string', () => {
		// @ts-expect-error -- TypeScript doesn't pick up on this type definition for some reason.
		el.setCssProps({
			width: 3,
		});

		expect(el.style.width).toBe('');
	});

	test('not a valid property', () => {
		// @ts-expect-error -- TypeScript doesn't pick up on this type definition for some reason.
		el.setCssProps({
			'-not-valid': '1em',
		});

		expect(el.style.width).toBe('');
		expect((el.style as unknown as Record<string, string>)['-not-valid']).toBe(undefined);
		expect(el.style.getPropertyValue('-not-valid')).toBe('');
	});

	test('valid properties', () => {
		// @ts-expect-error -- TypeScript doesn't pick up on this type definition for some reason.
		el.setCssProps({
			width: '3px',
			height: '6px',
		});

		expect(el.style.width).toBe('3px');
		expect(el.style.height).toBe('6px');
	});
});
