import * as utils from "../../AdventOfCodeUtils";
import { IntcodeRuntime } from "./Intcode";

/** Day 19 Solution */
export function solution(rawInput: string[]): utils.Solution {
	const program = rawInput[0].split(",").map(n => +n);
	const intcoder = new IntcodeRuntime();

	const isInBeam = utils._memo((x: number, y: number) => intcoder.run(program, [x, y])[0]);
	const canFit100 = (x: number, y: number) => x >= 0 && y >= 0 && isInBeam(x + 99, y) && isInBeam(x, y + 99);

	let total = 0;
	let spot = [0, 0];
	for (let x = 0; x < 50; x++) {
		for (let y = 0; y < 50; y++) {
			const inBeam = isInBeam(x, y);
			total += inBeam;
			inBeam && (spot = [x, y]);

		}
	}

	while (true) {
		if (canFit100(spot[0], spot[1])) { return [total, 10000 * spot[0] + spot[1]]; }
		if (!isInBeam(spot[0] + 99, spot[1])) {
			while (!isInBeam(spot[0] + 99, spot[1])) { spot[1]++; }
			continue;
		}
		while (!isInBeam(spot[0], spot[1] + 99)) { spot[0]++; }
	}
}