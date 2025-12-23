import * as utils from "../../AdventOfCodeUtils";
import { IntcodeRuntime } from "./Intcode";

/** Day 2 Solution */
export function solution(rawProgram: string[]): utils.Solution {
	const program = rawProgram[0].split(",").map(n => +n);
	const intcoder = new IntcodeRuntime();
	
	let noun, verb, result;
	const breakValue = 19690720;
	for (noun = 0; noun < 100; noun++) {
		program[1] = noun;
		for (verb = 0; verb < 100; verb++) {
			program[2] = verb;
			result = intcoder.run(program);
			if (result === breakValue) { break; }
		}
		if (result === breakValue) { break; }
	}
	
	program[1] = 12;
	program[2] = 2;
	return [intcoder.run(program), 100 * noun + verb!];
};