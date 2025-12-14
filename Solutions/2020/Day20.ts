import * as utils from "../../AdventOfCodeUtils";

/** Day 20 Solution */
export function solution(rawInput: string[]): utils.Solution {
	
	// This solution involves a lot of flipping and rotating
	// Alternating between these two matrix operations results in iterating through all 8 orientations
	const operations = [utils._flipRows, utils._transpose];

	const tiles: utils.NumberKeyedObject<BitStr[][]> = {};
	const tileEdges: utils.NumberKeyedObject<number[]> = {};
	const edgeIndex: utils.NumberKeyedObject<Set<number>> = {};


	let currentTile: BitStr[][] = [];
	let currentID = 0;
	let totalTiles = 0;
	for (const line of rawInput) {
		// End of tile; evaluate edges as bitmasks and index their values
		if (!line) {
			const edges = __evaluateEdges(currentTile, true);
			tileEdges[currentID] = edges;
			edges.forEach(edge => (edgeIndex[edge] ||= new Set()).add(+currentID));
			continue;
		}
		
		// New tile; instantiate a new array and file it by ID
		const newTile = line.match(/^Tile (\d+):$/);
		if (newTile) {
			currentID = +newTile[1];
			currentTile = [];
			tiles[+newTile[1]] = currentTile;
			totalTiles++;
			continue;
		}

		// Tile line; push to tile
		currentTile.push(line.split("").map(char => (char === "#") ? "1" : "0"));
	}

	// Generate linked network
	const tileNetwork: utils.NumberKeyedObject<Set<number>> = {}
	for (const edge in edgeIndex) {
		const tiles = edgeIndex[edge];
		if (tiles.size < 2) { continue; }
		for (const tile1 of tiles) {
			for (const tile2 of tiles) {
				if (tile1 === tile2) { continue; }
				(tileNetwork[tile1] ||= new Set()).add(tile2);
			}
		}
	}

	// Find doubly-linked nodes in network (image corners, only two neighbors)
	const out = [1, 0];
	let startingCorner: number | null = null;
	for (const id in tileNetwork) {
		if (tileNetwork[+id].size > 2) { continue; }
		startingCorner ||= +id;
		out[0] *= +id;
	}

	if (!startingCorner) { throw new Error("No corners found!"); }

	// Construct first row of grid
	const addedToGrid: Set<number> = new Set([startingCorner]);
	const firstRow: number[] = [startingCorner];
	while (true) {
		const currentTile = firstRow[firstRow.length - 1];
		const links = tileNetwork[currentTile];
		for (const nextTile of links) {
			if (tileNetwork[nextTile].size === 4 || addedToGrid.has(nextTile)) {
				continue;
			}
			firstRow.push(nextTile);
			addedToGrid.add(nextTile);
			break;
		}
		if (tileNetwork[firstRow[firstRow.length - 1]].size === 2) {
			break;
		}
	}

	// Fill the rest of the grid
	const tileGrid: number[][] = [firstRow];
	while (tileGrid.length * firstRow.length < totalTiles) {
		const currentRow: number[] = [];
		const previous = tileGrid.length - 1;
		tileGrid.push(currentRow);
		for (let col = 0; col < tileGrid[previous].length; col++) {
			const previousTile = tileGrid[previous][col];
			const links = tileNetwork[previousTile];
			for (const nextTile of links) {
				if (addedToGrid.has(nextTile)) { continue; }
				currentRow.push(nextTile);
				addedToGrid.add(nextTile);
				break;
			}
		}
	}

	// Instantiate empty grid to populate with raw image
	const tiledImageGrid: BitStr[][][][] = tileGrid.map(row => row.map(_ => []));

	// Ensure starting corner properly oriented, then insert
	let firstTile = tiles[startingCorner];
	while (true) {
		const edges = __evaluateEdges(firstTile);
		if (tileEdges[tileGrid[0][1]].includes(edges[1]) && tileEdges[tileGrid[1][0]].includes(edges[2])) {
			break;
		}
		firstTile = operations[0](firstTile);
		operations.push(operations.shift()!);
	}
	tiledImageGrid[0][0] = firstTile;

	// Fill tiled image grid, ensuring edges line up
	for (let row = 0; row < tiledImageGrid.length; row++) {
		for (let col = 0; col < tiledImageGrid[0].length; col++) {
			if (!row && !col) { continue; }
			const tileAbove = tiledImageGrid[row - 1]?.[col] ?? null;
			const topMatch = tileAbove && utils._invertInt(__evaluateEdges(tileAbove)[2], 10);
			const tileLeft = tiledImageGrid[row][col - 1] ?? null;
			const leftMatch = tileLeft && utils._invertInt(__evaluateEdges(tileLeft)[1], 10);
			let currentTile = tiles[tileGrid[row][col]];
			while (true) {
				const edges = __evaluateEdges(currentTile);
				if ((!tileAbove || topMatch === edges[0]) && (!tileLeft || leftMatch === edges[3])) {
					tiledImageGrid[row][col] = currentTile;
					break;
				}
				currentTile = operations[0](currentTile);
				operations.push(operations.shift()!);
			}
		}
	}

	// Stitch everything together
	const tileSize = tiledImageGrid[0][0].length;
	const stitchedImage: BitStr[][] = [];
	while (tiledImageGrid.length) {
		const currentGridRow = tiledImageGrid.shift()!;
		while (currentGridRow[0].length) {
			let imageRow: BitStr[] = [];
			for (const tile of currentGridRow) {
				const tileRow = tile.shift()!;
				imageRow.push(...tileRow);
			}
			stitchedImage.push(imageRow);
		}
	}

	// Remove stitches
	const isEdgeIndex = <T>(_: T, index: number) => (index + 1) % tileSize > 1;
	let image = stitchedImage.filter(isEdgeIndex).map(row => row.filter(isEdgeIndex));

	const monster = [
		"                  # ",
		"#    ##    ##    ###",
		" #  #  #  #  #  #   ",
	].map(row => row.split("").map(char => char === "#" ? "1" : "0"));
	const monsterSize = monster.flat().filter(char => char === "1").length;

	out[1] = utils._sum(image.map(row => row.reduce((sum, value) => sum += +value, 0)));
	image = utils._flipCols(utils._flipRows(image));
	let monstersFound = 0;
	while (!monstersFound) {
		for (let row = 0; row < image.length - monster.length; row++) {
			for (let col = 0; col < image[0].length - monster[0].length; col++) {
				let isMatch = true;
				for (let monsterRow = 0; monsterRow < monster.length; monsterRow++) {
					for (let monsterCol = 0; monsterCol < monster[0].length; monsterCol++) {
						if (image[row + monsterRow][col + monsterCol] === "0" && monster[monsterRow][monsterCol] === "1") {
							isMatch = false;
							break;
						}
					}
					if (!isMatch) { break; }
				}
				if (!isMatch) { continue; }
				monstersFound++;
			}
		}
		if (monstersFound) { break; }
		image = operations[0](image);
		operations.push(operations.shift()!);
	}

	out[1] -= monsterSize * monstersFound;
	return out;
}

function __evaluateEdges(tile: BitStr[][], includeFlipped: boolean = false): number[] {
	const edges: number[] = [];
	const orientations = [tile];
	if (includeFlipped) orientations.push(utils._flipCols(tile));
	for (const orientation of [tile, utils._flipCols(tile)]) {
		if (!orientation[0]) { debugger; }
		// Top edge >
		edges.push(Number.parseInt(orientation[0].join(""), 2));
		// Right edge v
		edges.push(Number.parseInt(orientation.map(row => row[row.length - 1]).join(""), 2));
		// Bottom edge <
		edges.push(Number.parseInt([...orientation[orientation.length - 1]].reverse().join(""), 2));
		// Left edge ^
		edges.push(Number.parseInt(orientation.map(row => row[0]).reverse().join(""), 2));
	}
	return edges;
}

type BitStr = `${0 | 1}`;