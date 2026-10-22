import * as utils from "../../AdventOfCodeUtils";
import { IntcodeRuntime, IntcodeMachineState } from "./Intcode";

/** Day 12 Solution */
export function solution(rawInput: string[]): utils.Solution {
	const program = rawInput[0].split(",").map(n => +n);
	program[0] = 2;
	const intcoder = new IntcodeRuntime();
	const codeState: Partial<IntcodeMachineState> = { continuousInput: true };

	const output = intcoder.run(program, undefined, codeState);

	const gameState: GameState = {
		blocks: new Set(),
		ballX: 0,
		paddleX: 0,
		score: 0,
	}

	flushOutput(output, gameState);
	const out = [gameState.blocks.size];

	while (gameState.blocks.size) {
		const dir = Math.sign(gameState.ballX - gameState.paddleX);
		codeState.input!.push(dir);
		intcoder.run(program, undefined, codeState);
		flushOutput(output, gameState);
	}

	out.push(gameState.score);
	return out;
}

function flushOutput(output: number[], gameState: GameState): void {
	while (output.length) {
		const [x, y, value] = [output.shift()!, output.shift()!, output.shift()!];
		const pos = `${x},${y}`
		switch (value) {
			case 0:
				gameState.blocks.has(pos) && gameState.blocks.delete(pos);
				break;
			case 2:
				gameState.blocks.add(pos);
				break;
			case 3:
				gameState.paddleX = x;
				break;
			case 4:
				gameState.ballX = x;
		}

		if (x === -1 && y === 0) { gameState.score = value; }
	}
}

interface GameState {
	ballX: number;
	paddleX: number;
	score: number;
	blocks: Set<string>;
}