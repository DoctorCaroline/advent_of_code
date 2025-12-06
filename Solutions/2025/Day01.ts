import * as utils from "../../AdventOfCodeUtils";

/** Day 1 Solution */
export function solution(rawTurns: string[]): utils.Solution {

	const out = [0, 0];
	let dial = 50;

	for (const rawTurn of rawTurns) {
		// Parse turn magnitude and direction separately for easier JS mod math
		const sign = rawTurn[0] === "R" ? 1 : -1;
		let turn = +rawTurn.substring(1);

		// Deduplicate full 360-degree rotations and add to the count
		out[1] += Math.floor(turn / 100);
		turn %= 100;

		// If not already zero, and deduplicated turn takes dial to/past zero, count it
		const alreadyZero = !dial;
		dial += sign * turn;
		out[1] += +(!alreadyZero && (dial > 99 || dial <= 0));

		// Renormalize dial to 0-99 value and see whether we ended on zero
		dial = utils._mod(dial, 100);
		out[0] += +!dial;
	}

	return out;
}