import * as utils from "../../AdventOfCodeUtils";

/** Day 4 Solution */
export function solution(rawInput: string[]): utils.Solution {
	const range = rawInput[0].split("-").map(n => +n) as Range;
	
	const hasStrictDouble = (pwStr: string) => {
		const pw = pwStr.split("");
		let num = pw.shift();
		while (pw.length) {
			let count = 1;
			while (num === (num = pw.shift())) { count++; }
			if (count === 2) { return true; }
		}
		return false;
	};
	
	const counts = [0, 0];
	const dfs = (soFar: string, hasDouble: boolean = false) => {
		
		const last = soFar[soFar.length - 1];
		
		switch (soFar.length) {
			case 6:
				if (!utils._inRange(+soFar, ...range)) { return; }
				counts[0]++;
				counts[1] += +hasStrictDouble(soFar);
				return;
			case 5:
				if (!hasDouble) {
					dfs(soFar + last, true);
					return;
				}
		}
		
		for (let i = (+last || 2); i < 10; i++) {
			dfs(soFar + (i + ""), hasDouble || i === +last);
		}
	};
	
	dfs("");
	
	return counts;
}

type Range = [number, number];