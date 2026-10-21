import * as utils from "../../AdventOfCodeUtils";

/** Day 16 Solution */
export function solution(rawInput: string[]): utils.Solution {

	let sequence = rawInput[0].split("").map(n => +n);

	for (let _ = 0; _ < 100; _++) { sequence = __fftPass(sequence); }

	const out = [sequence.slice(0, 8).join("")];
	return out;
}

function __amplitude(wavelength: number, position: number): number {
	return [0, 1, 0, -1][Math.floor((position + 1) / (wavelength + 1)) % 4];
}

function __fftPass(sequence: number[]): number[] {
	const out = [];
	for (const place in sequence) {
		out.push(sequence.reduce((sum, value, index) => sum + (value * __amplitude(+place, index)), 0) % 10);
	}
	return out.map(value => value * Math.sign(value));
}