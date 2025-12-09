import * as utils from "../../AdventOfCodeUtils";

/** Day 9 Solution */
export function solution(rawInput: string[]): utils.Solution {

	const pairs = rawInput.map(line => line.split(",").map(n => +n));
	
	const out = [0, 0];
	for (let first = 0; first < pairs.length - 1; first++) {
		for (let second = first + 1; second < pairs.length; second++) {
			const rect1 = pairs[first];
			const rect2 = pairs[second];
			const area = (Math.abs(rect1[0] - rect2[0]) + 1) * (Math.abs(rect1[1] - rect2[1]) + 1);

			if (area > out[0]) { out[0] = area; }
			if (area <= out[1]) { continue; }

			let valid = true;
			for (const index in pairs) {
				const peri1 = pairs[index];
				const peri2 = pairs[(+index + 1) % pairs.length];
				if (!__crossesInterior(peri1, peri2, rect1, rect2)) { continue; }
				valid = false;
				break;
			}
			if (valid) { out[1] = area; }
		}
	}
	return out;
}

function __crossesInterior(...points: number[][]): boolean {
	// Conditionally flip symmetry for fewer cases to test
	// Forces all perimeter lines to be vertical
	if (points[0][0] === points[1][0]) {
		points = points.map(point => [point[1], point[0]]);
	}
	
	const [peri1, peri2, rect1, rect2] = points;
	
	const topEdge = Math.min(rect1[0], rect2[0]);
	const bottomEdge = Math.max(rect1[0], rect2[0]);
	const leftEdge = Math.min(rect1[1], rect2[1]);
	const rightEdge = Math.max(rect1[1], rect2[1]);

	// Too far left or right
	if (peri1[1] <= leftEdge || peri1[1] >= rightEdge) { return false; }
	// Line completely above top edge
	if (peri1[0] <= topEdge && peri2[0] <= topEdge) { return false; }
	// Line completely below bottom edge
	if (peri1[0] >= bottomEdge && peri2[0] >= bottomEdge) { return false; }

	return true;
}