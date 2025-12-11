import * as utils from "../../AdventOfCodeUtils";

/** Day 11 Solution */
export function solution(rawInput: string[]): utils.Solution {

	const network: utils.StringKeyedObject<string[]> = {}
	for (const line of rawInput) {
		const match = line.match(/^([a-z]{3}): ([a-z]{3}( [a-z]{3})*)$/)!;
		network[match[1]] = match[2].split(" ");
	}

	const traverseNetwork =	utils._memo((node: string, targets: string[] = []) => {
		if (node === "out") { return +!targets.length; }
		let paths = 0;
		for (const next of network[node]) {
			if (targets.includes(node)) {
				targets = targets.filter(n => n !== node);
			}
			paths += traverseNetwork(next, targets);
		}
		return paths;
	});

	return [
		traverseNetwork("you"),
		traverseNetwork("svr", ["dac", "fft"]),
	];
}