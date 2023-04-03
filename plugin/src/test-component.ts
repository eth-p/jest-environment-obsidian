import { Component } from 'obsidian';

import { Test, TestResult } from './joker-test';

/**
 * A component for showing test results.
 */
export default class TestComponent extends Component {
	public readonly componentEl: HTMLElement;
	public readonly pathEl: HTMLElement;
	public readonly descEl: HTMLElement;
	public readonly summaryEl: HTMLElement;
	public readonly resultsEl: HTMLElement;

	public test: Test;

	public constructor() {
		super();

		const frag = document.createDocumentFragment();
		this.componentEl = frag.createDiv('jest-environment-obsidian-test-component');

		const headerContainer = this.componentEl.createDiv('jest-environment-obsidian-test-component-header');
		const infoContainer = headerContainer.createDiv('jest-environment-obsidian-test-info');
		this.pathEl = infoContainer.createDiv('jest-environment-obsidian-test-path');
		this.descEl = infoContainer.createDiv('jest-environment-obsidian-test-description');

		this.summaryEl = headerContainer.createDiv({
			cls: 'jest-environment-obsidian-test-summary',
			text: '',
		});

		this.resultsEl = this.componentEl.createDiv('jest-environment-obsidian-test-results');
	}

	public setTest(test: Test): typeof this {
		this.test = test;
		return this;
	}

	public setPath(path: string | null | undefined): typeof this {
		this.pathEl.textContent = path ?? '';
		return this;
	}

	public setDesc(desc: string | null | undefined): typeof this {
		this.descEl.textContent = desc ?? '';
		return this;
	}

	public setResult(result: TestResult | null | undefined): typeof this {
		if (result == null) {
			this.summaryEl.textContent = '';
			this.componentEl.setAttribute('data-test-result', 'not-run');
			this.resultsEl.empty();
			return this;
		}

		this.summaryEl.textContent = result.passed ? 'Pass' : 'Fail';
		this.componentEl.setAttribute('data-test-result', result.passed ? 'pass' : 'fail');
		this.resultsEl.empty();

		if (!result.passed && result.error != null) {
			if ('toHTML' in result.error && typeof result.error.toHTML === 'function') {
				this.resultsEl.appendChild(result.error.toHTML());
			} else {
				this.resultsEl.createEl('pre', {
					text: result.error.stack,
				});
			}
		}

		return this;
	}
}
