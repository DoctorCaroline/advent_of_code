import * as fs from "node:fs";
import * as readLine from "node:readline";
import * as utils from "./AdventOfCodeUtils";
import * as inputManager from "./AdventOfCodeInputManager";

export class AdventOfCodeBehavior {

	private __reader?: readLine.Interface;

	public get _reader(): readLine.Interface {
		return this.__reader ??= this.__initializeReader();
	}

	public async initialize(year: number, day: number): Promise<void> {

		if (!year || !day) {
			console.log("Input error: Must provide a year and a day.");
			process.exit();
		}

		let cookie = await this.__loadCookie();
		let input = await inputManager.getInput({ cookie, year, day });
		while (input[0].includes("Please log in to get your puzzle input.")) {
			console.log("Cookie not recognized by the Advent of Code server.");
			cookie = await this.__promptForCookie();
			input = await inputManager.getInput({ cookie, year, day });
		}

		const solutionPath = `./Solutions/${year}/Day${day.toString().padStart(2, "0")}`;
		const solutionPathTs = `${solutionPath}.ts`;
		const solutionPathJs = `${solutionPath}.js`;

		let solution;
		try { solution = require(solutionPath);	}
		catch {
			await this.__copyFile("./Solutions/Template/SolutionTemplate.js", solutionPathJs);
			await this.__copyFile("./Solutions/Template/SolutionTemplate.ts", solutionPathTs);
			await this.__replaceInFile(solutionPathTs, "Day X", `Day ${day}`);
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
		fs.readFile("AdventOfCodeCookie", async (err, data) => {
			let cookie: string = data?.toString();
			if (err || !cookie || cookie.length !== 128) {
				console.log("Cookie missing or corrupted!");
				resolve(await this.__promptForCookie());
			}
			resolve(cookie);
		});
		return promise;
	}

	private async __promptForCookie(): Promise<string> {
		const { promise, resolve } = utils._makePromise<string>();
		this._reader.question("Enter new cookie: ", (cookie: string) => {
			if (!cookie.match(/^[a-f0-9]{128}$/)) {
				console.log("Invalid cookie. Must be a 128-character hexadecimal string.");
				process.exit();
			}
			const writePromise = utils._makePromise<void>();
			fs.writeFile("AdventOfCodeCookie", cookie, "utf-8", () => writePromise.resolve());
			writePromise.promise.then(() => resolve(cookie));
		});
		return promise;
	}

	private __initializeReader(): readLine.Interface {
		return readLine.createInterface({
			input: process.stdin,
			output: process.stdout,
		})
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

	private async __replaceInFile(path: string, target: string | RegExp, replacement: string): Promise<void> {
		const { promise, resolve } = utils._makePromise<void>();
		fs.readFile(path, "utf-8", (_err, data) => {
			const newData = data.replace(target, replacement);
			fs.writeFile(path, newData, "utf-8", () => resolve());
		});
		return promise;
	}
}