import * as readLine from "node:readline";
import * as utils from "../../AdventOfCodeUtils";
import { IntcodeMachineState, IntcodeRuntime } from "./Intcode";

const __reader = readLine.createInterface({
	input: process.stdin,
	output: process.stdout,
});

/** Day 25 Solution */
export async function solution(rawInput: string[]): Promise<utils.Solution> {
	const program = rawInput[0].split(",").map(n => +n);
	const intcoder = new IntcodeRuntime();
	const state: Partial<IntcodeMachineState> = { continuousInput: true };
	let clear = true;
	while (true) {

		intcoder.run(program, undefined, state);

		clear && console.clear();
		clear = true;
		console.log(String.fromCharCode(...state.output!));
		state.output!.length = 0;

		const { promise, resolve } = utils._makePromise<string>();
		__reader.question("", (answer: string) => { resolve(answer); });
		let command = (await promise).toLowerCase();
		switch (command) {
			case "n": command = "north"; break;
			case "s": command = "south"; break;
			case "e": command = "east"; break;
			case "w": command = "west"; break;
			case "q": command = "quit"; break;
			default: clear = false;
		}
		if (command === "quit") { break; }

		state.input = (command + "\n").split("").map(char => char.charCodeAt(0));
	}

	return [0, 0];
}