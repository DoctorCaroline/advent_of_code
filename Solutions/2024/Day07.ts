/** Day 7 Solution */
export function solution(rawTests: string[]): { toString: Function }[] {
	
	const tests: Test[] = rawTests.map(test => {
		const split = test.replace(":", "").split(" ");
		return { value: +split[0], operands: split.slice(1).map(n => +n) };
	});

	const evaluate: RuleEvaluator = (value: number, operands: number[], mode: TestMode) => {
		if (operands[0] > value) { return false; }
		if (operands.length === 1) {
			return value === operands[0];
		}

		const left = operands[0]!;
		const right = operands[1]!;
		const rest = operands.slice(2);
		
		return evaluate(value, [left + right, ...rest], mode)
			|| evaluate(value, [left * right, ...rest], mode)
			|| (mode === TestMode.ternary && evaluate(value, [+`${left}${right}`, ...rest], mode));
	};

	const out = [0, 0];

	for (const test of tests) {
		const { operands, value } = test;
		if (evaluate(value, operands, TestMode.binary)) { out[0] += test.value; out[1] += test.value; }
		else if (evaluate(value, operands, TestMode.ternary)) { out[1] += test.value; }
	}

	return out;
};

interface Test {
	value: number;
	operands: number[];
}

enum TestMode {
	binary,
	ternary,
}

type RuleEvaluator = (value: number, operands: number[], mode: TestMode) => boolean;