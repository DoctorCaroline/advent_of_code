import * as utils from "../../AdventOfCodeUtils";

const __maxDimension = 300;
const MIN = Number.MIN_SAFE_INTEGER;

/** Day 11 Solution */
export function solution(rawInput: string[]): utils.Solution {
	const serial = +rawInput[0];
	let maxPower3x3 = MIN;
	let maxPowerAll = MIN;
	const out = ["", ""];

	const grid = new Array(__maxDimension + 1).fill(false).map(
		(_, x) => new Array(__maxDimension + 1).fill(false).map(
			(_, y) => {
				const power = (x + 10)**2 * y + (x + 10) * serial;
				return (power % 1000 - power % 100) / 100 - 5;
			}
		)
	);

	for (let x = 1; x <= __maxDimension; x++) {
		for (let y = 1; y <= __maxDimension; y++) {
			const { power3x3, maxPower, maxPowerSize } = __sampleCell(grid, x, y);
			if (power3x3 > maxPower3x3) {
				maxPower3x3 = power3x3;
				out[0] = `${x},${y}`;
			}
			if (maxPower > maxPowerAll) {
				maxPowerAll = maxPower;
				out[1] = `${x},${y},${maxPowerSize}`;
			}
		}
	}
	return out;
}

/**
 * For a given X,Y seed, grow the square area, one row-column pair at a time.
 * Allows calculation of 100x100 square for just the cost of the 100th row and 100th column.
 * Returns...
 *  - The power of the 3x3 square (as required for Part 1)
 *  - The maximum power of any NxN square starting at X,Y
 *  - The size of that max-powered square
 */
function __sampleCell(grid: number[][], x0: number, y0: number): ICellSample {
	const out: ICellSample = {
		maxPower: MIN,
		power3x3: MIN,
		maxPowerSize: 0,
	};

	let power = 0;
	for (let delta = 0; Math.max(x0, y0) + delta <= __maxDimension; delta++) {
		// Column
		for (let xi = x0; xi <= x0 + delta; xi++) {
			power += grid[xi][y0 + delta];
		}
		// Row
		for (let yi = y0; Math.max(x0, y0) < y0 + delta; yi++) {
			power += grid[x0 + delta][yi];
		}
		// ^^^ Above loops have slightly different conditions to prevent double-counting of vertex
		if (delta === 2) {
			out.power3x3 = power;
		}
		if (power < out.maxPower) { continue; }
		out.maxPower = power;
		out.maxPowerSize = delta + 1;
	}
	return out;
}

interface ICellSample {
	power3x3: number;
	maxPower: number;
	maxPowerSize: number;
}