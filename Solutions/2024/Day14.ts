import * as utils from "../../AdventOfCodeUtils";

/** Day 14 Solution */
export function solution(rawTrajectories: string[]): utils.Solution {

	const bounds = [101, 103];
	const splits = bounds.map(d => (d - 1) / 2);

	const robots: Robot[] = rawTrajectories.map(traj => {
		const nums = traj.match(/-?\d+/g);
		return {
			position: nums!.slice(0, 2).map(n => +n),
			velocity: nums!.slice(2).map(n => +n),
		} as Robot;
	});

	const answers = [0, 0];
	let runningVariance = 0;

	for (let t = 1; true; t++) {
		const variance = __iterateRobots(robots, bounds);
		if (t === 100) { answers[0] = __getSafetyFactor(robots, splits); }
		if (variance < runningVariance / 2) {
			answers[1] = t;
			break;
		}
		runningVariance = (runningVariance * (t - 1) + variance) / t;
	}

	return answers;
}

function __iterateRobots(robots: Robot[], bounds: number[]): number {
	const distributions: number[][] = [[], []];
	for (const robot of robots) {
		for (const axis of [0, 1]) {
			robot.position[axis] += robot.velocity[axis] + bounds[axis];
			robot.position[axis] %= bounds[axis];
			distributions[axis].push(robot.position[axis]);
		}
	}
	return distributions.reduce((sum, distribution) => sum + utils._variance(distribution), 0);
}

function __getSafetyFactor(robots: Robot[], splits: number[]): number {
	const quadrants = [0, 0, 0, 0];
	for (const robot of robots) {
		if (robot.position[0] === splits[0] || robot.position[1] === splits[1]) {
			continue;
		}
		quadrants[+(robot.position[0] > splits[0]) + 2 * +(robot.position[1] > splits[1])]++;
	}
	return quadrants.reduce((prod, quad) => prod * quad, 1);
}

interface Robot {
	position: number[];
	velocity: number[];
}