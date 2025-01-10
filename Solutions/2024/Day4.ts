/** Day 4 Solution */
export function solution(rawInput: string[]): { toString: Function }[] {
	const input = rawInput.map(line => line.split(""));
	const counts = [0, 0];
	const range = [0, 1, 2, 3];

	// Horizontal
	for (let row = 0; row < input.length; row++) {
		for (let col = 0; col < input[0].length - 3; col++) {
			const word = range.map(i => input[row][col + i]).join("");
			if (word === "XMAS" || word === "SAMX") { counts[0]++; }
		}
	}

	// Vertical
	for (let row = 0; row < input.length - 3; row++) {
		for (let col = 0; col < input[0].length; col++) {
			const word = range.map(i => input[row + i][col]).join("");
			if (word === "XMAS" || word === "SAMX") { counts[0]++; }
		}
	}

	// Diags
	for (let row = 0; row < input.length - 3; row++) {
		for (let col = 0; col < input[0].length - 3; col++) {
			let word = range.map(i => input[row + i][col + i]).join("");
			if (word === "XMAS" || word === "SAMX") { counts[0]++; }
			word = range.map(i => input[row + 3 - i][col + i]).join("");
			if (word === "XMAS" || word === "SAMX") { counts[0]++; }
		}
	}

	range.pop();

	// Part 2 Diags
	for (let row = 0; row < input.length - 2; row++) {
		for (let col = 0; col < input[0].length - 2; col++) {
			let word = range.map(i => input[row + i][col + i]).join("");
			if (word !== "MAS" && word !== "SAM") { continue; }
			word = range.map(i => input[row + 2 - i][col + i]).join("");
			if (word !== "MAS" && word !== "SAM") { continue; }
			counts[1]++
		}
	}

	return counts;
};