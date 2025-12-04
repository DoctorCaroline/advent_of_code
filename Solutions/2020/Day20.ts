import * as utils from "../../AdventOfCodeUtils";

const __invertInt = utils._memo((num: number) => {
	return Number.parseInt(num.toString(2).padStart(10, "0").split("").reverse().join(""), 2);
});

/** Day 20 Solution */
export function solution(rawInput: string[]): utils.Solution {

	const tiles: utils.NumberKeyedObject<BinStr[][]> = {};

	let currentTile: BinStr[][] = [];
	for (const line of rawInput) {
		
		if (!line) { continue; }

		const newTile = line.match(/^Tile (\d+):$/);
		if (newTile) {
			currentTile = [];
			tiles[+newTile[1]] = currentTile;
			continue;
		}

		currentTile.push(line.split("").map(char => (char === "#") ? "1" : "0"));
	}

	const tileEdges: utils.NumberKeyedObject<number[][]> = {};
	const tileIndex: utils.NumberKeyedObject<utils.NumberKeyedObject<boolean>> = {};

	for (const id in tiles) {

		const tile = tiles[id];
		const edges: number[] = [];

		// Top edge >
		edges.push(Number.parseInt(tile[0].join(""), 2));
		// Right edge v
		edges.push(Number.parseInt(tile.map(row => row[row.length - 1]).join(""), 2));
		// Bottom edge <
		edges.push(Number.parseInt([...tile[tile.length - 1]].reverse().join(""), 2));
		// Left edge ^
		edges.push(Number.parseInt(tile.map(row => row[0]).reverse().join(""), 2));

		const flippedEdges = [edges[0], edges[3], edges[2], edges[1]].map(n => __invertInt(n));

		tileEdges[id] = [edges, flippedEdges];

		for (const edge of tileEdges[id].flat()) {
			(tileIndex[edge] ||= {})[id] = true;
		}
	}

	const out = [1, 0];
	const seen: utils.StringKeyedObject<number> = {};
	for (const edge in tileIndex) {
		const tileCount = utils._countObjectNodes(tileIndex[edge]);
		if (tileCount > 1) { continue; }
		for (const tile in tileIndex[edge]) {
			seen[tile] ||= 0;
			seen[tile]++;
			if (seen[tile] === 4) {
				out[0] *= +tile
				console.log(tile);
			}
		}
	}

	return out;
}

type BinStr = `${0 | 1}`;