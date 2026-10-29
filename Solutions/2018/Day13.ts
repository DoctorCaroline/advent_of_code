import * as utils from "../../AdventOfCodeUtils";

/** Day 13 Solution */
export function solution(rawInput: string[]): utils.Solution {
	let carts: ICart[] = [];
	const locations: Set<string> = new Set();
	const map = rawInput.map(row => row.split(""));
	for (const row in map) {
		for (const col in map[row]) {
			const char = map[row][col];
			if (!"<>^v".includes(char)) { continue; }
			const location = [+row, +col];
			const heading = [0, 0];
			switch (char) {
				case "<":
					map[row][col] = "-";
					heading[1] = -1;
					break;
				case ">":
					map[row][col] = "-";
					heading[1] = 1;
					break;
				case "^":
					map[row][col] = "|";
					heading[0] = -1;
					break;
				case "v":
					map[row][col] = "|";
					heading[0] = 1;
					break;
			}
			carts.push({ location, heading, nextTurn: Turn.left });
			locations.add(location.join(","));
		}
	}

	const out: utils.Solution = [];

	while (true) {
		for (const cart of carts) {
			if (cart.crashed) { continue; }
			locations.delete(cart.location.join(","));
			cart.location[0] += cart.heading[0];
			cart.location[1] += cart.heading[1];
			const newLocStr = cart.location.join(",");
			if (locations.has(newLocStr)) {
				locations.delete(newLocStr);
				if (!out.length) {
					out.push(newLocStr.split(",").reverse().join(","));
				}
				cart.crashed = true;
				for (const otherCart of carts) {
					if (otherCart.location[0] === cart.location[0] && otherCart.location[1] === cart.location[1]) {
						otherCart.crashed = true;
					}
				}
				continue;
			}
			locations.add(newLocStr);
			const track = map[cart.location[0]][cart.location[1]];
			if ("|-".includes(track)) { continue; }
			if (track === "\\") {
				if (cart.heading[0] === 1) { cart.heading = [0, 1]; }
				else if (cart.heading[0] === -1) { cart.heading = [0, -1]; }
				else if (cart.heading[1] === 1) { cart.heading = [1, 0]; }
				else if (cart.heading[1] === -1) { cart.heading = [-1, 0]; }
				continue;
			}
			if (track === "/") {
				if (cart.heading[0] === 1) { cart.heading = [0, -1]; }
				else if (cart.heading[0] === -1) { cart.heading = [0, 1]; }
				else if (cart.heading[1] === 1) { cart.heading = [-1, 0]; }
				else if (cart.heading[1] === -1) { cart.heading = [1, 0]; }
				continue;
			}
			if (track === "+") {
				switch (cart.nextTurn) {
					case Turn.straight:
						cart.nextTurn = Turn.right;
						break;
					case Turn.left:
						cart.nextTurn = Turn.straight;
						cart.heading = [-cart.heading[1], cart.heading[0]];
						break;
					case Turn.right:
						cart.nextTurn = Turn.left;
						cart.heading = [cart.heading[1], -cart.heading[0]];
						break;
				}
			}
		}
		carts = carts.filter(cart => !cart.crashed);
		if (carts.length === 1) {
			out.push(carts[0].location.reverse().join(","));
			return out;
		}
		carts.sort((a, b) => 1000 * (a.location[0] - b.location[0]) + (a.location[1] - b.location[1]));
	}
}

interface ICart {
	location: number[];
	heading: number[];
	nextTurn: Turn;
	crashed?: true;
}

enum Turn {
	left = 0,
	straight = 1,
	right = 2,
}