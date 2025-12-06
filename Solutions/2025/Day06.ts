import * as utils from "../../AdventOfCodeUtils";

/** Day 6 Solution */
export function solution(rawInput: string[]): utils.Solution {
	const out = [0, 0];
	
	// Part 1: Reading digits left to right
	const rows = rawInput.map(row => row.split(" ").filter(Boolean));
	const ops = rows.pop()!;

	for (let col = 0; col < rows[0].length; col++) {
		const op: IteratedBinaryOperator = ops[col] === "*" ? utils._product : utils._sum;
		const values = rows.map(row => +row[col]);
		out[0] += op(values);
	}

	// Part 2: Reading digits top to bottom
	let vals: number[] = [];
	let op: IteratedBinaryOperator | null = null;

	for (let col = 0; col < rawInput[0].length; col++) {
		const valueArr = rawInput.map(row => row[col]).filter(char => char !== " ");
		if (!valueArr.length) {
			out[1] += op!(vals);
			vals.length = 0;
			op = null;
			continue;
		}
		if (isNaN(+valueArr[valueArr.length - 1])) {
			op = valueArr.pop() === "*" ? utils._product : utils._sum;
		}
		vals.push(+valueArr.join(""));
	}
	out[1] += op!(vals); // Flush remaining values

	return out;
}

type IteratedBinaryOperator = (values: number[]) => number;