import * as utils from "../../AdventOfCodeUtils";

/** Day 12 Solution */
export function solution(rawInput: string[]): utils.Solution {

	const moons: IMoon[] = [];

	for (const line of rawInput) {
		const match = line.match(/x=(-?\d+), y=(-?\d+), z=(-?\d+)/);
		moons.push({
			pos: match!.slice(1, 4).map(n => +n),
			vel: [0, 0, 0],
		});
	}

	const initials: string[] = [];
	for (const axis of [0, 1, 2]) {
		initials.push(getAxisSignature(moons, axis));
	}

	const out: utils.Solution = [];
	const periods = [0, 0, 0];
	for (let step = 0; periods.includes(0); ) {
		applyGravity(moons);
		applyVelocity(moons);
		step++;
		step === 1000 && out.push(calcEnergy(moons));
		for (const axis of [0, 1, 2]) {
			if (periods[axis]) { continue; }
			if (initials[axis] === getAxisSignature(moons, axis)) {
				periods[axis] = step;
			}
		}
	}

	out.push(periods.reduce((lcm, val) => utils._lcm(lcm, val), 1));

	return out;
}

function applyGravity(moons: IMoon[]): void {
	for (const self of moons) {
		for (const other of moons) {
			if (self === other) { continue; }
			for (const axis of [0, 1, 2]) {
				self.vel[axis] += Math.sign(other.pos[axis] - self.pos[axis]);
			}
		}
	}
}

function applyVelocity(moons: IMoon[]): void {
	for (const moon of moons) {
		for (const axis of [0, 1, 2]) {
			moon.pos[axis] += moon.vel[axis];
		}
	}
}

function calcEnergy(moons: IMoon[]): number {
	return moons.reduce((e, moon) => e + utils._oneNorm(moon.pos) * utils._oneNorm(moon.vel), 0);
}

function getAxisSignature(moons: IMoon[], axis: number): string {
	return moons.map(moon => `${moon.pos[axis]}.${moon.vel[axis]}`).join("..")
}

interface IMoon {
	pos: number[],
	vel: number[],
}