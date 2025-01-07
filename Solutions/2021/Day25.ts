import * as utils from "../../AdventOfCodeUtils";

/** Day 25 Solution */
export function solution(rawInput: string[]): utils.Solution {

	const map: MapChar[][] = [];
	for (const row of rawInput) { map.push(row.split("") as MapChar[]); }
	
	let step = 0;
	while (true) {
		step++;
		let motion = false;
		
		const cols: number[] = [];
		for (let row = 0; row < map.length; row++) {
			cols.length = 0;
			for (let col = 0; col < map[row].length; col++) {
				if (map[row][col] === ">" && map[row][(col + 1) % map[row].length] === ".") {
					cols.push(col);
				}
			}
			for (const col of cols) {
				motion = true;
				map[row][col] = ".";
				map[row][(col + 1) % map[row].length] = ">";
			}
		}

		const rows: number[] = [];
		for (let col = 0; col < map[0].length; col++) {
			rows.length = 0;
			for (let row = 0; row < map.length; row++) {
				if (map[row][col] === "v" && map[(row + 1) % map.length][col] === ".") {
					rows.push(row);
				}
			}
			for (const row of rows) {
				motion = true;
				map[row][col] = ".";
				map[(row + 1) % map.length][col] = "v";
			}
		}

		if (!motion) { return [step]; }
	}
}

type MapChar = "v" | ">" | ".";