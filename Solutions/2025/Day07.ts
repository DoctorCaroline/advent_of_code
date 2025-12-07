import * as utils from "../../AdventOfCodeUtils";

/** Day 7 Solution */
export function solution(manifold: string[]): utils.Solution {
	let splits = 0;

	const propagateBeam: (row: number, col: number) => number = utils._memo(
		(row: number, col: number) => {
			if (row === manifold.length) { return 1; }

			if (manifold[row + 1]?.[col] === "^") {
				splits++; // Memoization prevents double-counting
				return propagateBeam(row + 1, col - 1) + propagateBeam(row + 1, col + 1);
			}

			return propagateBeam(row + 1, col);
		}
	);

	const timelines = propagateBeam(0, manifold[0].indexOf("S"));
	return [splits, timelines];
}