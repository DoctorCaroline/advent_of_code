import * as utils from "../../AdventOfCodeUtils";

/** Day 12 Solution */
export function solution(rawMap: string[]): utils.Solution {

	const map = rawMap.map(row => row.split(""));
	
	const assessed: utils.StringKeyedObject<true> = {};
	const toAssess: utils.StringKeyedObject<true> = { "0,0": true };

	const prices = [0, 0];
	while (utils._countObjectNodes(toAssess)) {

		const start: number[] = [];
		for (const plot in toAssess) {
			start.push(...plot.split(",").map(n => +n));
			break;
		}

		const plotType = map[start[0]][start[1]];

		let area = 0;
		let perimeter: number[][][] = [];
		
		const inPlot = [ start.toString() ];
		while (inPlot.length) {

			const current = inPlot.pop()!;
			assessed[current] = true;
			delete toAssess[current];
			area++;

			const coords = current.split(",").map(n => +n);
			const adjacents = [
				[coords[0] - 1, coords[1]],
				[coords[0] + 1, coords[1]],
				[coords[0], coords[1] - 1],
				[coords[0], coords[1] + 1],
			];
			for (const adjacent of adjacents) {
				const adjacentType = map[adjacent[0]]?.[adjacent[1]];
				const adjacentKey = adjacent.toString();
				if (adjacentType === plotType) {
					if (!inPlot.includes(adjacentKey) && !assessed[adjacentKey]) { inPlot.push(adjacentKey); }
				}
				else if (!adjacentType) {
					perimeter.push([coords, adjacent]);
				}
				else {
					perimeter.push([coords, adjacent]);
					if (!assessed[adjacentKey]) { toAssess[adjacentKey] = true; }
				}

			}
		}

		prices[0] += area * perimeter.length;

		const areAdjacent = (edgeA: number[][], edgeB: number[][]) => {
			for (const axis of [0, 1]) {
				if (
					edgeA[0][axis] === edgeB[0][axis]
					&& edgeA[1][axis] === edgeB[1][axis]
					&& edgeA[0][axis ^ 1] - edgeB[0][axis ^ 1] === edgeA[1][axis ^ 1] - edgeB[1][axis ^ 1]
					&& Math.abs(edgeA[0][axis ^ 1] - edgeB[0][axis ^ 1]) === 1
				) {
					return true;
				}
			}
			return false;
		};

		let sides = 0;
		while (perimeter.length) {
			sides++;
			const units = [perimeter.shift()!];
			while (units.length) {
				const unit = units.shift()!;
				for (let i = 0; i < perimeter.length; i++) {
					if (areAdjacent(perimeter[i], unit)) {
						units.push(...perimeter.splice(i--, 1));
					}
				}
			}
		}

		prices[1] += area * sides;
	}

	return prices;
}