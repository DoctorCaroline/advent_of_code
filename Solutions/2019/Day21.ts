import * as utils from "../../AdventOfCodeUtils";
import { IntcodeRuntime } from "./Intcode";

/** Day 21 Solution */
export function solution(rawInput: string[]): utils.Solution {
	const program = rawInput[0].split(",").map(n => +n);
	const intcoder = new IntcodeRuntime();

	// (~C & D) | ~A
	const input1 =
		"NOT C J\n" +
		"AND D J\n" +
		"NOT A T\n" +
		"OR T J\n" +
		"WALK\n";
	const asciiInput1 = input1.split("").map(char => char.charCodeAt(0));
	const output1 = intcoder.run(program, asciiInput1);
	// console.log(String.fromCharCode(...output1)); // Trial and error

	// (D & (H | E) & ~(A & B & C)) | ~A
	const input2 =
		"OR D J\n" +
		"OR H T\n" +
		"OR E T\n" +
		"AND T J\n" +
		"OR A T\n" +
		"AND B T\n" +
		"AND C T\n" +
		"NOT T T\n" +
		"AND T J\n" +
		"NOT A T\n" +
		"OR T J\n" +
		"RUN\n";
	const asciiInput2 = input2.split("").map(char => char.charCodeAt(0));
	const output2 = intcoder.run(program, asciiInput2);
	// console.log(String.fromCharCode(...output2)); // Trial and error

	return [output1.pop()!, output2.pop()!];
}