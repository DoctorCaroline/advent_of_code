import * as utils from "../../AdventOfCodeUtils";

/** Day 10 Solution */
export function solution(rawInput: string[]): utils.Solution {

	const machines: Machine[] = [];
	
	for (const line of rawInput) {
		const lights = Number.parseInt(line.match(/^\[([#|\.]+)\]/)![1].split("").map(char => char === "#" ? 1 : 0).reverse().join(""), 2);
		const toggles = [...line.matchAll(/\((\d+(,\d+)*)\)/g)].map(arr => arr[1].split(",").map(n => +n)).sort((a, b) => b.length - a.length);
		const toggleMasks = toggles.map(arr => utils._sum(arr.map(n => 2 ** +n)));
		const joltages = line.match(/{(\d+(,\d+)*)}/)![1].split(",").map(n => +n);
		machines.push({ lights, toggles, toggleMasks, joltages });
	}

	const lights: (machine: Machine, index: number, current: number, count: number) => number =
	(machine: Machine, index: number, current: number, count: number) => {
		if (current === machine.lights) { return count; }
		if (index === machine.toggleMasks.length) { return Number.MAX_SAFE_INTEGER; }
		return Math.min(
			lights(machine, index + 1, current ^ machine.toggleMasks[index], count + 1),
			lights(machine, index + 1, current, count)
		);
	};

	const joltages: (state: number[], toggles: number[][]) => number =
	(state: number[], toggles: number[][]) => {
		let minimum = Number.MAX_SAFE_INTEGER;

		const joltageRecurse: (state: number[], toggles: number[][], count: number) => void =
		(state: number[], toggles: number[][], count: number) => {
			if (state.some(n => n < 0)) { return; } // We overshot
			const farthestToGo = state.reduce((min, value) => Math.max(min, value), 0);
			if (farthestToGo === 0) {
				minimum = Math.min(minimum, count);
				return;
			}
			if (farthestToGo + count >= minimum) { return; } // Can't improve on best result

			// Pruning cases
			for (let idx1 = 0; idx1 < state.length; idx1++) {
				for (let idx2 = 0; idx2 < state.length; idx2++) {
					if (state[idx1] < state[idx2]) {
						const validToggles = toggles.filter(toggle => toggle.includes(idx2) && !toggle.includes(idx1));
						switch (validToggles.length) {
							case 0: return; // idx1/idx2 divide irrecoverable with remaining toggles
							case 1:
								const newState = state.map((value, index) => validToggles[0].includes(index) ? value - 1 : value);
								joltageRecurse(newState, toggles, count + 1); // Only toggle that can reconcile idx1/idx2
								return;
						}
					}
				}
			}

			for (let idx = 0; idx < toggles.length; idx++) {
				const toggle = toggles[idx];
				const newState = state.map((value, index) => toggle.includes(index) ? value - 1 : value);
				joltageRecurse(newState, toggles.slice(idx), count + 1);
			}
		};

		joltageRecurse(state, toggles, 0);
		return minimum;
	};

	const out = [0, 0];
	for (const machine of machines) {
		out[0] += lights(machine, 0, 0, 0);
		out[1] += joltages(machine.joltages, machine.toggles);
	}
	return out;
}

interface Machine {
	lights: number;
	toggles: number[][];
	toggleMasks: number[];
	joltages: number[];
}