import * as utils from "../../AdventOfCodeUtils";

/** Day 8 Solution */
export function solution(rawMap: string[]): utils.Solution {

	const map = rawMap.map(row => row.split(""));

	const antennae: utils.StringKeyedObject<number[][]> = {};
	const antinodes: utils.StringKeyedObject<true>[] = [{}, {}];

	const max = [map.length, map[0].length];

	for (const rowIx in map) {
		for (const colIx in map[rowIx]) {
			const freq = map[rowIx][colIx];
			if (freq === ".") { continue; }
			antennae[freq] ||= [];
			antennae[freq].push([+rowIx, +colIx]);
		}
	}

	for (const frequency in antennae) {
		const sites = antennae[frequency];
		for (let i = 0; i < sites.length - 1; i++) {
			for (let j = i + 1; j < sites.length; j++) {
				const left = sites[i];
				const right = sites[j];

				const antis = [[0, 0], [0, 0], [0, 0], [0, 0]];
				for (const coord of [0, 1]) {
					antis[0][coord] = (2 * left[coord] + right[coord]) / 3;
					antis[1][coord] = (left[coord] + 2 * right[coord]) / 3;
					antis[2][coord] = 2 * right[coord] - left[coord];
					antis[3][coord] = 2 * left[coord] - right[coord];
				}
				for (const antinode of antis) {
					if (antinode.some((coord, axis) => 
						Math.floor(coord) !== coord
						|| coord >= max[axis]
						|| coord < 0
					)) { continue; }
					antinodes[0][antinode.toString()] = true;
				}

				const line = utils._linearFit(left, right);

				for (let x = 0; x < max[0]; x++) {
					const y = line(x);
					if (
						y%1
						|| y < 0
						|| y >= max[1]
					) { continue; }
					antinodes[1][[x, y].toString()] = true;
				}
			}
		}
	}

	return antinodes.map(obj => utils._countObjectNodes(obj));
}