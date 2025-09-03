import { useEffect } from "react";

export function useDebounceEffect(
	effect: () => void,
	deps: any[],
	delay: number = 0
) {
	useEffect(() => {
		const handler = setTimeout(() => effect(), delay);
		return () => clearTimeout(handler);
	}, [...deps, delay]);
}
