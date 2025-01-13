import * as utils from "../../AdventOfCodeUtils";

/** Day 17 Solution */
export function solution(rawInput: string[]): utils.Solution {
	return [3, 4].map(dimension => __solution(rawInput, dimension));
}

function __solution(rawInput: string[], dimension: number): number {

	let activeNodes: string[] = [];
	const coordinate: number[] = new Array(dimension).fill(0);
	for (const x in rawInput) {
		const split = rawInput[x].split("");
		for (const y in split) {
			if (split[y] === "#") {
				coordinate[0] = +x;
				coordinate[1] = +y;
				activeNodes.push(coordinate.join(","));
			}
		}
	}

	for (let _ = 0; _ < 6; _++) {
		const activeNeighbors: utils.StringKeyedObject<number> = {};
		for (const node of activeNodes) {
			const adjacents = utils._getAdjacents(node.split(",").map(n => +n), true);
			for (const adjacent of adjacents) {
				const key = adjacent.join(",");
				activeNeighbors[key] ??= 0;
				activeNeighbors[key]++;
			}
		}
		const nextActiveNodes: string[] = [];
		for (const node in activeNeighbors) {
			switch (activeNeighbors[node]) {
				case 2:
					if (!activeNodes.includes(node as string)) { continue; }
				case 3:
					nextActiveNodes.push(node as string);
			}
		}
		activeNodes = nextActiveNodes;
	}

	return activeNodes.length;
}