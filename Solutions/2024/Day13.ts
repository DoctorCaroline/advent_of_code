import * as utils from "../../AdventOfCodeUtils";

/** Day 13 Solution */
export function solution(rawInput: string[]): utils.Solution {

	const games: CraneGame[] = [];

	const extractNextDigits = () => rawInput.shift()!
		.match(/(\d+)[^\d]*(\d+)/)!
		.filter((_: string, ix: number) => ix === 1 || ix === 2)
		.map(n => +n);

	while (rawInput.length) {
		games.push({
			btnA: extractNextDigits(),
			btnB: extractNextDigits(),
			prize: extractNextDigits(),
		});
		rawInput.shift();
	}

	const costs = [0, 0];

	for (const game of games) {
		costs[0] += __minimumCost(game);
		game.prize[0] += 10000000000000;
		game.prize[1] += 10000000000000;
		costs[1] += __minimumCost(game);
	}
	return costs;
}

function __minimumCost(game: CraneGame) {
	
	let cost = Number.MAX_VALUE;
	const { prize, btnA, btnB } = game;

	// Can't rule out individual button vectors are already colinear with prize
	const buttons = [btnA, btnB];
	for (const btnIx in buttons) {
		const button = buttons[btnIx];
		const xRatio = prize[0] / button[0];
		if (xRatio === Math.floor(xRatio) && xRatio === prize[1] / button[1]) {
			cost = Math.min(cost, xRatio * (+btnIx || 3));
		}
	}
	if (cost < Number.MAX_VALUE) {
		return cost;
	}

	// If neither button is colinear, attempt to solve system of equations
	const det = btnA[0] * btnB[1] - btnA[1] * btnB[0];
	if (det === 0) { return 0; }
	const aPresses = (prize[0] * btnB[1] - prize[1] * btnB[0]) / det;
	const bPresses = (btnA[0] * prize[1] - btnA[1] * prize[0]) / det;
	if (
		aPresses === Math.floor(aPresses)
		&& bPresses === Math.floor(bPresses)
		&& aPresses > 0
		&& bPresses > 0
	)
	{
		return 3 * aPresses + bPresses;
	}
	return 0;
}

interface CraneGame {
	btnA: number[];
	btnB: number[];
	prize: number[];
}