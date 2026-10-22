import * as utils from "../../AdventOfCodeUtils";
import { IntcodeRuntime } from "./Intcode";

/** Day 17 Solution */
export function solution(rawInput: string[]): utils.Solution {
	const program = rawInput[0].split(",").map(n => +n);
	const intcoder = new IntcodeRuntime();

	let output = intcoder.run(program, []);
	const mapStr = String.fromCharCode(...output);
	const map = mapStr.split("\n").map(line => line.split(""));

	let intersections = 0;
	let robotPos = [0, 0];
	let robotDir = [0, 0];

	for (const row in map) {
		for (const col in map) {
			if ("^<>v".includes(map[row][col])) {
				robotPos = [+row, +col];
				switch (map[row][col]) {
					case "^": robotDir = [-1, 0]; break;
					case "<": robotDir = [0, -1]; break;
					case "v": robotDir = [1, 0]; break;
					case ">": robotDir = [0, 1]; break;
				}
				continue;
			}
			if (map[row][col] !== "#") { continue; }
			if (map[+row + 1]?.[col] !== "#") { continue; }
			if (map[+row - 1]?.[col] !== "#") { continue; }
			if (map[row][+col + 1] !== "#") { continue; }
			if (map[row][+col - 1] !== "#") { continue; }
			intersections += +row * +col;
		}
	}

	const instructions: string[] = [];
	let consecutiveRightTurns = 0;

	while (true) {
		const next = [0, 1].map(index => robotPos[index] + robotDir[index]);
		if (map[next[0]]?.[next[1]] !== "#" || consecutiveRightTurns === 2) {
			robotDir = [robotDir[1], -robotDir[0]]; // Turn right
			instructions.push("R");
			consecutiveRightTurns++;
			if (consecutiveRightTurns === 3) {
				// Three rights make a left
				instructions.length -= 3;
				instructions.push("L");
			}
			if (consecutiveRightTurns === 4) {
				// Four rights means we're done
				instructions.length -= 2;
				break;
			}
			continue;
		}
		// Move forward
		consecutiveRightTurns = 0;
		robotPos = next;
		if (isNaN(+instructions[instructions.length - 1])) {
			// First forward move since turning
			instructions.push("1");
			continue;
		}
		// Continuing forward motion
		instructions[instructions.length - 1] = (+instructions[instructions.length - 1] + 1).toString();
	}

	const pairedInstructions: string[] = [];
	for (const instruction of instructions) {
		if (isNaN(+instruction)) { pairedInstructions.push(instruction); }
		else { pairedInstructions[pairedInstructions.length - 1] += "," + instruction; }
	}
	
	program[0] = 2;
	output = intcoder.run(program, __condense(pairedInstructions)!);

	return [intersections, output.pop()!];
}

function __condense(instructions: string[], functions: string[] = []): number[] | null {
	if (functions.length === 3) {
		if (instructions.some(inst => inst !== "A" && inst !== "B" && inst !== "C")) { return null; }
		const condensed = instructions.join(",") + "\n" + functions.join("\n") + "\nn\n";
		return condensed.split("").map(char => char.charCodeAt(0));
	}

	for (let length = 5; length > 0 && functions.length < 3; length--) {
		for (let start = 0; start + length <= instructions.length && functions.length < 3; start++) {
			const candidate = instructions.slice(start, start + length).join(",");
			if (candidate.length > 20) { continue; }
			if (candidate.includes("A") || candidate.includes("B") || candidate.includes("C")) { continue; }
			const remainder = instructions.slice(start + length).join(",");

			if (!remainder.includes(candidate)) { continue; }

			const instsCopy = [...instructions];
			const fnsCopy = [...functions];

			const label = String.fromCharCode("A".charCodeAt(0) + fnsCopy.length);
			fnsCopy.push(candidate);
			for (let replaceIndex = start; replaceIndex + length <= instsCopy.length; replaceIndex++) {
				if (instsCopy.slice(replaceIndex, replaceIndex + length).join(",") === candidate) {
					instsCopy.splice(replaceIndex, length, label);
				}
			}
			const out = __condense(instsCopy, fnsCopy);
			if (out) { return out; }
		}
	}
	return null;
}