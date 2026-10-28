import * as utils from "../../AdventOfCodeUtils";

/** Day 12 Solution */
export function solution(rawInput: string[]): utils.Solution {
	const potsStr = rawInput[0].match(/^initial state: ([\.#]*)$/)![1];
	let pots: ISparsePots = { low: 0, high: potsStr.length - 1 };
	for (let idx = 0; idx < potsStr.length; idx++) {
		if (potsStr[idx] === "#") { pots[idx] = true; }
	}

	const rules: utils.StringKeyedObject<string> = {};
	for (const line of rawInput) {
		const rule = line.match(/^([\.#]{5}) => ([\.#])$/);
		if (!rule) { continue; }
		rules[rule[1]] = rule[2];
	}

	const out: utils.Solution = [];
	let gens = 0;
	let image = "";
	let previousImage = ".";
	let previousScore = 0;
	let score = 0
	while (image !== previousImage) { // Break once the arrangement becomes repetitive and predictable
		pots = __nextGeneration(pots, rules);

		previousScore = score;
		score = __score(pots);
		if (++gens === 20) { out.push(score); }

		previousImage = image;
		image = __image(pots);
	}

	const delta = score - previousScore;
	const gensRemaining = (50 * 10 ** 9) - gens; // 50 billion, minus what we've done
	out.push(score + delta * gensRemaining);

	return out;
}

function __nextGeneration(pots: ISparsePots, rules: utils.StringKeyedObject<string>): ISparsePots {
	const next = { ...pots };
	const newBounds: number[] = [];
	
	for (let idx = next.low - 2; idx <= next.high + 2; idx++) {
		const rule = [-2, -1, 0, 1, 2].map(offset => pots[idx + offset] ? "#" : ".").join("");
		if (rules[rule] !== "#") {
			delete next[idx];
			continue;
		}
		next[idx] = true;
		if (newBounds.length) {
			newBounds[1] = idx;
		}
		else {
			newBounds.push(idx, idx);
		}
	}

	next.low = newBounds[0];
	next.high = newBounds[1]

	return next;
}

function __score(pots: ISparsePots): number {
	let score = 0;
	for (let idx = pots.low; idx <= pots.high; idx++) {
		score += +(pots[idx] ?? 0) * idx;
	}
	return score;
}

function __image(pots: ISparsePots): string {
	let imageArr: string[] = [];
	for (let idx = pots.low; idx <= pots.high; idx++) {
		imageArr.push(pots[idx] ? "#" : ".");
	}
	return imageArr.join("");
}

interface ISparsePots {
	low: number;
	high: number;
	[key: number]: true;
}