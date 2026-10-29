import * as utils from "../../AdventOfCodeUtils";

/** Day 14 Solution */
export function solution(rawInput: string[]): utils.Solution {
	const threshold = +rawInput[0];
	const elves = [0, 1];
	const recipes = [3, 7];

	const out: utils.Solution = [0, 0];

	while (out.some(value => !value)) {
		const newRecipes = (recipes[elves[0]] + recipes[elves[1]] + "").split("").map(n => +n);
		for (const recipe of newRecipes) {
			recipes.push(recipe);
			const tail = recipes.slice(recipes.length - rawInput[0].length, recipes.length).join("");
			if (!out[1] && tail === rawInput[0]) { out[1] = [recipes.length - rawInput[0].length]; }
		}
		for (const elf in elves) {
			elves[elf] = (elves[elf] + recipes[elves[elf]] + 1) % recipes.length;
		}
		if (!out[0] && recipes.length >= threshold + 10) {
			out[0] = recipes.slice(threshold, threshold + 10).join("");
		}
	}

	return out;
}