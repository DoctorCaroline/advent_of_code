import * as utils from "../../AdventOfCodeUtils";

/** Day 12 Solution */
export function solution(rawDirections: string[]): utils.Solution {

	const directions: Direction[] = [];
	for (const direction of rawDirections) {
		directions.push(
			direction.match(/^([A-Z])(\d+)$/)
				?.slice(1, 3)
				.map(n => !isNaN(+n) ? +n : n) as Direction
		);
	}

	const ship = [0, 0, 1, 0];
	const waypoint = [0, 0, 10, 1];

	for (const direction of directions) {
		switch (direction[0]) {
			case "E":
				ship[0] += direction[1];
				waypoint[2] += direction[1];
				break;
			case "N":
				ship[1] += direction[1];
				waypoint[3] += direction[1];
				break;
			case "W":
				ship[0] -= direction[1];
				waypoint[2] -= direction[1];
				break;
			case "S":
				ship[1] -= direction[1];
				waypoint[3] -= direction[1];
				break;
			case "F":
				ship[0] += ship[2] * direction[1];
				ship[1] += ship[3] * direction[1];
				waypoint[0] += waypoint[2] * direction[1];
				waypoint[1] += waypoint[3] * direction[1];
				break;
			case "L":
			case "R":
				for (let _ = 0; 90 * _ < direction[1]; _++) {
					ship.splice(2, 0, ship[3]);
					waypoint.splice(2, 0, waypoint[3]);
					ship[+(direction[0] === "R") + 2] *= -1;
					waypoint[+(direction[0] === "R") + 2] *= -1;
					ship.pop();
					waypoint.pop();
				}
				break;
		}
	}

	return [
		utils._manhattanDistance(ship.slice(0, 2), [0, 0]),
		utils._manhattanDistance(waypoint.slice(0, 2), [0, 0])
	];
}

type Direction = [type: DirectionType, amount: number];

type DirectionType = "N" | "S" | "E" | "W" | "F" | "R" | "L";