import * as fs from "node:fs";
import { IncomingMessage } from "http";
import * as https from "https";
import * as utils from "./AdventOfCodeUtils";

export function getInput(request: InputRequest): Promise<string[]> {
	const { year, day } = request;

	// Before any further exeuction, make sure this request is a valid one.
	__validateRequest(request);

	// Try to retrieve from local cache, if available
	const path = `./Inputs/${year}/Day${day.toString().padStart(2, "0")}.json`;
	if (fs.existsSync(path)) { return __loadCachedInput(path); }
	
	// Else acquire from web and cache for future use.
	return __loadInputFromWeb(request);
}

function __validateRequest(request: InputRequest): void {
	const { year, day } = request;

	if (Math.floor(year) !== year || Math.floor(day) !== day) {
		console.log("Error: Day and year params must be whole numbers.");
		process.exit();
	}

	if (day < 1 || day > 25) {
		console.log("Error: Day must be a number 1 through 25.");
		process.exit();
	}

	const date = new Date(`${year}/12/${day} GMT-0500`); // UTC-5 offset
	if (year < 2015) {
		console.log("Error: Invalid year.");
		process.exit();
	}

	if (date.getTime() > Date.now()) {
		console.log("Error: Input not yet available for this day.");
		process.exit();
	}
}

function __loadInputFromWeb(request: InputRequest): Promise<string[]> {
	const { cookie, year, day } = request;
	const { promise, resolve } = utils._makePromise<string[]>();
	const webRequest: https.RequestOptions = {
		hostname: "adventofcode.com",
		path: `/${year}/day/${day}/input`,
		method: "get",
		headers: { "Cookie": `session=${cookie}` },
		timeout: 10000,
	};

	https.get(webRequest, (result: IncomingMessage) => __parseInputFromWeb(request, resolve, result));
	return promise;
}

function __parseInputFromWeb(request: InputRequest,	resolve: (input: string[]) => void,	result: IncomingMessage): void {
	const { year, day } = request;
	const lines: string[] = [];
	result.on('data', (buffer: Buffer) => lines.push(buffer.toString()));
	result.on('end', async () => {
		const inputArray = lines.join("").split("\n");
		if (inputArray[0].includes("Please log in to get your puzzle input.")) {
			resolve(inputArray);
			return;
		}
		if (!inputArray[inputArray.length - 1]) { inputArray.pop(); }
		await __cacheInput(year, day, inputArray);
		resolve(inputArray);
	});
}

function __cacheInput(year: number, day: number, inputArray: string[]): Promise<void> {
	const { promise, resolve } = utils._makePromise<void>();
	const path = `./Inputs/${year}`;
	if (!fs.existsSync(path)) { fs.mkdirSync(path, { recursive: true }); }
	fs.writeFile(
		`${path}/Day${day.toString().padStart(2, "0")}.json`,
		JSON.stringify(inputArray),
		() => resolve(),
	);
	return promise;
}

function __loadCachedInput(path: string): Promise<string[]> {
	const { promise, resolve } = utils._makePromise<string[]>();
	fs.readFile(path, (err, data) =>
		resolve(err || !data.toString().length ? [] : JSON.parse(data.toString()))
	);
	return promise;
}

export interface InputRequest {
	cookie: string;
	year: number;
	day: number;
}