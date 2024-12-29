/** Day 1 Solution */
export function solution(lists: string[]): { toString: Function }[] {
	
	const left: number[] = [];
	const right: number[] = [];

	lists.forEach(line => {
		const split = line.split(" ");
		left.push(+split.shift()!);
		right.push(+split.pop()!);
	});

	left.sort();
	right.sort();

	let dist = 0;
	let rCurs = 0;
	let sim = 0;

	for (const el in left) {
		dist += Math.abs(left[el] - right[el]);
		var matches = 0;
		while (right[rCurs] <= left[el]) {
			matches += +(right[rCurs++] === left[el]);
		}
		sim += matches * left[el];
	}

	return [dist, sim];
};