import * as utils from "../../AdventOfCodeUtils";

/** Day 14 Solution */
export function solution(rawInput: string[]): utils.Solution {

	const reactions: utils.StringKeyedObject<Reaction> = {};
	for (const line of rawInput) {
		const split = line.split(" ");
		const reactants: ChemicalQuantity[] = [];
		while (split.length) {
			const quantity = +split.shift()!;
			if (isNaN(quantity)) { continue; } // Reached "=>" segment
			const chemical = split.shift()!.replace(",", "");
			const chemicalQuantity = { chemical, quantity };
			if (split.length) {
				reactants.push(chemicalQuantity);
			}
			else {
				reactions[chemical] = { reactants, ...chemicalQuantity };
			}
		}
	}

	let low = 1, high = 1000000000;
	while (high - low > 1) {
		const mid = Math.floor((low + high) / 2);
		if (getOreRequirement(reactions, mid) > 10 ** 12) {
			high = mid;
		}
		else {
			low = mid;
		}
	}

	return [getOreRequirement(reactions, 1), low];
}

function getOreRequirement(reactions: utils.StringKeyedObject<Reaction>, fuelRequirement: number): number {
	const inventory: utils.StringKeyedObject<number> = { "FUEL": fuelRequirement };
	while (true) {
		let finished = true;
		for (const chemical in inventory) {
			if (chemical === "ORE") { continue; }
			if (inventory[chemical] <= 0) { continue; }
			const reaction = reactions[chemical];
			const multiple = Math.ceil(inventory[chemical] / reaction.quantity)
			for (const reactant of reaction.reactants) {
				inventory[reactant.chemical] ||= 0;
				inventory[reactant.chemical] += reactant.quantity * multiple;
			}
			inventory[chemical] -= reaction.quantity * multiple;
			finished = false;
		}
		if (finished) { break; }
	}
	return inventory["ORE"];
}

interface ChemicalQuantity {
	chemical: string;
	quantity: number;
}

interface Reaction extends ChemicalQuantity {
	reactants: ChemicalQuantity[]
}