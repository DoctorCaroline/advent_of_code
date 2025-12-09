import { AdventOfCodeBehavior } from "./AdventOfCodeBehavior";
const badInput = new Error("Invalid input!");
let benchmark = false;
let date: number[] = [];
for (const arg of process.argv.slice(2)) {
	switch (arg) {
		case "-b":
		case "--benchmark":
			benchmark = true;
			break;
		default:
			if (isNaN(+arg)) { throw badInput; }
			date.push(+arg);
			if (date.length > 2) { throw badInput; }
			break;
	}
}
(new AdventOfCodeBehavior()).initialize(date[0], date[1], benchmark);