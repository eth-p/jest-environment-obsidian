import sayHello from '$my-module';
import { apiVersion } from 'obsidian';

export function createBox(title: string, contents: string): HTMLElement {
	return createEl('div', {}, (el) => {
		el.createDiv({ cls: 'title', text: title });
		el.createDiv({ cls: 'version', text: apiVersion });
		el.createDiv({ text: sayHello(contents) });
	});
}
