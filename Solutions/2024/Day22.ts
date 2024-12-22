import * as utils from "../../AdventOfCodeUtils";

/** Day 22 Solution */
export function solution(rawNumbers: string[]): utils.Solution {
	const secretNumbers = rawNumbers.map(n => +n);
	const last4Changes = secretNumbers.map(n => [] as number[]);
	const sequenceYields: utils.StringKeyedObject<number[]> = {};

	for (let _ = 0; _ < 2000; _++) {
		for (const ix in secretNumbers) {
			const nextSecret = __nextSecret(secretNumbers[ix]);
			last4Changes[ix].push(nextSecret % 10 - secretNumbers[ix] % 10);
			switch (last4Changes[ix].length) {
				case 5:
					last4Changes[ix].shift();
				case 4:
					const seqKey = last4Changes[ix].join(",");
					sequenceYields[seqKey] ||= new Array(secretNumbers.length).fill(0);
					sequenceYields[seqKey][ix] ||= nextSecret % 10;
			}
			secretNumbers[ix] = nextSecret;
		}
	}

	const out = [secretNumbers.reduce((sum, value) => sum + value, 0), 0];

	for (const sequence in sequenceYields) {
		const total = sequenceYields[sequence].reduce((sum, value) => sum + value, 0);
		out[1] = Math.max(out[1], total);
	}

	return out;
}

function __nextSecret(sec: number): number {
	const mod = 16777216;
	let next = sec;
	const mixNPrune = (num: number) => (num ^ sec) % mod;

	next = mixNPrune(next << 6);
	sec = next;
	next = mixNPrune(next >> 5);
	sec = next;
	next = mixNPrune(next << 11);

	return next < 0 ? next + mod : next;
}