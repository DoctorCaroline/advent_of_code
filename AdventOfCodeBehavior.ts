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

		const solutionPath = `./Solutions/${year}/Day${day.toString().padStart(2, "0")}`;
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
		
		const divLine = "~~~~~~~~~~~~~~~~~~~~~~~";
		const output = [
			"",
			divLine,
			`# ADVENT OF CODE ${year} #`,
			divLine,
			`   *-~<(Day #${day})>~-*`,
			"",
			"~ Part 1 ~",
			`${answers[0]}`,
			...(answers[1] !== undefined
				? [
					"",
					"~ Part 2 ~",
					answers[1] + "",
				]
				: []
			),
			"",
			`Runtime: ${runtime} ms`,
		];

		console.log(output.join("\n"));

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