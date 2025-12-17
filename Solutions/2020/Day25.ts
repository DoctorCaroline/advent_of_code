import * as utils from "../../AdventOfCodeUtils";

/** Day 25 Solution */
export function solution(rawInput: string[]): utils.Solution {
	const publicKeys = rawInput.map(n => +n);
	let privateExponent = 0;
	let num = 1;

	// Crack Diffie-Helman private exponent
	while (!publicKeys.includes(num)) {
		num *= 7;
		num %= 20201227;
		privateExponent++;
	}

	// Grab unused public key for exponentiation with private exponent
	const base = publicKeys[+!publicKeys.indexOf(num)];

	// Exponentiate unused public key to acquire secret
	let secret = 1;
	while (privateExponent) {
		secret *= base;
		secret %= 20201227;
		privateExponent--;
	}
	
	return [secret];
}