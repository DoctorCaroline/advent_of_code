import * as utils from "../../AdventOfCodeUtils";
import { IntcodeRuntime } from "./Intcode";

/** Day 19 Solution */
export function solution(rawInput: string[]): utils.Solution {
	const program = rawInput[0].split(",").map(n => +n);
	const intcoder = new IntcodeRuntime();
	let total = 0;
	for (let x = 0; x < 50; x++) {
		for (let y = 0; y < 50; y++) {
			total += intcoder.run(program, [x, y])[0];
		}
	}
	return [total];
}