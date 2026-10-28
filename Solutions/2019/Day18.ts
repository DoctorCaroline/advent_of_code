import * as utils from "../../AdventOfCodeUtils";

const __keyIndex: utils.StringKeyedObject<number[]> = {};
const __nodeMap: utils.StringKeyedObject<utils.StringKeyedObject<INodeRoute[]>> = {};
let __target: number = 0;

/** Day 18 Solution */
export function solution(rawInput: string[]): utils.Solution {

	const map = rawInput.map(row => row.split(""));
	
	const start: number[] = [];
	for (let row = 0; row < map.length; row++) {
		for (let col = 0; col < map[row].length; col++) {
			const char = map[row][col];
			if (char === "." || char === "#") { continue; }
			if (char === "@") {
				map[row][col] = ".";
				start.push(row, col);
			}
			else {
				__target = __addKey(__target, char);
			}
			if (char === char.toLowerCase()) {
				__keyIndex[char] = [row, col];
			}
		}
	}

	const out: utils.Solution = [__solutionInner(map, ["@"])];

	const center = __keyIndex["@"];
	map[center[0]][center[1]] = "#";
	map[center[0] + 1][center[1]] = "#";
	map[center[0] - 1][center[1]] = "#";
	map[center[0]][center[1] + 1] = "#";
	map[center[0]][center[1] - 1] = "#";
	__keyIndex["@1"] = [center[0] - 1, center[1] - 1];
	__keyIndex["@2"] = [center[0] - 1, center[1] + 1];
	__keyIndex["@3"] = [center[0] + 1, center[1] - 1];
	__keyIndex["@4"] = [center[0] + 1, center[1] + 1];
	for (const key of ["@1", "@2", "@3", "@4"]) { map[__keyIndex[key][0]][__keyIndex[key][1]] = key; }

	for (const start in __nodeMap) {
		for (const end in __nodeMap[start]) {
			const [startX, startY] = __keyIndex[start];
			const [endX, endY] = __keyIndex[end];
			if ((center[0] - startX) * (center[0] - endX) < 0 || (center[1] - startY) * (center[1] - endY) < 0) {
				delete __nodeMap[start][end];
				delete __nodeMap[end]?.[start];
			}
		}
	}

	out.push(__solutionInner(map, ["@1", "@2", "@3", "@4"]));
	return out;
}

function __solutionInner(map: string[][], startingPositions: string[]): number {

	const initialState: IState = {
		positions: startingPositions,
		keys: 0,
	};

	const queue: utils.IDijkstraQueue = { 0: [JSON.stringify(initialState)] };
	let steps = 0;
	const visited: Set<string> = new Set();

	while (true) {
		
		while (!queue[steps] || !queue[steps].length) {
			delete queue[steps];
			steps++;
		}

		const state: string = queue[steps].pop()!;
		const { positions, keys } = JSON.parse(state) as IState;

		if (keys === __target) { return steps; }

		for (let index = 0; index < positions.length; index++) {
			const position = positions[index];
			const destinations = __getNextAvailableNodes(map, position, keys);
			for (const destination of destinations) {
				const newKeys = __addKey(keys, destination.key);
				const newSteps = steps + destination.route.steps;
				const newPositions = [...positions];
				newPositions[index] = destination.key;
				const newState: IState = { positions: newPositions, keys: newKeys };
				const newStateStr = JSON.stringify(newState);
				if (visited.has(newStateStr)) { continue; }
				visited.add(newStateStr);
				(queue[newSteps] ||= []).push(JSON.stringify(newState));
			}
		}
	}
}

function __getNextAvailableNodes(map: string[][], position: string, keys: number): IDestination[] {
	if (!__nodeMap[position]) { __nodeMap[position] = __pathfind(map, position); }
	const destinations: IDestination[] = [];
	for (const destination in __nodeMap[position]) {
		let bestRoute: INodeRoute | null = null;
		for (const route of __nodeMap[position][destination]) {
			if ((route.keysNeeded & keys) !== route.keysNeeded) { continue; }
			if (!bestRoute || route.steps < bestRoute.steps) { bestRoute = route; }
		}
		if (bestRoute) { destinations.push({ key: destination, route: bestRoute }); }
	}
	return destinations;
}

function __pathfind(map: string[][], position: string): utils.StringKeyedObject<INodeRoute[]> {
	const destinations: utils.StringKeyedObject<INodeRoute[]> = {};
	const [x, y] = __keyIndex[position];
	const initial: IPathfindState = { x, y, locks: 0, steps: 0 };
	const initialStr = JSON.stringify(initial);

	const queue: string[] = [initialStr];
	const visited: Set<string> = new Set();
	visited.add([x, y].join(","));

	while (queue.length) {
		const { x, y, locks, steps } = JSON.parse(queue.shift()!) as IPathfindState;
		
		const adjs = utils._getAdjacents([x, y]);
		for (const adj of adjs) {
			const adjStr = adj.join(",");
			if (visited.has(adjStr)) { continue; }
			const char = map[adj[0]][adj[1]];
			if (char === "#") { continue; }
			let newLocks = locks;
			if (char !== char.toLowerCase()) {
				newLocks = __addKey(newLocks, char);
			}
			if (char === "." || char !== char.toLowerCase()) {
				const newState: IPathfindState = { x: adj[0], y: adj[1], locks: newLocks, steps: steps + 1 };
				queue.push(JSON.stringify(newState));
				visited.add(adjStr);
				continue;
			}
			(destinations[char] ||= []).push({
				keysNeeded: newLocks,
				steps: steps + 1,
			});
		}
	}

	return destinations;
}

function __getKeyBit(char: string): number {
	return 2 ** (char.toLowerCase().charCodeAt(0) - "a".charCodeAt(0));
}

function __addKey(keyMask: number, char: string): number {
	return keyMask | __getKeyBit(char);
}

interface IDestination {
	key: string;
	route: INodeRoute;
}

interface INodeRoute {
	steps: number;
	keysNeeded: number;
}

interface IState {
	positions: string[];
	keys: number;
}

interface IPathfindState{
	x: number,
	y: number,
	locks: number,
	steps: number,
}