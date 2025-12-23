import * as utils from "../../AdventOfCodeUtils";
import { IntcodeRuntime } from "./Intcode";

/** Day 9 Solution */
export function solution(rawInput: string[]): utils.Solution {
	const boost = rawInput[0].split(",").map(n => +n);
	const intcoder = new IntcodeRuntime();
	return [1, 2].map(mode => intcoder.run(boost, [mode])[0]);
}