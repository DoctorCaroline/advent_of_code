import * as utils from "../../AdventOfCodeUtils";

/** Day 8 Solution */
export function solution(rawInput: string[]): utils.Solution {
	const rawSif = rawInput[0].split("");
	const width = 25;
	const height = 6;
	const layers: number[][][] = [];
	let layer: number[][] = [];
	let row: number[] = [];
	while (rawSif.length) {
		row.push(+rawSif.shift()!);
		if (row.length === width) {
			layer.push(row);
			row = [];
			if (layer.length === height) {
				layers.push(layer);
				layer = [];
			}
		}
	}
	
	const digitTotals = (layer: number[][]) => {
		const counts = [0, 0, 0];
		for (const row of layer) {
			for (const pixel of row) {
				counts[pixel]++;
			}
		}
		return counts;
	};
	
	let leastZeroestLayer = [height * width];
	for (const layer of layers) {
		const totals = digitTotals(layer);
		if (totals[0] < leastZeroestLayer[0]) {
			leastZeroestLayer = totals;
		}
	}
	
	const image: string[] = [];
	for (let row = 0; row < height; row++) {
		for (let col = 0; col < width; col++) {
			let layer;
			for (layer = 0; layers[layer][row][col] === 2; layer++) {}
			image.push(!layers[layer][row][col] ? " " : "#");
		}
		image.push("\n");
	}
	
	return [leastZeroestLayer[1] * leastZeroestLayer[2], image.join("")];
};