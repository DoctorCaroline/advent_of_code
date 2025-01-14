import * as utils from "../../AdventOfCodeUtils";

/** Day 18 Solution */
export function solution(rawInput: string[]): utils.Solution {
	const expressions: ExpressionAtom[][] = [];
	for (const expression of rawInput) {
		expressions.push(
			expression.replace(/ /g, "")
				.split("")
				.map(n => isNaN(+n) ? n : +n) as ExpressionAtom[]
		);
	}

	const out = [0, 0];
	for (const expression of expressions) {
		out[0] += __evaluate([...expression]);
		out[1] += __evaluate([...expression], true);
	}
	
	return out;
}

function __evaluate(expression: ExpressionAtom[], addFirst: boolean = false): number {
	let flat: FlatExpressionAtom[] = [__getNextNumber(expression, addFirst)];
	while (true) {
		const op = expression.shift();
		switch (op) {
			case ")":
			case undefined:
				return __evaluateFlatExpression(flat, addFirst);
			case "*":
			case "+":
				flat.push(op, __getNextNumber(expression, addFirst));
		}
	}
}

function __getNextNumber(expression: ExpressionAtom[], addFirst: boolean = false): number {
	const next = expression.shift();
	return next === "("
		? __evaluate(expression, addFirst)
		: next as number;
}

function __evaluateFlatExpression(expression: FlatExpressionAtom[], addFirst: boolean = false): number {
	for (let ix = 0; ix < expression.length - 2; ix += 2) {
		switch (expression[ix + 1]) {
			case "+":
				(expression[ix + 2] as number) += (expression[ix] as number);
				expression.splice(ix, 2);
				ix -= 2;
				break;
			case "*":
				if (addFirst) { continue; }
				(expression[ix + 2] as number) *= (expression[ix] as number);
				expression.splice(ix, 2);
				ix -= 2;
				break;
		}
	}
	return expression.length > 1
		? __evaluateFlatExpression(expression, false)
		: expression[0] as number;
}

type ExpressionAtom = FlatExpressionAtom | "(" | ")";
type FlatExpressionAtom = number | "+" | "*";