import * as fs from "node:fs";
import * as utils from "./AdventOfCodeUtils";
import * as inputManager from "./AdventOfCodeInputManager";

export class AdventOfCodeBehavior {

	private __cookie: string = "";

	public async initialize(year: number, day: number): Promise<void> {

		if (!year || !day) {
			console.log("Input error: Must provide a year and a day.");
			process.exit();
		}

		const cookie = await this.__loadCookie();

		const input = await inputManager.getInput({ cookie, year, day });

		const solutionPath = `./Solutions/${year}/Day${day}`;
		const solutionPathTs = `${solutionPath}.ts`;

		let solution;
		try { solution = require(solutionPath);	}
		catch {
			await this.__copyFile("./Solutions/Template/SolutionTemplate.ts", solutionPathTs);
			await this.__openFile(solutionPathTs);

			console.log(`No solution found at ${solutionPath}. Solution file created.`);
			process.exit();
		}

		const startTime = Date.now();
		const answers = solution.solution(input);
		const runtime = Date.now() - startTime;
		
		const line = "~~~~~~~~~~~~~~~~~~~~~~~"
		console.log("");
		console.log(line);
		console.log(`~ ADVENT OF CODE ${year} ~`);
		console.log(line);
		console.log("");
		console.log(`Day #${day}`);
		console.log("");
		console.log("~ Part 1 ~");
		console.log(answers[0] + "");
		console.log("");
		console.log("~ Part 2 ~");
		console.log(answers[1] + "");
		console.log("");
		console.log(`Runtime: ${runtime} ms`);
		process.exit();
	}

	private async __loadCookie(): Promise<string> {
		const { promise, resolve } = utils._makePromise<string>();
		fs.readFile("AdventOfCodeCookie", (err, data) => {
			let cookie: string;
			if (err || !data || !(cookie = data.toString()).length) {
				console.log("Cookie not found! Include cookie hexstring in AdventOfCodeCookie file in this repo's root folder.");
				process.exit();
			}
			resolve(cookie);
		});
		this.__cookie = await promise;
		return this.__cookie;
	}

	private async __copyFile(source: string, target: string): Promise<void> {
		const { promise, resolve } = utils._makePromise<void>();
		fs.cp(source, target, () => resolve());
		return promise;
	}

	private async __openFile(target: string): Promise<void> {
		const { promise, resolve } = utils._makePromise<void>();
		const { exec } = require("child_process");
		exec(`start ${target}`, () => resolve());
		return promise;
	}
}