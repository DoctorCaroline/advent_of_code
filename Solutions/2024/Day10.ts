import * as utils from "../../AdventOfCodeUtils";

/** Day 10 Solution */
export function solution(rawMap: string[]): utils.Solution {

	const map = rawMap.map(row => row.split("").map(n => +n));
	const trailheads: number[][] = [];

	for (const rowIx in map) {
		for (const colIx in map[rowIx]) {
			const altitude = map[rowIx][colIx];
			if (altitude === 0) { trailheads.push([+rowIx, +colIx]); }
		}
	}

	const scores = [0, 0]
	for (const trackUnique of [false, true]) {
		for (const trailhead of trailheads) {
			scores[+trackUnique] += getAccessible9s(map, trailhead[0], trailhead[1], trackUnique).length;
		}
	}
	return scores;
}

function getAccessible9s(map: number[][], rowIx: number, colIx: number, trackUnique: boolean): number[][] {
	const elevation = map[rowIx][colIx];
	if (elevation === 9) { return [[rowIx, colIx]]; }
	
	const nines = [];
	for (const neighbor of [[rowIx - 1, colIx], [rowIx + 1, colIx], [rowIx, colIx - 1], [rowIx, colIx + 1]]) {
		const neighborEl = map[neighbor[0]]?.[neighbor[1]];
		if (!neighborEl || neighborEl !== elevation + 1) { continue; }
		nines.push(...getAccessible9s(map, neighbor[0], neighbor[1], trackUnique));
	}

	return trackUnique
		? nines
		: [... new Set(nines.map(nine => nine.toString()))].map(nine => nine.split(",").map(n => +n));
}