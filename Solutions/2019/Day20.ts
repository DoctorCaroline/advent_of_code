import * as utils from "../../AdventOfCodeUtils";

/** Day 20 Solution */
export function solution(rawInput: string[]): utils.Solution {
	const map = rawInput.map(row => row.split(""));

	const portalsIndex: utils.StringKeyedObject<number[][]> = {};

	for (let row = 0; row < map.length; row++) {
		for (let col = 0; col < map[row].length; col++) {
			const char = map[row][col];
			if (!__isLetter(char)) { continue; }
			// Vertical
			if (__isLetter(map[row + 1]?.[col])) {
				const key = char + map[row + 1][col];
				// Path above
				if (map[row - 1]?.[col] === ".") {
					map[row][col] = "@";
					map[row + 1][col] = " ";
					(portalsIndex[key] ||= []).push([row, col]);
				}
				// Path below
				if (map[row + 2]?.[col] === ".") {
					map[row][col] = " ";
					map[row + 1][col] = "@";
					(portalsIndex[key] ||= []).push([row + 1, col]);
				}
			}
			// Horizontal
			if (__isLetter(map[row][col + 1])) {
				const key = char + map[row][col + 1];
				// Path left
				if (map[row][col - 1] === ".") {
					map[row][col] = "@";
					map[row][col + 1] = " ";
					(portalsIndex[key] ||= []).push([row, col]);
				}
				// Path right
				if (map[row][col + 2] === ".") {
					map[row][col] = " ";
					map[row][col + 1] = "@";
					(portalsIndex[key] ||= []).push([row, col + 1]);
				}
			}
		}
	}

	let start = portalsIndex["AA"][0];
	map[start[0]][start[1]] = "#";
	if (map[start[0]][start[1] + 1] === ".") { start[1]++; }
	else if (map[start[0]][start[1] - 1] === ".") { start[1]--; }
	else if (map[start[0] + 1][start[1]] === ".") { start[0]++; }
	else { start[0]--; }
	const startStr = start.join(",");
	delete portalsIndex["AA"];
	
	let end = portalsIndex["ZZ"][0];
	map[end[0]][end[1]] = "#";
	if (map[end[0]][end[1] + 1] === ".") { end[1]++; }
	else if (map[end[0]][end[1] - 1] === ".") { end[1]--; }
	else if (map[end[0] + 1][end[1]] === ".") { end[0]++; }
	else { end[0]--; }
	const endStr = end.join(",");
	delete portalsIndex["ZZ"];

	const portals: utils.StringKeyedObject<string> = {};
	for (const key in portalsIndex) {
		const portal = portalsIndex[key].map(xy => xy.join(","));
		portals[portal[0]] = portal[1];
		portals[portal[1]] = portal[0];
	}

	return [
		__pathfindAAZZ(map, portals, startStr, endStr),
		__pathfindAAZZ(map, portals, startStr, endStr, true),
	];
	
}

function __pathfindAAZZ(
	map: string[][], 
	portals: utils.StringKeyedObject<string>,
	startStr: string,
	endStr: string,
	isRecursive: boolean = false,
): number {
	const horizontalEdges = [1, map.length - 2];
	const verticalEdges = [1, map[0].length - 2];
	const queue: utils.IDijkstraQueue = { 0: [startStr + ",0"] };
	const visited: Set<string> = new Set();
	visited.add(startStr);
	let steps = 0;

	while (true) {

		while (!queue[steps] || !queue[steps].length) {
			delete queue[steps];
			steps++;
		}

		const current = queue[steps].shift()!;
		const [x, y, level] = current.split(",").map(n => +n);
		const nexts = [[0, 1], [1, 0], [0, -1], [-1, 0]].map(move => [x + move[0], y + move[1]]);

		for (const next of nexts) {

			const char = map[next[0]][next[1]];
			if (char === "#" || char === " ") { continue; } // Wall or empty space past portal

			let nextStr = next.join(","); // x,y
			if (nextStr === endStr && !level) { return steps + 1; } // Level 0; Portal ZZ; we're finished
			
			// If we've been here, don't go back
			let nextStrLvl = nextStr + "," + level; // x,y,level
			if (visited.has(nextStrLvl)) { continue; }
			visited.add(nextStrLvl);

			// Ordinary step; no portal business
			if (char !== "@") {
				(queue[steps + 1] ||= []).push(nextStrLvl);
				continue;	
			}

			// IT'S PORTAL TIME
			const nextLevel = isRecursive
				? horizontalEdges.includes(next[0]) || verticalEdges.includes(next[1])
					? level - 1
					: level + 1
				: 0;
			if (nextLevel < 0) { continue; } // Dead end; can't step outside outermost layer
			
			// Mark both ends of portal as visited
			nextStrLvl = portals[nextStr] + "," + nextLevel;
			visited.add(nextStrLvl);

			// Don't penalize the portal jump with another step; just go there
			queue[steps].push(nextStrLvl);
			continue;
		}
	}
}

function __isLetter(char: string): boolean {
	return !!char && char !== char.toLowerCase();
}