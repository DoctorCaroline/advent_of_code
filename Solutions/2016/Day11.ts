import * as utils from "../../AdventOfCodeUtils";

/** Day 11 Solution */
export function solution(rawFloors: string[]): utils.Solution {
	const solution = [__solutionInner(rawFloors)];
	//rawFloors[0] += " elerium generator " + " elerium-compatible microchip " + " dilithium generator " + " dilithium-compatible microchip ";
	//solution.push(__solutionInner(rawFloors));
	return solution;
}

function __solutionInner(rawFloors: string[]): number {

	const startState: IState = { devices: [], elevator: 0 };

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

	const strStartState = JSON.stringify(startState);

	let cost = 0;
	const toEvaluate: utils.IDijkstraQueue = { 0: [strStartState] };
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
		if (__isFinished(state)) { return cost; }

		for (const nextState of __getValidNextStates(state)) {
			if (evaluated[nextState]) { continue; }
			(toEvaluate[cost + 1] ||= []).push(nextState);
		}
	}
}

function __isSafe(state: IState): boolean {
	for (const chip of state.devices.filter(__isChip)) {
		let isExposed = false;
		let isSafe = false;
		for (const rtg of state.devices.filter(__isRTG)) {
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

function __isChip(device: IDevice): boolean {
	return device.type === "MC";
}

function __isRTG(device: IDevice): boolean {
	return device.type === "RTG";
}

function __isFinished(state: IState): boolean {
	return state.devices.every(device => device.floor === 3);
}

function __isValidFloor(floor: number): boolean {
	return floor >= 0 && floor <= 3;
}

function __getValidNextStates(state: IState): string[] {
	const validNextStates: string[] = [];
	const { elevator, devices } = state;

	for (const dev1 in devices) {
		const device1 = devices[dev1];
		__tryMakeNextState(validNextStates, state, elevator, elevator - 1, device1);
		__tryMakeNextState(validNextStates, state, elevator, elevator + 1, device1);
		for (const dev2 in devices) {
			if (dev1 === dev2) { break; }
			const device2 = devices[dev2];
			__tryMakeNextState(validNextStates, state, elevator, elevator - 1, device1, device2);
			__tryMakeNextState(validNextStates, state, elevator, elevator + 1, device1, device2);
		}
	}

	return validNextStates;
}

function __tryMakeNextState(
	validNextStates: string[],
	state: IState,
	currentFloor: number,
	targetFloor: number,
	device1: IDevice,
	device2?: IDevice
): void {
	if (!__isValidFloor(targetFloor)) { return; }
	if (device1.floor !== currentFloor) { return; }
	if (device2 && device2.floor !== currentFloor) { return; }
	if (device2 && device1.type !== device2.type && device1.element !== device2.element) { return; }

	device1.floor = targetFloor;
	device2 && (device2.floor = targetFloor);
	state.elevator = targetFloor;
	
	if (__isSafe(state)) {
		validNextStates.push(JSON.stringify(state));
	}

	device1.floor = currentFloor;
	device2 && (device2.floor = currentFloor);
	state.elevator = currentFloor;
}

enum DeviceType {
	RTG,
	MC,
}

interface IState {
	devices: IDevice[],
	elevator: number;
}

interface IDevice {
	element: string;
	type: keyof typeof DeviceType;
	floor: number;	
}