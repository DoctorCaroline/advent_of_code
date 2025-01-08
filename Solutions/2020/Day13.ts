import * as utils from "../../AdventOfCodeUtils";

/** Day 13 Solution */
export function solution(rawInput: string[]): utils.Solution {

	const staticTimestamp: number = +rawInput[0];
	const buses: number[] = rawInput[1].split(",").map(n => +n);

	let shortestWait = Number.MAX_SAFE_INTEGER;
	let timestamp = 0;
	let cycleLength = 1;
	const out = [0, 0];
	for (const time in buses) {
		const bus = buses[time];
		if (isNaN(bus)) { continue; }

		// Part 1 logic
		const nextArrival = bus * Math.ceil(staticTimestamp / bus);
		const wait = nextArrival - staticTimestamp;
		if (wait < shortestWait) {
			shortestWait = wait;
			out[0] = shortestWait * bus;
		}

		// Part 2 logic
		while ((out[1] + +time) % bus) { out[1] += cycleLength; }
		cycleLength = utils._lcm(cycleLength, bus);
	}
	return out;
}