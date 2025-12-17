import * as utils from "../../AdventOfCodeUtils";

/** Day 23 Solution */
export function solution(rawInput: string[]): utils.Solution {

	//rawInput = ["389125467"];

	const start = utils._makeLinkedList(rawInput[0].split("").map(n => +n))!;
	let current = start;

	// Close the linked list loop on itself
	while (current.next !== null) { current = current.next; }
	current.next = start;
	start.prev = current;
	current = start;

	for (let _ = 0; _ < 100; _++) {
		const spliceLeft = current;
		let target = current.value - 1;
		const extract: number[] = [];
		for (let __ = 0; __ < 3; __++) {
			current = current.next!;
			extract.push(current.value);
		}
		current = current.next!;
		current.prev = spliceLeft;
		spliceLeft.next = current;
		while (target < 1 || extract.includes(target)) {
			if (target < 1) { target = 9; }
			if (extract.includes(target)) { target--; }
		}
		while (current.value !== target) { current = current.next!; }
		while (extract.length) { utils._linkedListInsertAfter(current, extract.pop()!); }
		current = spliceLeft.next!;
	}

	const out = [""];
	while (current.value !== 1) { current = current.next!; }
	while (current.next!.value !== 1) {
		current = current.next!;
		out[0] += current.value;
	}

	return out;
}