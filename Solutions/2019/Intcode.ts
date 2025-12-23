/**
 * Intcode interpreter for Advent of Code 2019
 */
export class IntcodeRuntime {

	public run(program: number[]): number;
	public run(program: number[], input: number[]): number[];
	public run(program: number[], input: number[] | undefined, state: Partial<IntcodeMachineState>): number[];
	public run(program: number[], input: number[] = [], state?: Partial<IntcodeMachineState>): number | number[] {
		state ||= {};
		const prog = state.program || [...program];
		const output = state.output || [];
		var cursor = state.cursor || 0;
		var input = state.input || input;
		var relativeBase = state.relativeBase || 0;
		var saveState = (done?: boolean) => {
			state.input = input;
			state.program = prog;
			state.output = output;
			state.cursor = cursor;
			state.done = done;
			state.relativeBase = relativeBase;
		};
		while (true) {
			if (prog[cursor] === 99) { break; }
			var modeCode = Math.floor(prog[cursor] / 100).toString().split("").reverse().map(n => +n);
			modeCode.unshift(0);
			var getVal = (paramNo: number) => {
				switch(modeCode[paramNo]) {
					case 0:
					case undefined: // Position mode
						return prog[prog[cursor + paramNo]] || 0;
					case 1: // Immediate mode
						return prog[cursor + paramNo] || 0;
					case 2: // Relative mode
						return prog[prog[cursor + paramNo] + relativeBase] || 0;
					default:
						throw new Error();
				}
			};
			var setVal = (paramNo: number, value: number) => {
				switch(modeCode[paramNo]) {
					case 0:
					case undefined:
						return prog[prog[cursor + paramNo]] = value;
					case 1:
						return prog[cursor + paramNo] = value;
					case 2:
						return prog[prog[cursor + paramNo] + relativeBase] = value;
				}
			}
			switch (prog[cursor] % 100) {
				case 1:
					setVal(3, getVal(1) + getVal(2));
					cursor += 4;
					break;
				case 2:
					setVal(3, getVal(1) * getVal(2));
					cursor += 4;
					break;
				case 3:
					if (!input.length && state.continuousInput) {
						saveState();
						return output;
					}
					setVal(1, input.shift()!);
					cursor += 2;
					break;
				case 4:
					output.push(getVal(1));
					cursor += 2;
					break;
				case 5:
					if (getVal(1) !== 0) { cursor = getVal(2); break; }
					cursor += 3;
					break;
				case 6:
					if (getVal(1) === 0) { cursor = getVal(2); break; }
					cursor += 3;
					break;
				case 7:
					setVal(3, +(getVal(1) < getVal(2)));
					cursor += 4;
					break;
				case 8:
					setVal(3, +(getVal(1) === getVal(2)));
					cursor += 4;
					break;
				case 9:
					relativeBase += getVal(1);
					cursor += 2;
					break;
			}
		}
		saveState(true);
		return output.length ? output : prog[0];
	};
}

export interface IntcodeMachineState {
	program: number[];
	input: number[];
	output: number[];
	continuousInput: boolean;
	cursor: number;
	relativeBase: number;
	done: boolean;
}