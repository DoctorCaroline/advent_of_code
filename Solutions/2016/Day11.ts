import * as utils from "../../AdventOfCodeUtils";

/** Day 11 Solution */
export function solution(rawFloors: string[]): utils.Solution {

	rawFloors = [
		"The first floor contains a hydrogen-compatible microchip and a lithium-compatible microchip.",
		"The second floor contains a hydrogen generator.",
		"The third floor contains a lithium generator.",
		"The fourth floor contains nothing relevant."
	];

	const floors: IFloor[] = [];

	for (const floorNumber in rawFloors) {
		const rawFloor = rawFloors[floorNumber];
		const matches = rawFloor.matchAll(/([a-zA-Z]+-compatible microchip)|([a-zA-Z]+ generator)/g);
		
		const floor: IFloor = { generators: [], chips: [] };

		for (const match of matches) {
			if (match[0].includes("generator")) {
				const element = match[0].split(" ")[0];
				floor.generators.push(element);
			}
			else {
				const element = match[0].split("-")[0];
				floor.chips.push(element);
			}
		}

		floor.chips.sort();
		floor.generators.sort();
		floors.push(floor);
	}

	(floors as IState).elevator = 0;
	const startState = JSON.stringify(floors);

	let cost = 0;
	const toEvaluate: utils.IDijkstraQueue = { 0: [startState] };
	const evaluated: utils.StringKeyedObject<true> = {};

	while (true) {
		while (!toEvaluate[cost]) { cost++; }
		const rawState = toEvaluate[cost].pop();

		if (!rawState) {
			delete toEvaluate[cost];
			continue;
		}

		if (evaluated[rawState]) { continue; }
		evaluated[rawState] = true;

		const state: IState = JSON.parse(rawState);
		const currentFloor = state[state.elevator];
	}

	return [];
}

function __isSafe(floors: IFloor[]): boolean {
	for (const floor of floors) {
		for (const chip of floor.chips) {
			if (floor.generators.length && !floor.generators.includes(chip)) {
				return false;
			}
		}
	}
	return true;
}

function __isFinished(floors: IFloor[]): boolean {
	for (const floorNumber in floors) {
		if (+floorNumber === floors.length - 1) { continue; }
		const floor = floors[floorNumber];
		if (floor.generators.length || floor.chips.length) { return false; }
	}
	return true;
}

interface IState extends Array<IFloor> {
	elevator: number;
}

interface IFloor {
	generators: string[];
	chips: string[];
}