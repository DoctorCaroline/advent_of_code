import * as utils from "../../AdventOfCodeUtils";

/** Day 22 Solution */
export function solution(rawInput: string[]): utils.Solution {
	return [
		__shuffle(rawInput, 10007, 1, Operation.solveForLocation, 2019),
		__shuffle(rawInput, 119315717514047, 101741582076661, Operation.solveForCard, 2020),
	];
}

function __shuffle(sequence: string[], deckSizeNum: number, repsNum: number, operation: Operation, targetNum: number): bigint {
	const deckSize = BigInt(deckSizeNum), target = BigInt(targetNum), reps = BigInt(repsNum);
	const lin = __linearize(sequence, deckSize);
	const mFinal = utils._biModExp(lin.m, reps, deckSize);
	const bFinal = utils._biModDiv(utils._biMod(lin.b * (utils._biModExp(lin.m, reps, deckSize) - BigInt(1)), deckSize), lin.m - BigInt(1), deckSize);
	
	return operation === Operation.solveForLocation
		? utils._biMod(mFinal * target + bFinal, deckSize)
		: utils._biModDiv(target - bFinal, mFinal, deckSize);
}

function __linearize(rawInput: string[], deckSize: bigint): ILinearization {
	let m = BigInt(1), b = BigInt(0);
	for (const line of rawInput) {
		const cut = +(line.match(/^cut (-?[0-9]+)$/)?.[1] ?? 0);
		if (cut) {
			b = utils._biMod(b - BigInt(cut), deckSize);
		}
		const flip = !!line.match(/^deal into new stack$/);
		if (flip) {
			m = utils._biMod(-m, deckSize);
			b = utils._biMod(deckSize - b - BigInt(1), deckSize);
		}
		const increment = +(line.match(/^deal with increment (-?[0-9]+)$/)?.[1] ?? 0);
		if (increment) {
			const inc = BigInt(increment);
			m = utils._biMod(m * inc, deckSize);
			b = utils._biMod(b * inc, deckSize);
		}
	}
	return { m, b };
}

interface ILinearization {
	/** Slope of linearized shuffle */
	m: bigint;
	/** Static offset of linearized shuffle */
	b: bigint;
}

enum Operation {
	/** Specify card, receive location */
	solveForLocation,
	/** Specify location, receive card */
	solveForCard,
}