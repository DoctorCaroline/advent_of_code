import * as utils from "../../AdventOfCodeUtils";

/** Day 2 Solution */
export function solution(rawInput: string[]): utils.Solution {
	const ranges = rawInput[0].split(",").map(range => range.split("-").map(n => +n));
	const out = [0, 0];

	for (const range of ranges) {
		for (let n = range[0]; n <= range[1]; n++) {
			const numString = n + "";
			const length = numString.length;
			for (let sublength = Math.floor(length / 2); sublength > 0; sublength--) {
				const substring = numString.substring(0, sublength);
				let repeat = "";
				while (repeat.length < numString.length) { repeat += substring; }
				if (repeat === numString) {
					out[0] += n * +(length === 2 * sublength)
					out[1] += n;
					break;
				}
			}
		}
	}

	return out;
}