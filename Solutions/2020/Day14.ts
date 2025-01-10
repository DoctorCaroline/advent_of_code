import * as utils from "../../AdventOfCodeUtils";

/** Day 14 Solution */
export function solution(rawInput: string[]): utils.Solution {

	const commands: Command[] = [];
	for (const line of rawInput) {
		const maskMatch = line.match(/^mask = ([01X]*)$/)?.[1];
		const memMatch = line.match(/^mem\[(\d*)\] = (\d*)$/)?.slice(1, 3).map(n => +n);
		commands.push(maskMatch || memMatch as Command);
	}

	let mask: Mask = "";
	const memory: Memory = {};
	const memory2: Memory = {};
	for (const command of commands) {
		if (__isMask(command)) {
			mask = command;
			continue;
		}
		__writeValue(memory, mask, command);
		__writeValue2(memory2, mask, command);
	}

	const out = [0, 0];
	for (const address in memory) { out[0] += memory[address]; }
	for (const address in memory2) { out[1] += memory2[address]; }

	return out;
}

function __isMask(command: Command): command is Mask {
	return !(command instanceof Array);
}

function __writeValue(memory: Memory, mask: Mask, command: Write): void {
	let binToWrite = "";
	const binFromCommand = command[1].toString(2).padStart(36, "0");
	for (let place = 0; place < mask.length; place++) {
		binToWrite += mask[place] === "X"
			? binFromCommand[place]
			: mask[place];
	}
	memory[command[0]] = Number.parseInt(binToWrite, 2);
}

function __writeValue2(memory: Memory, mask: Mask, command: Write): void {
	const addressFromCommand = command[0].toString(2).padStart(36, "0");
	const addressesToWrite: string[] = [""];
	for (let place = 0; place < mask.length; place++) {
		if (mask[place] === "X") {
			addressesToWrite.push(...addressesToWrite);
			for (const ix in addressesToWrite) {
				addressesToWrite[ix] += +(2 * +ix < addressesToWrite.length);
			}
		}
		else {
			for (const ix in addressesToWrite) {
				addressesToWrite[ix] += +mask[place] || addressFromCommand[place];
			}
		}
	}
	for (const address of addressesToWrite) {
		memory[Number.parseInt(address, 2)] = command[1];
	}
}

type Memory = { [address: number]: number };
type Command = Mask | Write;
type Mask = string;
type Write = [address: number, value: number];