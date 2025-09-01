import { useEffect } from "react";

export type ShortcutItem = {
	shortcuts: string[]; // e.g. ["Ctrl+S", "Meta+S"]
	callback: (event: KeyboardEvent, matchedShortcut: string) => void;
};

/**
 * useKeyboard
 * @param mappings - array of shortcut/callback mappings
 * @param globalCallback - optional callback for ANY matched shortcut
 */
export function useKeyboard(
	mappings: ShortcutItem[],
	globalCallback?: (event: KeyboardEvent, matchedShortcut: string) => void
) {
	useEffect(() => {
		const handler = (event: KeyboardEvent) => {
			for (const { shortcuts, callback } of mappings) {
				for (const shortcut of shortcuts) {
					const keys = shortcut.split("+").map((k) => k.toLowerCase());
					const keySet = new Set(keys);

					const ctrl = event.ctrlKey || event.metaKey; // ctrl or cmd
					const shift = event.shiftKey;
					const alt = event.altKey;
					const mainKey = event.key.toLowerCase();

					// Check modifiers
					if ((keySet.has("ctrl") && !ctrl) || (!keySet.has("ctrl") && ctrl))
						continue;
					if (
						(keySet.has("shift") && !shift) ||
						(!keySet.has("shift") && shift)
					)
						continue;
					if ((keySet.has("alt") && !alt) || (!keySet.has("alt") && alt))
						continue;

					// Remove modifiers
					keySet.delete("ctrl");
					keySet.delete("shift");
					keySet.delete("alt");

					if (keySet.size === 0 || keySet.has(mainKey)) {
						event.preventDefault();
						callback(event, shortcut); // Run item-specific callback
						globalCallback?.(event, shortcut); // Run global callback if exists
						return; // Stop after first match
					}
				}
			}
		};

		window.addEventListener("keydown", handler);
		return () => {
			window.removeEventListener("keydown", handler);
		};
	}, [mappings, globalCallback]);
}
