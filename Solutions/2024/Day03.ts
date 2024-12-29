/** Day 3 Solution */
export function solution(code: string[]): { toString: Function }[] {
	const sums = [0, 0];
	let enabled = true;
	code.forEach(line => {
		const matches = line.matchAll(/(mul\((\d+),(\d+)\))|(do\(\))|(don't\(\))/g);
		for (const match of matches) {
			if (match[0].includes("do")) {
				enabled = match[0] === "do()";
				continue;
			}
			const product = +match[2] * +match[3];
			sums[0] += product;
			sums[1] += product * +enabled;
		}
	});
	return sums;
};