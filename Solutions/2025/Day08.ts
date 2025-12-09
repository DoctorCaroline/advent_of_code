import * as utils from "../../AdventOfCodeUtils";

/** Day 8 Solution */
export function solution(rawInput: string[]): utils.Solution {

	const boxes: number[][] = rawInput.map(rawBox => rawBox.split(",").map(coord => +coord));
	const circuits: Set<string>[] = [];
	const connections: utils.Heap<[string, number]> = new utils.Heap((a, b) => a[1] - b[1]);
	
	// Iterate pairwise over boxes and index each pair by distance
	for (let first = 0; first < boxes.length - 1; first++) {
		for (let second = first + 1; second < boxes.length; second++) {
			const box1 = boxes[first];
			const box2 = boxes[second];
			const distance = utils._squareEuclideanDistance(box1, box2);
			const pair = `${box1.join(",")};${box2.join(",")}`;
			connections.add([pair, distance]);
		}
	}
	
	const out = [0, 0];
	
	// For each pair, starting with the shortest distance, add to circuits
	let count = 0;
	for (const connection of connections.drain()) {

		// After 1000 connections, calculate biggest three
		if (count++ === 1000) { out[0] = __calculateBiggestThree(circuits); }

		const [box1, box2] = connection[0].split(";");
		
		// Identify existing circuits (maximum 2)
		const found: number[] = [];
		for (let idx = 0; idx < circuits.length && found.length < 2; idx++) {
			const circuit = circuits[idx];
			if (!circuit.has(box1) && !circuit.has(box2)) { continue; }
			found.push(idx);
		}

		// Integrate into existing circuits or append a new one
		switch (found.length) {
			case 0:
				circuits.push(new Set([box1, box2]));
				break;
			case 1:
				const circuit = circuits[found[0]];
				circuit.add(box1).add(box2);
				break;
			case 2:
				circuits[found[1]].forEach(box => circuits[found[0]].add(box));
				circuits.splice(found[1], 1);
				break;
		}

		// Check for exit case (single circuit consisting of all junction boxes)
		if (circuits.length === 1 && circuits[0].size === rawInput.length) {
			out[1] = +box1.split(",")[0] * +box2.split(",")[0];
			return out;
		}
	}

	throw new Error("This statement should be unreachable. Should have an answer before the heap is consumed.");
}

function __calculateBiggestThree(circuits: Set<string>[]): number {
	const biggestThree: number[] = [];
	for (const circuit of circuits) {
		biggestThree.push(circuit.size);
		biggestThree.sort((a, b) => a - b);
		while (biggestThree.length > 3) { biggestThree.shift(); }
	}
	return utils._product(biggestThree);
}