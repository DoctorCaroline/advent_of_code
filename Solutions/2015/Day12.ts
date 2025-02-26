import * as utils from "../../AdventOfCodeUtils";

/** Day 12 Solution */
export function solution(rawInput: string[]): utils.Solution {

	let sums = [0, 0];
	const pojo = rawInput[0];

	// Part 1
	const matches = pojo.matchAll(/-?\d+/g);
	for (const match of matches) { sums[0] += +match[0]; }

	// Part 2
	sums[1] = _evaluate(JSON.parse(pojo));
	
	return sums;
}

function _evaluate(obj: utils.StringKeyedObject<any>): number {
	let sum = 0;
	for (const key in obj) {
		const val = obj[key];
		if (val === "red" && !(obj instanceof Array)) { return 0; }
		else if (val instanceof Object) { sum += _evaluate(val); }
		else if (!isNaN(+val)) { sum += +val; }
	}
	return sum;
}

