import * as utils from "../../AdventOfCodeUtils";
import { IntcodeMachineState, IntcodeRuntime } from "./Intcode";

/** Day 17 Solution */
export function solution(rawInput: string[]): utils.Solution {
	const program = rawInput[0].split(",").map(n => +n);
	const runtime = new IntcodeRuntime();
	const state: Partial<IntcodeMachineState> = {};
	runtime.run(program, undefined, state);
	const mapStr = String.fromCharCode(...state.output!);
	const map = mapStr.split("\n").map(line => line.split(""));

	let intersections = 0;

	for (const row in map) {
		for (const col in map) {
			if (map[row][col] !== "#") { continue; }
			if (map[+row + 1]?.[col] !== "#") { continue; }
			if (map[+row - 1]?.[col] !== "#") { continue; }
			if (map[row][+col + 1] !== "#") { continue; }
			if (map[row][+col - 1] !== "#") { continue; }
			intersections += +row * +col;
		}
	}

	return [intersections];
}