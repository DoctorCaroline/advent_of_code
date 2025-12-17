import * as utils from "../../AdventOfCodeUtils";

/** Day 23 Solution */
export function solution(rawInput: string[]): utils.Solution {
	return [false, true].map(part2 => __solve(rawInput, part2));
}

function __solve(rawInput: string[], isPart2: boolean): number {
	const [cupsMax, stepsMax] = isPart2
		? [10 ** 6, 10 ** 7]
		: [9, 100];

	const cups: utils.NumberKeyedObject<utils.LinkedListEntry<number>> = {};
	const start = utils._makeLinkedList(rawInput[0].split("").map(n => +n))!;
	let current = start;

	// Close the linked list loop on itself
	while (current.next !== null) {
		cups[current.value] = current;
		current = current.next;
	}
	cups[current.value] = current;
	current.next = start;
	start.prev = current;
	current = start;

	// Splice in additional entries for Part 2
	for (let cup = 10; cup <= cupsMax; cup++) {
		const entry = utils._linkedListInsertBefore(current, cup);
		cups[cup] = entry;
	}

	// Iterate the designated number of steps
	for (let step = 0; step < stepsMax; step++) {
		// Grab references to all loop entries involved
		const spliceLeft = current;
		const excerptLeft = spliceLeft.next!;
		const excerptMiddle = current.next!.next!;
		const excerptRight = current.next!.next!.next!;
		const spliceRight = current.next!.next!.next!.next!;

		// Snip out excerpt by directly linking the ends
		spliceLeft.next = spliceRight;
		spliceRight.prev = spliceLeft;

		// Acquire the next target node
		let target = current.value - 1;
		while (true) {
			if (target < 1) {
				target = cupsMax;
				continue;
			}
			if (excerptLeft.value === target || excerptMiddle.value === target || excerptRight.value === target) {
				target--;
				continue;
			}
			break;
		}

		// Splice excerpt into new location
		const newLeft = cups[target];
		const newRight = newLeft.next!;
		newLeft.next = excerptLeft;
		excerptLeft.prev = newLeft;
		newRight.prev = excerptRight;
		excerptRight.next = newRight;

		// Advance cursor for next iteration
		current = current.next!;
	}

	current = cups[1];

	if (isPart2) {
		return current.next!.value * current.next!.next!.value;
	}

	let out = "";
	while (current.next!.value !== 1) {
		current = current.next!;
		out += current.value;
	}
	return +out;
}