import * as utils from "../../AdventOfCodeUtils";

/** Day 25 Solution */
export function solution(rawInput: string[]): utils.Solution {
	const keys: number[][] = [];
	const locks: number[][] = [];

	let current: string[] | null = null;
	for (const line of rawInput) {
		if (line === "" && current) {
			__processHardware(current, keys, locks);
			current = null;
			continue;
		}
		(current ||= []).push(line);
	}
	if (current) { __processHardware(current, keys, locks); }

	let count = 0;
	for (const key of keys) {
		for (const lock of locks) {
			count += +lock.every((pin, ix) => pin + key[ix] <= 5);
		}
	}
	return [count];
}

function __processHardware(current: string[], keys: number[][], locks: number[][]): void {
	current.pop();
	const histogram: number[] = new Array(current[0].length).fill(0);
	(current.shift()!.includes(".") ? keys : locks).push(histogram);
	for (const line of current) {
		for (let ix = 0; ix < line.length; ix++) {
			histogram[ix] += +(line.charAt(ix) === "#");
		}
	}
}