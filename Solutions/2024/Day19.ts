import * as utils from "../../AdventOfCodeUtils";

/** Day 19 Solution */
export function solution(rawInput: string[]): utils.Solution {

	const
		available = rawInput[0].split(", "),
		designs = rawInput.slice(2);

	const waysToMakeMemo: utils.StringKeyedObject<number> = {};
	const waysToMake = (design: string) => {
		if (design === "") { return 1; }
		if (waysToMakeMemo[design] !== undefined) { return waysToMakeMemo[design]; }
		waysToMakeMemo[design] = 0;

		for (const next of available) {
			if (next.length > design.length || design.substring(0, next.length) !== next) { continue; }
			waysToMakeMemo[design] += waysToMake(design.substring(next.length));
			
		}
		return waysToMakeMemo[design];
	};

	const counts = [0, 0];
	for (const design of designs) {
		const ways = waysToMake(design);
		counts[0] += +!!ways;
		counts[1] += ways
	}
	
	return counts;
}