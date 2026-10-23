import * as utils from "../../AdventOfCodeUtils";

/** Day 18 Solution */
export function solution(rawInput: string[]): utils.Solution {

	const map = rawInput.map(row => row.split(""));
	
	let target = 0;
	const start: number[] = [];
	for (let row = 0; row < map.length; row++) {
		for (let col = 0; col < map[row].length; col++) {
			const char = map[row][col];
			if (char === "." || char === "#") { continue; }
			if (char === "@") {
				map[row][col] = ".";
				start.push(row, col);
				continue;
			}
			target = __addKey(target, char);
		}
	}

	const out = [];
	out.push(__solutionInner(map, [start], target));
	return out;
}

function __solutionInner(map: string[][], start: number[][], target: number): utils.Solution {

	const initialState: IState = {
		positions: start,
		keys: 0,
	};

	const queue: utils.IDijkstraQueue = { 0: [JSON.stringify(initialState)] };
	let steps = 0;
	const visited: Set<string> = new Set();

	while (true) {
		
		while (!queue[steps] || !queue[steps].length) {
			delete queue[steps];
			steps++;
		}

		const state: string = queue[steps].pop()!;
		const { positions, keys } = JSON.parse(state) as IState;

		for (let index = 0; index < positions.length; index++) {
			const position = positions[index];
			const nextSteps = [[0, -1], [-1, 0], [0, 1], [1, 0]].map(move => [position[0] + move[0], position[1] + move[1]]);
			for (const nextStep of nextSteps) {
				const nextChar = map[nextStep[0]][nextStep[1]];
				if (!__canMoveTo(keys, nextChar)) { continue; }
				let nextKeys = keys;
				if (nextChar !== "." && nextChar === nextChar.toLowerCase()) {
					nextKeys = __addKey(keys, nextChar);
					if (nextKeys === target) { return [steps + 1]; }
				}

				const stateToQueue = JSON.stringify({
					positions: [nextStep],
					keys: nextKeys,
				} as IState);

				if (visited.has(stateToQueue)) { continue; }
				visited.add(stateToQueue);
				
				(queue[steps + 1] ||= []).push(stateToQueue);
			}
		}
	}
}

function __getKeyBit(char: string): number {
	return 2 ** (char.toLowerCase().charCodeAt(0) - "a".charCodeAt(0));
}

function __addKey(keyMask: number, char: string): number {
	return keyMask | __getKeyBit(char);
}

function __containsKey(keyMask: number, char: string): boolean {
	return (keyMask & __getKeyBit(char)) > 0;
}

function __canMoveTo(keyMask: number, char: string): boolean {
	if (char === ".") { return true; }
	if (char === "#") { return false; }
	if (char === char.toLowerCase()) { return true; }
	return __containsKey(keyMask, char);
}

interface IState {
	positions: number[][];
	keys: number;
}