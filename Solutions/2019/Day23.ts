import * as utils from "../../AdventOfCodeUtils";
import { IntcodeMachineState, IntcodeRuntime } from "./Intcode";

/** Day 23 Solution */
export function solution(rawInput: string[]): utils.Solution {
	const program = rawInput[0].split(",").map(n => +n);
	const computers: StateMachine[] = [];
	const out: utils.Solution = [];
	let nat: number[] = [];
	let lastNatY: number = NaN;
	
	for (let addr = 0; addr < 50; addr++) {
		const intcoder = new IntcodeRuntime();
		const state: Partial<IntcodeMachineState> = { input: [addr], continuousInput: true };
		intcoder.run(program, undefined, state);
		computers.push({ intcoder, state });
	}

	while (true) {
		let idle = true;
		for (const computer of computers) {
			if (!computer.state.input!.length) {
				computer.state.input!.push(-1);
			}
			computer.intcoder.run(computer.state.program!, undefined, computer.state);
			while (computer.state.output!.length >= 3) {
				idle = false;
				const [addr, x, y] = computer.state.output!.splice(0, 3);
				if (addr === 255) {
					nat = [x, y];
					!out.length && out.push(y);
				}
				if (addr >= 0 && addr < 50) {
					computers[addr].state.input!.push(x, y);
				}
			}
		}
		if (idle) {
			computers[0].state.input!.push(...nat);
			if (lastNatY === nat[1]) {
				out.push(nat[1]);
				return out;
			}
			lastNatY = nat[1];
		}
	}
}

interface StateMachine {
	intcoder: IntcodeRuntime;
	state: Partial<IntcodeMachineState>;
}