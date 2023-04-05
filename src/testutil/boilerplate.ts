/**
 * Ensures an element exists in the document somewhere, and detaches it after.
 * This may be needed to ensure DOM functions behave correctly.
 *
 * @param element
 */
export function withElementInDocument<T extends HTMLElement>(
	element: T,
	run: (el: T) => void | Promise<void>,
): void | Promise<void> {
	let result: any | Promise<void>;
	const host = document.body;
	host.appendChild(element);

	try {
		result = run(element);
		if (result != null && 'then' in result && typeof result.then === 'function') {
			return result.finally(() => element.remove());
		}
	} finally {
	}

	element.remove();
}
