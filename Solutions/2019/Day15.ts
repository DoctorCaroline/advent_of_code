import * as utils from "../../AdventOfCodeUtils";
import { IntcodeMachineState, IntcodeRuntime } from "./Intcode";

/** Day 15 Solution */
export function solution(rawInput: string[]): utils.Solution {
	const initialProgram = rawInput[0].split(",").map(n => +n);
	const initialState: Partial<IntcodeMachineState> = { input: [], continuousInput: true };
	
	const startingSnapshot: IDroidSnapshot = {
		position: "0,0",
		stepsTaken: 0,
		program: JSON.stringify(initialProgram),
		state: JSON.stringify(initialState),
	};

	const oxygenSystem = pathfind(startingSnapshot);
	const out = [oxygenSystem.stepsTaken];
	oxygenSystem.stepsTaken = 0; // Reset for Part 2

	const finalSpace = pathfind(oxygenSystem, true);
	out.push(finalSpace.stepsTaken);

	return out;
}

function pathfind(initialSnapshot: IDroidSnapshot, part2?: boolean): IDroidSnapshot {
	const queue: IDroidSnapshot[] = [initialSnapshot]
	const runtime = new IntcodeRuntime();
	const visited: Set<string> = new Set();

	while (true) {
		const current = queue.shift()!;
		visited.add(current.position);

		const [x, y] = current.position.split(",").map(n => +n);
		const nexts = [
			[x, y - 1],
			[x, y + 1],
			[x - 1, y],
			[x + 1, y],
		];
		
		for (const idx in nexts) {
			const next = nexts[idx];
			const nextPosition = next.join(",");
			if (visited.has(nextPosition)) { continue; } // Already visited
			
			const currentProgram = JSON.parse(current.program) as number[];
			const currentState = JSON.parse(current.state) as Partial<IntcodeMachineState>;
			currentState.input!.push(+idx + 1);

			runtime.run(currentProgram, undefined, currentState);

			const outcome = currentState.output!.pop()!;
			if (!outcome) { continue; } // Hit a wall

			const snapshot = {
				program: JSON.stringify(currentProgram),
				state: JSON.stringify(currentState),
				stepsTaken: current.stepsTaken + 1,
				position: nextPosition,
			};

			if (!part2 && outcome === 2) { return snapshot; } // Exit case for Part 1
			queue.push(snapshot);
		}

		if (!queue.length) { return current; } // Queue exhausted (exit case for Part 2)
	}
}

interface IDroidSnapshot {
	position: string;
	stepsTaken: number;
	program: string;
	state: string;
}