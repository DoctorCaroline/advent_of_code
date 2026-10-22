import * as utils from "../../AdventOfCodeUtils";

/** Day 16 Solution */
export function solution(rawInput: string[]): utils.Solution {
	const sequence = rawInput[0].split("").map(n => +n);
	const bigSequence = [];
	const offset = +sequence.slice(0, 7).join("");
	for (let index = offset; index < sequence.length * 10000; index++) {
		bigSequence.push(sequence[index % sequence.length]);
	}

	for (let _ = 0; _ < 100; _++) {
		__fftPass(sequence);
		__partialSumPass(bigSequence);
	}

	return [
		sequence.slice(0, 8).join(""),
		bigSequence.slice(0, 8).join("")
	];
}

function __amplitude(wavelength: number, position: number): number {
	return [0, 1, 0, -1][Math.floor((position + 1) / (wavelength + 1)) % 4];
}

function __fftPass(sequence: number[]): void {
	for (let place = 0; place < sequence.length; place++) {
		let sum = 0;
		for (let index = place; index < sequence.length; index++) {
			sum += sequence[index] * __amplitude(place, index);
		}
		sequence[place] = (sum * Math.sign(sum)) % 10;
	}
}

function __partialSumPass(sequence: number[]): void {
	for (let i = sequence.length - 2; i >= 0; i--) {
		sequence[i] = (sequence[i] + sequence[i + 1]) % 10;
	}
}