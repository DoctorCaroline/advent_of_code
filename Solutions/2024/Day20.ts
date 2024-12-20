import * as utils from "../../AdventOfCodeUtils";

/** Day 20 Solution */
export function solution(rawMap: string[]): utils.Solution {

	const map: string[][] = [];
	let cursor: number[] = [];
	for (const lineStr of rawMap) {
		const line = lineStr.split("") as string[];
		if (line.includes("S")) {
			cursor.push(map.length, line.indexOf("S"));
		}
		map.push(line);
	}

	const path: number[][] = [];
	const minDesiredCheat = 100;

	// Trace path through maze
	while (true) {
		path.push(cursor);
		if (map[cursor[0]][cursor[1]] === "E") { break; }
		for (const direction of utils._getAdjacents(cursor)) {
			if (map[direction[0]][direction[1]] !== "#" && path[path.length - 2]?.toString() !== direction.toString()) {
				cursor = direction;
				break;
			}
		}
	}

	// Pairwise checks for cheat eligibility
	const totals = [0, 0];
	for (let startIx = 0; startIx < path.length - minDesiredCheat; startIx++) {
		for (let endIx = startIx + minDesiredCheat; endIx < path.length; endIx++) {
			const
				start = path[startIx],
				end = path[endIx],
				distance = utils._manhattanDistance(start, end),
				savings = endIx - startIx - distance;

			if (savings < minDesiredCheat) { continue; }
			totals[0] += +(distance <= 2);
			totals[1] += +(distance <= 20);
		}
	}

	return totals;
}