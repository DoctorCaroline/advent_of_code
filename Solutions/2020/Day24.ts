import * as utils from "../../AdventOfCodeUtils";

/** Day 24 Solution */
export function solution(rawInput: string[]): utils.Solution {

	const instructions: (keyof typeof HexDirection)[][] = [];

	let currentInstruction: (keyof typeof HexDirection)[];
	for (const line of rawInput) {
		currentInstruction = [];
		const matches = line.matchAll(/(nw|ne|e|se|sw|w)/g);
		for (const match of matches) {
			currentInstruction.push(match[0] as keyof typeof HexDirection);
		}
		instructions.push(currentInstruction);
	}

	let blackTiles: Set<string> = new Set();

	// For each instruction path, flip the tile at the end
	for (const instruction of instructions) {
		const cursor = [0, 0];
		for (const direction of instruction) {
			cursor[0] += HexDirection[direction][0];
			cursor[1] += HexDirection[direction][1];
		}
		const key = cursor.join(",");
		blackTiles.has(key)
			? blackTiles.delete(key)
			: blackTiles.add(key);
	}

	const out = [blackTiles.size];

	const getNeighbors = (tileStr: string) => {
		const tile = tileStr.split(",").map(n => +n);
		const neighbors: string[] = [];
		for (const direction in HexDirection) {
			neighbors.push([0, 1].map(axis => tile[axis] + HexDirection[direction][axis]).join(","));
		}
		return neighbors;
	};

	for (let day = 0; day < 100; day++) {
		// Generate a complete set of all tiles that *might* be black after the next step
		const toSample: Set<string> = new Set(blackTiles);
		for (const tile of blackTiles) {
			getNeighbors(tile).forEach(neighbor => toSample.add(neighbor));
		}

		// Evaluate neighbors to determine whether tile is black next step
		const newTiles: Set<string> = new Set();
		for (const tile of toSample) {
			const blackNeighbors = getNeighbors(tile).reduce((total, neighbor) => total + +blackTiles.has(neighbor), 0);
			switch (blackNeighbors) {
				case 1:
					if (!blackTiles.has(tile)) { break; }
				case 2:
					newTiles.add(tile);
			}
		}

		blackTiles = newTiles;
	}

	out.push(blackTiles.size);
	return out;
}

/*
	Hexagonal Coordinate System
	~~~~~~~~~~~~~~~~~~~~~~~~~~~
			NW			NE
			(0, 1)		(1, 1)

	W			Origin		E
	(-1, 0)		(0, 0)		(1, 0)

		SW			SE
		(-1, -1)	(0, -1)
*/
const HexDirection: utils.StringKeyedObject<number[]> = {
	nw: [0, 1],
	ne: [1, 1],
	e: [1, 0],
	se: [0, -1],
	sw: [-1, -1],
	w: [-1, 0],
}