import * as utils from "../../AdventOfCodeUtils";

/** Day 6 Solution */
export function solution(rawOrbits: string[]): utils.Solution {
	const orbits: utils.StringKeyedObject<string[]> = {};
	for (const orbit of rawOrbits) {
		const [primary, satellite] = orbit.split(")");
		orbits[primary] = [ ...(orbits[primary] || []), satellite];
	}
	
	const getOrbits = (body: string, depth: number = 0) => {
		let total = depth;
		const moons = orbits[body] || [];
		
		for (const moon of moons) {
			total += getOrbits(moon, depth + 1);
		}
		
		return total;
	};
	
	const buildLineage = (body: string) => {
		const lineage = [];
		while (lineage[0] !== body) {
			body = lineage[0] || body;
			for (const parent in orbits) {
				if (orbits[parent].includes(body)) {
					lineage.unshift(parent);
					break;
				}
			}
		}
		return lineage;
	};
	
	const youLine = buildLineage("YOU");
	const sanLine = buildLineage("SAN");
	while (youLine[0] === sanLine[0]) {
		youLine.shift();
		sanLine.shift();
	}
	
	return [getOrbits("COM"), youLine.length + sanLine.length];
}