import * as utils from "../../AdventOfCodeUtils";

/** Day 21 Solution */
export function solution(rawInput: string[]): utils.Solution {
	const recipes: string[][] = [];
	const recipesByAllergen: utils.StringKeyedObject<string[][]> = {};
	const allergenIndex: utils.StringKeyedObject<string[]> = {};
	const safeIngredients: Set<string> = new Set();
	const definitions: utils.Heap<string> = new utils.Heap((a, b) => a.localeCompare(b));

	for (const line of rawInput) {
		const match = line.match(/^([a-z]+( [a-z]+)*) \(contains ([a-z]+(, [a-z]+)*)\)$/);
		if (!match) { continue; }
		const ingredients = match[1].split(" ");
		const allergens = match[3].split(", ");
		recipes.push(ingredients);
		for (const allergen of allergens) {
			(recipesByAllergen[allergen] ||= []).push(ingredients);
		}
		for (const ingredient of ingredients) {
			safeIngredients.add(ingredient);
		}
	}

	// Find ingredients common to all recipes containing a given allergen
	for (const allergen in recipesByAllergen) {
		let candidates = recipesByAllergen[allergen][0];
		for (const ingredientList of recipesByAllergen[allergen]) {
			candidates = candidates.filter(ingredient => ingredientList.includes(ingredient));
		}
		allergenIndex[allergen] = candidates;
		for (const candidate of candidates) {
			safeIngredients.delete(candidate);
		}
	}

	let safeUses = 0;
	for (const recipe of recipes) {
		for (const ingredient of recipe) {
			safeUses += +safeIngredients.has(ingredient);
		}
	}

	while (true) {
		for (const allergen in allergenIndex) {
			if (allergenIndex[allergen].length > 1) { continue; }
			const ingredient = allergenIndex[allergen][0];
			definitions.add([allergen, ingredient].toString());
			for (const otherAllergen in allergenIndex) {
				const list = allergenIndex[otherAllergen];
				if (!list.includes(ingredient)) { continue; }
				list.splice(list.indexOf(ingredient), 1);
			}
			delete allergenIndex[allergen];
			break;
		}
		if (!utils._countObjectNodes(allergenIndex)) { break; }
	}

	debugger;
	let list: string[] = [];
	for (const allergen of definitions.drain()) {
		list.push(allergen.split(",")[1]);
	}

	return [safeUses, list.join(",")];
}