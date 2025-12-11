import * as utils from "../../AdventOfCodeUtils";

/** Day 10 Solution */
export function solution(rawInput: string[]): utils.Solution {

	const machines: Machine[] = [];
	
	for (const line of rawInput) {
		const lights = Number.parseInt(line.match(/^\[([#|\.]+)\]/)![1].split("").map(char => char === "#" ? 1 : 0).reverse().join(""), 2);
		const toggles = [...line.matchAll(/\((\d+(,\d+)*)\)/g)].map(arr => arr[1].split(",").map(n => +n));
		const toggleMasks = toggles.map(arr => utils._sum(arr.map(n => 2 ** +n)));
		const joltages = line.match(/{(\d+(,\d+)*)}/)![1].split(",").map(n => +n);
		machines.push({ lights, toggles, toggleMasks, joltages });
	}

	const out = [0, 0];
	for (const machine of machines) {
		out[0] += __lights(machine);
		out[1] += __joltages(machine);
	}
	return out;
}

function __lights(machine: Machine, index: number = 0, current: number = 0, count: number = 0): number {
	if (current === machine.lights) { return count; }
	if (index === machine.toggleMasks.length) { return Number.MAX_SAFE_INTEGER; }
	return Math.min(
		__lights(machine, index + 1, current ^ machine.toggleMasks[index], count + 1),
		__lights(machine, index + 1, current, count),
	);
}

function __joltages(machine: Machine): number {
	const matrix = __buildLinearMatrix(machine);
	utils._refMatrix(matrix, true);
	return __solveMatrix(matrix, Math.max(...machine.joltages));
}

function __buildLinearMatrix(machine: Machine): number[][] {
	const { joltages, toggles } = machine;

	const matrix = joltages.map(_ => [] as number[]);

	for (const toggle of toggles) {
		matrix.forEach((row, index) => row.push(+toggle.includes(index)));
	}
	for (const row in joltages) {
		matrix[row].push(joltages[row]);
	}

	return matrix;
}

function __solveMatrix(matrix: number[][], guessCap: number): number {
	while (matrix[matrix.length - 1].every(n => n === 0)) { matrix.pop(); }
	
	const knowns: (number | undefined)[] = new Array(matrix[0].length - 1).fill(undefined);
	let minimum = Number.MAX_SAFE_INTEGER;

	const recurse = (knowns: (number | undefined)[], index: number) => {
		if (index < 0) {
			minimum = Math.min(minimum, utils._sum(knowns as number[]));
			return;
		}

		const row = matrix[index];

		// If equation has a non-zero coefficient and no value in knowns, consider it an unknown
		const unknowns: number[] = [];
		knowns.forEach((value, index) => {
			value === undefined && row[index] !== 0 && unknowns.push(index);
		});

		// Underdetermined line; must guess possible "known" values and retry the line
		if (unknowns.length > 1) {
			const guessIndex = unknowns[0];
			for (let guess = 0; guess < guessCap; guess++) {
				knowns[guessIndex] = guess;
				recurse([...knowns], index);
			}
			return;
		}

		// Calculate value of new known
		const unknown = unknowns[0];
		const knownsDotProduct = (knowns as number[]).reduce((total, value, index) => total + (value ?? 0) * row[index], 0);
		const rowProduct = row[row.length - 1] - knownsDotProduct;
		const newKnown = rowProduct / row[unknown];

		// Can't press a button a negative or non-integer number of times
		if (newKnown < 0 || newKnown % 1) { return; }
		
		knowns[unknown] = newKnown;
		recurse(knowns, index - 1);
	};

	recurse(knowns, matrix.length - 1);
	return minimum;
}

interface Machine {
	lights: number;
	toggles: number[][];
	toggleMasks: number[];
	joltages: number[];
}