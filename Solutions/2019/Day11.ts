import * as utils from "../../AdventOfCodeUtils";
import { IntcodeRuntime, IntcodeMachineState } from "./Intcode";

/** Day 11 Solution */
export function solution(rawInput: string[]): utils.Solution {
	const program = rawInput[0].split(",").map(n => +n);

	const blackHull: utils.StringKeyedObject<boolean> = {};
	paintHull(program, blackHull);

	const whiteHull: utils.StringKeyedObject<boolean> = { "0,0": true };
	paintHull(program, whiteHull);

	const xDimensions = [0, 0];
	const yDimensions = [0, 0];

	for (const key in whiteHull) {
		const [x, y] = key.split(",").map(n => +n);
		xDimensions[0] = Math.min(x, xDimensions[0]);
		xDimensions[1] = Math.max(x, xDimensions[1]);
		yDimensions[0] = Math.min(y, yDimensions[0]);
		yDimensions[1] = Math.max(y, yDimensions[1]);
	}

	let identifier = "";
	for (let y = yDimensions[1]; y >= yDimensions[0]; y--) {
		if (identifier.length) { identifier += "\n"; }
		for (let x = xDimensions[0]; x <= xDimensions[1]; x++) {
			identifier += whiteHull[`${x},${y}`] ? "#" : " ";
		}
	}

	return [utils._countObjectNodes(blackHull), identifier];
};

function paintHull(program: number[], hull: utils.StringKeyedObject<boolean>): void {
	const intcoder = new IntcodeRuntime();
	const cursor = [0, 0];
	const heading = [0, 1];
	const state: Partial<IntcodeMachineState> = { input: [], continuousInput: true };

	const nextStep = (onWhite: boolean) => {
		if (state.done!) { return []; }
		state.input!.push(+onWhite);
		intcoder.run(program, undefined, state);
		const out = [...state.output!];
		state.output!.length = 0;
		return out;
	};

	while (true) {
		const cursorStr = `${cursor[0]},${cursor[1]}`;
		const output = nextStep(hull[cursorStr]);
		if (!output.length) { return; }

		hull[cursorStr] = !!output[0];

		[heading[0], heading[1]] = [-heading[1], heading[0]];
		if (output[1]) {
			heading[0] *= -1;
			heading[1] *= -1;
		}

		cursor[0] += heading[0];
		cursor[1] += heading[1];
	}
}