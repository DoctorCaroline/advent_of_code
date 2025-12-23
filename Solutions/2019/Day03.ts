import * as utils from "../../AdventOfCodeUtils";

/** Day 3 Solution */
export function solution(rawDirections: string[]): utils.Solution {	
	
	const directions = rawDirections.map(wire => wire.split(",").map(dir => [dir[0], +dir.slice(1)])) as Heading[];
	const map: utils.NumberKeyedObject<utils.NumberKeyedObject<Port>> = {};
	
	const logPosition = (x: number, y: number, wireNo: number, distance: number) => {
		map[x] ||= {};
		map[x][y] ||= { wire: 0, distances: {} };
		map[x][y].wire |= 2 ** wireNo;
		map[x][y].distances ||= {};
		map[x][y].distances[wireNo] ||= distance;
	};
	
	for (const wireNo in directions) {
		const wire = directions[wireNo];
		let x = 0;
		let y = 0;
		let distance = 0;
		for (const heading of wire) {
			let move;
			switch (heading[0]) {
				case "U":
					move = () => y++;
					break;
				case "R":
					move = () => x++;
					break;
				case "D":
					move = () => y--;
					break;
				case "L":
					move = () => x--;
					break;
			}
			for (let i = 0; i < heading[1]; i++) {
				move();
				distance++;
				logPosition(x, y, +wireNo, distance);
			}
		}
	}
	let closestNorm = Number.MAX_SAFE_INTEGER;
	let closestDistance = Number.MAX_SAFE_INTEGER;
	for (const row in map) {
		for (const cell in map[row]) {
			const wires = map[row][cell].wire;
			if (wires === 3 && (+row || +cell)) {
				closestNorm = Math.min(closestNorm, utils._oneNorm([+row, +cell]));
				closestDistance = Math.min(closestDistance, map[row][cell].distances[0] + map[row][cell].distances[1]);
			}
		}
	}
	return [closestNorm, closestDistance];
}

interface Port {
	wire: number;
	distances: utils.NumberKeyedObject<number>;
}

type Direction = "U" | "R" | "D" | "L";
type Heading = [Direction, number][];