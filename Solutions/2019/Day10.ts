import * as utils from "../../AdventOfCodeUtils";

/** Day 10 Solution */
export function solution(rawInput: string[]): utils.Solution {
	
	const field = rawInput.map(row => row.split("").map(space => space === "#"));
	
	const sightLines: utils.StringKeyedObject<string[]> = {};
	
	const makeArr = (str: string) => str.split(",").map(n => +n);
	const makeDiff = (start: number[], end: number[]) => [end[0] - start[0], end[1] - start[1]];
	
	const obscured = (locAStr: string, locBStr: string) => {
		const locA = makeArr(locAStr);
		const locB = makeArr(locBStr);
		const diff = makeDiff(locA, locB);
		const [dixX, divY] = diff.map(Math.abs);
		const div = utils._gcd(dixX, divY);
		while (true) {
			for (let axis = 0; axis < 2; axis++) { locA[axis] += diff[axis] / div; }
			if (sightLines[locA.join(",")]) { break; }
		}
		return locA.join(",") !== locB.join(",");
	};
	
	const angleTo = (startStr: string, endStr: string) => {
		const start = makeArr(startStr);
		const end = makeArr(endStr);
		const diff = makeDiff(start, end);
		return Math.PI / 2 + Math.atan(diff[0] / diff[1]) + Math.PI * +(diff[1] < 0);
	};
	
	for (let row = 0; row < field.length; row++) {
		for (let col = 0; col < field[0].length; col++) {
			if (!field[row][col]) { continue; }
			const loc = [row, col].join(",");
			sightLines[loc] ||= [];
			for (const target in sightLines) {
				if (loc === target || obscured(loc, target)) { continue; }
				sightLines[loc].push(target);
				sightLines[target].push(loc);
			}
		}
	}
	
	let maxVis = 0;
	let base: string = "";
	for (const loc in sightLines) {
		const vis = sightLines[loc].length;
		if (vis <= maxVis) { continue; }
		maxVis = vis;
		base = loc;
	}
	
	const queue = sightLines[base];
	queue.sort((a, b) => angleTo(base, a) - angleTo(base, b));
	const ccth = makeArr(queue[199]);
	
	return [maxVis, 100 * ccth[1] + ccth[0]];
};