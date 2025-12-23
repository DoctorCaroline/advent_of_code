import * as utils from "../../AdventOfCodeUtils";
import { IntcodeRuntime } from "./Intcode";

/** Day 5 Solution */
export function solution(rawProgram: string[]): utils.Solution {
	const program = rawProgram[0].split(",").map(n => +n);
	const intcoder = new IntcodeRuntime();
	return [1, 5].map(input => intcoder.run(program, [input]).filter(Boolean)[0]);
}