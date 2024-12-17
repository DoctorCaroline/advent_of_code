import * as utils from "../../AdventOfCodeUtils";

/** Day 17 Solution */
export function solution(rawInput: string[]): utils.Solution {

	// These numbers are going to get chonky
	const registers: bigint[] = [];
	let program: number[] = [];

	// Parse the puzzle input
	for (const line of rawInput) {
		const rMatch = line.match(/^Register [A|B|C]: (\d+)$/);
		if (rMatch) { registers.push(BigInt(rMatch[1])); continue; }
		const pMatch = line.match(/^Program: ([\d|,]+)$/);
		if (pMatch) { program = pMatch[1].split(",").map(n => +n); }
	}

	/*
		*** Part 2 Reasoning ***
		("p(X) => Y" syntax is shorthand for "Program with starting Register A value of X produces output of Y.")
		(All inputs to p() in base 8)

		Observation 1:
			Length of output program directly tied to number of octal digits in Register A
				p(_) => _
				p(__) => _,_
				etc.

		Observation 2:
			Last digit of output only influenced by most significant octal digit in Register A
			Penultimate digit of output only influenced by two most significant octal digits
			And so on...
				p(X___) => _,_,_,A
				p(XY__) => _,_,B,A
		
		Observation 3:
			Scaling a register value by a factor of 8 (digit-shifting) preserves the end of the program output
				If p(X) => A...
				then p(X_) => _,A
				...and p(X___) => _,_,_,A

		Approach: recursive depth-first search
			Incrementally grow an octal value for Register A
			Start with most significant digit, and scale by 8 for each additional digit added
			For every X-digit intermediate, verify output's digits align with last X digits of full program (if not, kill branch)
	*/
	
	// Invert program to make checking end easier
	const margorp = [...program].reverse();

	// Runs the program on the Register A value provided and verifies output matches end of desired output
	const check = (powers: number[]) => {
		const registers: bigint[] = [
			__parseLittleEndianOctal(powers),
			BigInt(0),
			BigInt(0),
		];
		const output = __program(registers, program).reverse();
		return output.every((digit, index) => digit === margorp[index]);
	};

	// Recursive depth-first search for valid sequence of powers
	const findQuineSeed: (powers?: number[]) => number = (powers: number[] = []) => {
		// Match check failed. This call represents a dead end.
		if (powers.length && !check(powers)) { return 0; }
		// Full sequence of powers found and match check succeeded. We did it!
		if (powers.length === margorp.length) { return Number(__parseLittleEndianOctal(powers)); }
		// Powers is only a partial sequence thus far. Iterate over next possible values and recurse.
		for (let nextPower = 0; nextPower < 8; nextPower++) {
			if (!nextPower && !powers.length) { continue; }
			const seed = findQuineSeed([...powers, nextPower]);
			if (seed) { return seed; }
		}
		// We should never hit this.
		return 0;
	}

	return [__program(registers, program), findQuineSeed()];
}

function __program(registers: bigint[], program: number[]): number[] {
	let pointer = 0;
	const output: number[] = [];

	while (true) {
		const [command, operand] = program.slice(pointer, pointer + 2);
		if (command === undefined) { break; }

		switch (command) {
			// Pointer move
			case 3:
				const newPointer = __jnz(registers, operand);
				if (newPointer !== false) {
					pointer = newPointer;
					continue;
				}
				break;

			// Output
			case 5:
				output.push(__out(registers, operand));
				break;

			// All other commands
			default:
				__voidCommandMap[command]?.(registers, operand);
		}
		pointer += 2;
	}

	return output;
}

function __adv(registers: bigint[], operand: number): void {
	registers[0] /= BigInt(2) ** __comboOperand(registers, operand);
}
function __bxl(registers: bigint[], operand: number): void {
	registers[1] ^= BigInt(operand);
}
function __bst(registers: bigint[], operand: number): void {
	registers[1] = __comboOperand(registers, operand) % BigInt(8);
}
function __jnz(registers: bigint[], operand: number): number | false {
	if (!registers[0]) { return false; }
	return operand;
}
function __bxc(registers: bigint[], _operand: number): void {
	registers[1] ^= registers[2];
}
function __out(registers: bigint[], operand: number): number {
	return Number(__comboOperand(registers, operand) % BigInt(8));
}
function __bdv(registers: bigint[], operand: number): void {
	registers[1] = registers[0] / BigInt(2) ** __comboOperand(registers, operand);
}
function __cdv(registers: bigint[], operand: number): void {
	registers[2] = registers[0] / BigInt(2) ** __comboOperand(registers, operand);
}

function __comboOperand(registers: bigint[], operand: number): bigint {
	return operand < 4
		? BigInt(operand)
		: registers[operand - 4];
}

function __parseLittleEndianOctal(powers: number[]): bigint {
	powers = [...powers];
	let out = BigInt(0), power = BigInt(1);
	while (powers.length) {
		out += power * BigInt(powers.pop()!);
		power *= BigInt(8);
	}
	return out;
}

const __voidCommandMap: VoidCommandMap = {
	0: __adv,
	1: __bxl,
	2: __bst,
	4: __bxc,
	6: __bdv,
	7: __cdv,
}

type VoidCommandMap = { [command: number]: VoidCommandFunction };
type VoidCommandFunction = (registers: bigint[], operand: number) => void;