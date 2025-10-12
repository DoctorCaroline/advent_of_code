import * as utils from "../../AdventOfCodeUtils";

/** Day 11 Solution */
export function solution(rawFloors: string[]): utils.Solution {
	const solution = [__solutionInner(rawFloors)];
	rawFloors[0] += " elerium generator " + " elerium-compatible microchip " + " dilithium generator " + " dilithium-compatible microchip ";
	solution.push(__solutionInner(rawFloors));
	return solution;
}

function __solutionInner(rawFloors: string[]): number {

	const startState: IState = { devices: [], elevator: 0, abstract: 0 };

	for (const floorNumber in rawFloors) {
		const rawFloor = rawFloors[floorNumber];
		const matches = rawFloor.matchAll(/([a-zA-Z]+-compatible microchip)|([a-zA-Z]+ generator)/g);

		for (const match of matches) {
			if (match[0].includes("generator")) {
				const element = match[0].split(" ")[0];
				startState.devices.push({ element, type: "RTG", floor: +floorNumber });
			}
			else {
				const element = match[0].split("-")[0];
				startState.devices.push({ element, type: "MC", floor: +floorNumber });
			}
		}
	}
	startState.devices.sort((devA: IDevice, devB: IDevice) =>
		devA.element.localeCompare(devB.element) || devA.type.localeCompare(devB.type)
	);
	__updateAbstract(startState);

	const strStartState = JSON.stringify(startState);

	let cost = 0;
	const toEvaluate: utils.IDijkstraQueue = { 0: [strStartState] };
	const evaluated: utils.NumberKeyedObject<true> = {};

	while (true) {
		while (!toEvaluate[cost]) { cost++; }
		const rawState = toEvaluate[cost].pop();

		if (!rawState) {
			delete toEvaluate[cost];
			continue;
		}

		const state: IState = JSON.parse(rawState);

		if (evaluated[state.abstract]) { continue; }
		evaluated[state.abstract] = true;

		if (state.devices.every(device => device.floor === 3)) { return cost; }

		const nextStates = __getValidNextStates(state);
		for (const abstract in nextStates) {
			if (evaluated[abstract]) { continue; }
			const state = nextStates[abstract as `${number}`];
			(toEvaluate[cost + 1] ||= []).push(state);
		}
	}
}

function __updateAbstract(state: IState): void {
	const strFloors = state.devices.map(device => device.floor).join("");
	const sortedPairs = [...strFloors.matchAll(/\d\d/g)].map(pair => pair[0]).sort();
	state.abstract = +(sortedPairs.join("") + +state.elevator);
}

function __isSafe(state: IState): boolean {
	for (const chip of state.devices.filter(device => device.type === "MC")) {
		let isExposed = false;
		let isSafe = false;
		for (const rtg of state.devices.filter(device => device.type === "RTG")) {
			if (chip.floor !== rtg.floor) { continue; }
			if (chip.element === rtg.element) {
				isSafe = true;
				break;
			}
			isExposed = true;
		}
		if (isExposed && !isSafe) { return false; }
	}
	return true;
}

function __getValidNextStates(state: IState): utils.NumberKeyedObject<string> {
	const validNextStates: utils.NumberKeyedObject<string> = {};
	const { elevator, devices } = state;

	for (const dev1 in devices) {
		const device1 = devices[dev1];
		__tryMakeNextState(validNextStates, state, elevator - 1, device1);
		__tryMakeNextState(validNextStates, state, elevator + 1, device1);
		for (const dev2 in devices) {
			if (dev1 === dev2) { break; }
			const device2 = devices[dev2];
			__tryMakeNextState(validNextStates, state, elevator - 1, device1, device2);
			__tryMakeNextState(validNextStates, state, elevator + 1, device1, device2);
		}
	}

	return validNextStates;
}

function __tryMakeNextState(
	validNextStates: utils.NumberKeyedObject<string>,
	state: IState,
	targetFloor: number,
	device1: IDevice,
	device2?: IDevice
): void {
	const { elevator, abstract } = state;
	
	if (targetFloor < 0 || targetFloor > 3) { return; }
	if (device1.floor !== elevator) { return; }
	if (device2 && device2.floor !== elevator) { return; }
	if (device2 && device1.type !== device2.type && device1.element !== device2.element) { return; }

	device1.floor = targetFloor;
	device2 && (device2.floor = targetFloor);
	state.elevator = targetFloor;
	
	if (__isSafe(state)) {
		__updateAbstract(state);
		validNextStates[state.abstract] = JSON.stringify(state);
	}

	device1.floor = elevator;
	device2 && (device2.floor = elevator);
	state.elevator = elevator;
	state.abstract = abstract;
}

interface IState {
	abstract: number;
	devices: IDevice[];
	elevator: number;
}

interface IDevice {
	element: string;
	type: keyof typeof DeviceType;
	floor: number;	
}

enum DeviceType {
	RTG,
	MC,
}