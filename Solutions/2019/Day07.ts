import * as utils from "../../AdventOfCodeUtils";
import { IntcodeMachineState, IntcodeRuntime } from "./Intcode";

/** Day 7 Solution */
export function solution(rawInput: string[]): utils.Solution {
	const program = rawInput[0].split(",").map(n => +n);
	const intcoder = new IntcodeRuntime();
	const execute = (sequence: number[]) => {
		let output = 0;
		while (sequence.length) {
			const phase = sequence.shift()!;
			output = intcoder.run(program, [phase, output])[0];
		}
		return output;
	};
	
	const advancedExecute = (sequence: number[]) => {
		let output = 0;
		const start: Partial<IntcodeMachineState> = { continuousInput: true };
		const states = sequence.map(phase => { return { ...start, input: [phase] }; });
		while (true) {
			for (const state of states) {
				state.input.push(output);
				output = intcoder.run(program, undefined, state).shift()!;
			}
			if (states[4].done) { return output; }
		}
	}
	
	const maxes = [0, 0];
	
	const dfs = (sequence: number[]) => {
		if (sequence.length === 5) {
			maxes[0] = Math.max(maxes[0], execute([...sequence]));
			maxes[1] = Math.max(maxes[1], advancedExecute(sequence.map(phase => phase + 5)));
			return;
		}
		for (const n of [0, 1, 2, 3, 4]) {
			if (sequence.indexOf(n) === -1) {
				dfs([...sequence, n]);
			}
		}
	}
	
	dfs([]);
	
	return maxes;
}