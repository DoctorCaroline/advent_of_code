import * as utils from "../../AdventOfCodeUtils";

/** Day 18 Solution */
export function solution(rawCoordinates: string[]): utils.Solution {

	const pathfind = (badByteCount: number) => {
		const badBytes: utils.StringKeyedObject<true> = {};
		let lastBadByte = "";
		for (const line in rawCoordinates) {
			if (+line === badByteCount) { break; }
			badBytes[rawCoordinates[line]] = true;
			lastBadByte = rawCoordinates[line];
		}
		return __pathfind(badBytes);
	};

	let lo = 0;
	let hi = rawCoordinates.length - 1;
	while (lo + 1 !== hi) {
		const testVal = Math.floor((lo + hi) / 2);
		pathfind(testVal)
			? lo = testVal
			: hi = testVal;
	}

	return [pathfind(1024), rawCoordinates[lo]];
}

function __pathfind(obstacles: utils.StringKeyedObject<true>): number {
	let cost = 0;
	const toEvaluate: DijkstraQueue = { 0: ["0,0"] };
	const evaluated: utils.StringKeyedObject<true> = {};

	while (true) {
		while (!toEvaluate[cost]) { cost++; }
		const positionStr = toEvaluate[cost].pop();

		if (!positionStr) {
			delete toEvaluate[cost];
			if (!utils._countObjectNodes(toEvaluate)) { return 0; }
			continue;
		}

		if (positionStr === `${maxDimension},${maxDimension}`) { return cost; }
		if (evaluated[positionStr]) { continue; }
		evaluated[positionStr] = true;

		const position = positionStr.split(",").map(n => +n);

		for (const nextPosition of [
			[position[0], position[1] - 1],
			[position[0], position[1] + 1],
			[position[0] - 1, position[1]],
			[position[0] + 1, position[1]],
		]) {
			if (nextPosition.some(coord => coord > maxDimension || coord < 0)) {
				continue; // Out of bounds
			}
			const nextPositionStr = nextPosition.join(",");
			if (obstacles[nextPositionStr]) {
				continue; // Obstructed by corrupted memory
			}
			(toEvaluate[cost + 1] ||= []).push(nextPositionStr);
		}
	}
}

const maxDimension = 70;

interface DijkstraQueue {
	[cost: number]: string[];
}