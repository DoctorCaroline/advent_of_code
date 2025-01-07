import * as utils from "../../AdventOfCodeUtils";

/** Day 24 Solution */
export function solution(rawInput: string[]): utils.Solution {
	
	const currentBlock: string[][] = [];
	const blocks: number[][] = [];
	for (const line of rawInput) {
		const split = line.split(" ");
		if (split[0] === "inp" && currentBlock.length) {
			blocks.push([4, 5, 15].map(line => +currentBlock[line][2]));
			currentBlock.length = 0;
		}
		currentBlock.push(split);
	}
	blocks.push([4, 5, 15].map(line => +currentBlock[line][2]));

	return [__recurse(blocks, "", 0), __recurse(blocks, "", 0, true)];
}

const recursionMemo: utils.StringKeyedObject<boolean> = {};

function __recurse(blocks: number[][], partial: string, z: number, findSmallest: boolean = false): string {

	const memoKey = `${partial.length},${z}`;
	if (recursionMemo[memoKey] === false) { return ""; }
	else { recursionMemo[memoKey] = false; }

	if (!__canReachZero(blocks, partial, z)) { return ""; }
	if (partial.length === blocks.length) {
		return (recursionMemo[memoKey] = z === 0) ? partial : "";
	}

	const start = findSmallest ? 1 : 9;
	const end = findSmallest ? 10 : 0;
	const dir = findSmallest ? 1 : -1;

	for (let digit = start; digit !== end; digit += dir) {
		const outcome = __recurse(
			blocks,
			partial + digit,
			__executeBlock(digit, z, ...blocks[partial.length]),
			findSmallest
		);
		if (outcome) {
			recursionMemo[memoKey] = true;
			return outcome;
		}
	}
	return "";
}

function __executeBlock(w: number, z: number, ...vals: number[]): number {
	const x = +((z % 26 + vals[1]) !== w);
	return Math.trunc(z / vals[0]) * (25 * x + 1) + (w + vals[2]) * x;
}

function __canReachZero(blocks: number[][], partial: string, z: number): boolean {
	let divs = 0;
	for (let ix = partial.length; ix < blocks.length; ix++) {
		divs += +(blocks[ix][0] === 26);
	}
	return 26 ** divs > z;
}