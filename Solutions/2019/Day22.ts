import * as utils from "../../AdventOfCodeUtils";

/** Day 22 Solution */
export function solution(rawInput: string[]): utils.Solution {

	const deck1 = __shuffle(rawInput, { top: 0, delta: 1, size: 10007 });

	let position = 0;
	while (deck1.top !== 2019) {
		deck1.top = utils._mod(deck1.top + deck1.delta, deck1.size);
		position++;
	}

	return [position];
}

function __shuffle(rawInput: string[], deck: IDeck): IDeck {
	let { top, delta, size } = deck;

	for (const line of rawInput) {
		
		const cut = line.match(/^cut (-?[0-9]+)$/);
		if (cut) {
			top = utils._mod((top + delta * +cut[1]), size);
		}
		
		const flip = line.match(/^deal into new stack$/);
		if (flip) {
			top = utils._mod(top - delta, size);
			delta = size - delta;
		}
		
		const increment = line.match(/^deal with increment (-?[0-9]+)$/);
		if (increment) {
			delta = utils._modDiv(delta, +increment[1], size);
		}
	}

	deck.top = top;
	deck.delta = delta;
	deck.size = size;
	return { top, delta, size };
}

interface IDeck {
	top: number,
	delta: number,
	size: number,
}