import * as utils from "../../AdventOfCodeUtils";

/** Day 21 Solution */
export function solution(doorCodes: string[]): utils.Solution {
	__buildStrokesLibrary();
	const out = [0, 0];
	for (const code of doorCodes) {
		const numeric = +code.replace("A", "");
		out[0] += numeric * __count(code, 3);
		out[1] += numeric * __count(code, 26);
	}
	return out;
}

const __strokes: utils.StringKeyedObject<string[]> = {};

const __dirs: { [num: number]: string } = {
	0: "^",
	1: "v",
	2: "<",
	3: ">",
};

const __numPad: utils.StringKeyedObject<number[]> = {
	"0": [3, 1],
	"1": [2, 0],
	"2": [2, 1],
	"3": [2, 2],
	"4": [1, 0],
	"5": [1, 1],
	"6": [1, 2],
	"7": [0, 0],
	"8": [0, 1],
	"9": [0, 2],
	"A": [3, 2],
	"X": [3, 0],
};

const __dPad: utils.StringKeyedObject<number[]> = {
	"^": [0, 1],
	"<": [1, 0],
	"v": [1, 1],
	">": [1, 2],
	"A": [0, 2],
	"X": [0, 0],
};

function __buildStrokesLibrary(): void {
	for (const pad of [__numPad, __dPad]) {
		for (const startKey in pad) {
			for (const endKey in pad) {
				if (startKey === "X" || endKey === "X") { continue; }
				if (startKey === endKey) {
					(__strokes[[startKey, endKey].toString()] ||= []).push("A");
					continue;
				}
				const start = pad[startKey];
				const end = pad[endKey];
				const diff = [end[0] - start[0], end[1] - start[1]];
				const diffStr = ["", ""];
				for (const dir of [0, 1]) {
					for (let _ = 0; _ < Math.abs(diff[dir]); _++) {
						diffStr[dir] += __dirs[2 * dir + (diff[dir] > 0 ? 1 : 0)];
					}
				}
				if (diff[0] && [start[0] + diff[0], start[1]].toString() !== pad["X"].toString()) {
					(__strokes[[startKey, endKey].toString()] ||= []).push(`${diffStr[0]}${diffStr[1]}A`);
				}
				if (diff[1] && [start[0], start[1] + diff[1]].toString() !== pad["X"].toString()) {
					(__strokes[[startKey, endKey].toString()] ||= []).push(`${diffStr[1]}${diffStr[0]}A`);
				}
			}
		}
	}
}

const __countMemo: utils.StringKeyedObject<number> = {}
function __count(code: string, depth: number): number {
	if (!depth) { return code.length; }
	const memoKey = `${code},${depth}`;
	const cached = __countMemo[memoKey];
	if (cached) { return cached; }
	
	let cursor = "A";
	let count = 0;
	for (const char of code.split("")) {
		let min = Number.MAX_SAFE_INTEGER;
		for (const path of __strokes[`${cursor},${char}`]) {
			min = Math.min(min, __count(path, depth - 1));
		}
		count += min;
		cursor = char;
	}
	return __countMemo[memoKey] = count;
}