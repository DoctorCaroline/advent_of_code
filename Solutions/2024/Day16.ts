import * as utils from "../../AdventOfCodeUtils";

/** Day 16 Solution */
export function solution(rawMap: string[]): utils.Solution {

	const reindeer: number[] = [0, 1];
	const map: MapCharacters[][] = [];
	const end: number[] = [];
	for (const row of rawMap) {
		if (row.includes("S")) {
			reindeer.unshift(map.length, row.indexOf("S"));
		}
		if (row.includes("E")) {
			end.unshift(map.length, row.indexOf("E"));
		}
		map.push(row.split("") as MapCharacters[]);
	}

	let cost = 0;
	let bestCost = Number.MAX_SAFE_INTEGER;
	const toEvaluate: DijkstraQueue = { 0: [reindeer.join(",")] };
	const evaluated: utils.StringKeyedObject<true> = {};
	const predecessors: utils.StringKeyedObject<string[]> = {};
	const backtrackList: string[] = [];

	while (cost <= bestCost) {

		while (!toEvaluate[cost]) { cost++; }
		const strState = toEvaluate[cost].pop();

		// Depleted a particular cost; kill node and proceed to next cost
		if (!strState) {
			delete toEvaluate[cost];
			continue;
		}

		// This state was already achieved for a lower cost
		if (evaluated[strState]) { continue; }

		const state = strState.split(",").map(n => +n);

		// Did we make it?
		if (state[0] === end[0] && state[1] === end[1]) {
			bestCost = cost;
			backtrackList.push([...state, cost].join(","));
		}

		evaluated[state.join(",")] = true;
		
		// Process next states
		const nextStates = [
			[state[0] + state[2], state[1] + state[3], state[2], state[3]],
			[state[0], state[1], state[3], state[2]],
			[state[0], state[1], -state[3], -state[2]],
		];
		for (const ix in nextStates) {
			const targetState = nextStates[ix];
			const isTurn = !!+ix;
			const key = targetState.join(",");
			if (map[targetState[0]][targetState[1]] !== "#" && !evaluated[key]) {
				const newCost = cost + (isTurn ? 1000 : 1);
				(toEvaluate[newCost] ||= []).push(key);
				(predecessors[[...targetState, newCost].join(",")] ||= []).push([...state, cost].join(","));
			}
		}
	}

	const goodSeats: utils.StringKeyedObject<true> = {};
	for (const finalState of backtrackList) {
		__backtrack(predecessors, finalState, goodSeats);
	}

	return [bestCost, utils._countObjectNodes(goodSeats)];
}

function __backtrack(predecessors: utils.StringKeyedObject<string[]>, strState: string, goodSeats: utils.StringKeyedObject<true>): void {
	const place = strState.split(",").slice(0, 2).join(",");
	goodSeats[place] = true;
	if (!predecessors[strState]) { return; }
	for (const predecessor of predecessors[strState]) {
		__backtrack(predecessors, predecessor, goodSeats);
	}
}

type MapCharacters = "S" | "E" | "#" | ".";

interface DijkstraQueue {
	[cost: number]: string[];
}