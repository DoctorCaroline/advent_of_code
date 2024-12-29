/** Day 5 Solution */
export function solution(input: string[]): { toString: Function }[] {
	const rules: string[][] = [];
	const sequences = [];
	while (input.length) {
		const line = input.shift()!;
		if (line.match(/^\d+\|\d+$/)) {
			rules.push(line.split("|"));
		}
		else if (line.match(/^\d+(,\d+)+$/)) {
			sequences.push(line.split(","));
		}
	}

	const getApplicableRules = (sequence: string[]) => rules.filter(rule => sequence.includes(rule[0]) && sequence.includes(rule[1]));

	const isValid = (...sequence: string[]) => {
		const applicableRules = getApplicableRules(sequence);
		let current: string;
		const seen: string[] = [];
		while (sequence.length) {
			current = sequence.shift()!;
			const currentRules = applicableRules.filter(rule => rule[1] === current);
			if (!currentRules.every(rule => seen.includes(rule[0]))) { return false; }
			seen.push(current);
		}
		return true;
	};

	const validSequences = [];
	const invalidSequences = [];
	for (const sequence of sequences) {
		isValid(...sequence)
			? validSequences.push(sequence)
			: invalidSequences.push(sequence);
	}

	for (const sequence of invalidSequences) {
		const applicableRules = getApplicableRules(sequence);
		sequence.sort((a, b) => {
			for (const rule of applicableRules) {
				if ((rule[0] !== a && rule[0] !== b) || (rule[1] !== a && rule[1] !== b)) { continue; }
				return rule[0] === a ? -1 : 1;
			}
			return 0;
		});
	}

	const sums = [0, 0];
	for (const sequence of sequences) {
		sums[+invalidSequences.includes(sequence)] += +sequence[(sequence.length - 1) / 2];
	}
	return sums;
};