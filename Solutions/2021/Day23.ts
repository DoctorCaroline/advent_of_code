import * as utils from "../../AdventOfCodeUtils";

/** Day 23 Solution */
export function solution(rawInput: string[]): utils.Solution {
	const foldedInput = [...rawInput];
	rawInput.splice(3, 0, "  #D#C#B#A", "  #D#B#A#C");
	return [foldedInput, rawInput].map(__solution);
}

function __solution(rawInput: string[]): number {

	const hallStart: Hall = [null, null, [], null, [], null, [], null, [], null, null];

	for (const line of rawInput) {
		const roomsMatch = line.match(/[A-D]#[A-D]#[A-D]#[A-D]/)?.[0].split("#");
		if (roomsMatch) {
			for (const index in roomsMatch) {
				(hallStart[2 * +index + 2] as Spot[]).push(roomsMatch[index] as Spot);
			}
		}
	}

	const evaluated: utils.StringKeyedObject<true> = {};
	const toEvaluate: DijkstraQueue = { 0: [JSON.stringify(hallStart)] };

	let cost = 0;
	while (true) {
		while (!toEvaluate[cost]) { cost++; }
		const hallStr = toEvaluate[cost].pop();

		if (!hallStr) {
			delete toEvaluate[cost];
			continue;
		}

		if (evaluated[hallStr]) { continue; }
		evaluated[hallStr] = true;

		const hall = JSON.parse(hallStr) as Hall;
		if (__amphipodsAreSorted(hall)) { return cost; }
		
		for (const index in hall) {
			if (!hall[index]) { continue; }
			else if (hall[index] instanceof Array) {
				__evaluateFromRoomMoves(toEvaluate, cost, hall, +index);
			}
			else {
				__evaluateToRoomMove(toEvaluate, cost, hall, +index);
			}
		}
	}
}

function __evaluateFromRoomMoves(toEvaluate: DijkstraQueue, cost: number, hall: Hall, index: number): void {
	const room = hall[index] as Spot[];

	// If the room is empty or solely occupied by the right kind of amphipod, don't move them
	if (room.every(spot => !spot || spot === RoomIndices[index])) { return; }

	// Get list of unobstructed target locations in the hallway that can be moved to
	const unobstructed = __findUnobstructed(hall, index);
	if (!unobstructed.length) { return; }

	// Identify the first spot in the room that is occupied
	const firstOccupied = room.findIndex(spot => spot !== null);
	const type = room[firstOccupied] as AmphipodType;

	// For each unobstructed target, move the first occupant of the room to each location
	room[firstOccupied] = null;
	for (const spot of unobstructed) {
		const addedCost = AmphipodCost[type] * (Math.abs(spot - index) + firstOccupied + 1);
		hall[spot] = type;
		(toEvaluate[cost + addedCost] ??= []).push(JSON.stringify(hall));
		hall[spot] = null;
	}
	room[firstOccupied] = type;
}

function __evaluateToRoomMove(toEvaluate: DijkstraQueue, cost: number, hall: Hall, index: number): void {
	const type = hall[index] as AmphipodType;
	const targetIndex = RoomIndices[type];

	// Other amphipods in the way
	if (__isObstructed(hall, index, targetIndex)) { return; }

	// Room still occupied by incorrect amphipods
	const targetRoom = hall[targetIndex] as Spot[];
	if (targetRoom.some(spot => spot && spot !== type)) { return; }

	const unfilledRoomDepth = targetRoom.reduce((sum, spot) => sum += +(spot === null), 0)
	const addedCost = AmphipodCost[type] * (Math.abs(targetIndex - index) + unfilledRoomDepth);

	targetRoom[unfilledRoomDepth - 1] = type;
	hall[index] = null;
	(toEvaluate[cost + addedCost] ??= []).push(JSON.stringify(hall));
	hall[index] = type;
	targetRoom[unfilledRoomDepth - 1] = null;
}

function __isObstructed(hall: Hall, start: number, end: number): boolean {
	const direction = Math.sign(end - start);
	for (let index = start + direction; index !== end; index += direction) {
		if (hall[index] && !(hall[index] instanceof Array)) { return true; }
	}
	return false;
}

function __findUnobstructed(hall: Hall, origin: number): number[] {
	const out: number[] = [];
	for (const direction of [-1, 1]) {
		for (let i = origin + direction; hall[i] !== undefined; i += direction) {
			if (hall[i] === null) {
				out.push(i);
			}
			else if (!(hall[i] instanceof Array)) {
				break;
			}
		}
	}
	return out;
}

function __amphipodsAreSorted(hall: Hall): boolean {
	for (const index in hall) {
		const expected = RoomIndices[+index];
		if (!expected) { continue; }
		if ((hall[index] as Spot[]).some(spot => spot !== expected)) { return false; }
	}
	return true;
}

enum RoomIndices {
	A = 2,
	B = 4,
	C = 6,
	D = 8,
}

enum AmphipodCost {
	A = 1,
	B = 10,
	C = 100,
	D = 1000,
}

type Spot = AmphipodType | null;
type AmphipodType = "A" | "B" | "C" | "D";
type Hall = (Spot | Spot[])[];

interface DijkstraQueue {
	[cost: number]: string[];
}