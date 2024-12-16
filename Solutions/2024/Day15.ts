import * as utils from "../../AdventOfCodeUtils";

/** Day 15 Solution */
export function solution(rawInput: string[]): utils.Solution {

	const map: LittleMapCharacter[][] = [];
	const robot: number[] = [];
	const bigMap: BigMapCharacter[][] = [];
	const bigRobot: number[] = [];
	const commands: CommandCharacter[] = [];

	rawInput.forEach(line => {
		const first = line.charAt(0);
		if (first === "#") {
			if (!robot.length && line.includes("@")) {
				robot.push(map.length, line.indexOf("@"));
			}
			const mapRow = line.split("") as LittleMapCharacter[];
			const bigMapRow: BigMapCharacter[] = [];
			for (const place of mapRow) {
				switch (place) {
					case "#":
					case ".":
						bigMapRow.push(place, place);
						break;
					case "O":
						bigMapRow.push("[", "]");
						break;
					case "@":
						bigMapRow.push("@", ".");
						bigRobot.push(map.length, bigMapRow.indexOf("@"));
						break;
				}
			}
			map.push(mapRow);
			bigMap.push(bigMapRow);
		}
		if ("^v<>".includes(first)) {
			commands.push(...line.split("") as CommandCharacter[]);
		}
	});
	
	for (const command of commands) {
		// Linear recursive command doesn't require verification
		__tryExecuteCommand(map, robot, command);
		debugger;
		// All branches of recursion must return true, must test first before committing to command
		if (__tryExecuteCommand(bigMap, bigRobot, command, true)) {
			__tryExecuteCommand(bigMap, bigRobot, command);
		}
	}

	return [map, bigMap].map(__scoreMap);
}

function __tryExecuteCommand(
	map: MapCharacter[][], 
	obj: number[], 
	command: CommandCharacter, 
	testOnly: boolean = false, 
	shearInduced: boolean = false
): boolean {

	// Can't move a wall
	if (map[obj[0]][obj[1]] === "#") { return false; }
	
	const actionVector = __getActionVector(command);

	// If push attempt is vertical, onto a big box, and not induced by internal shear, induce the shear
	if (actionVector[0] && "[]".includes(map[obj[0]][obj[1]]) && !shearInduced) {
		const counterpart = [...obj];
		switch (map[obj[0]][obj[1]]) {
			case "[": counterpart[1]++; break;
			case "]": counterpart[1]--; break;
		}
		if (!__tryExecuteCommand(map, counterpart, command, testOnly, true)) {
			return false;
		}
	}

	// Calculate where we're headed
	const target = [obj[0] + actionVector[0], obj[1] + actionVector[1]];
	
	// If empty space, can move there; if occupied, see if occupant can also be moved
	if (map[target[0]][target[1]] === "." || __tryExecuteCommand(map, target, command, testOnly)) {
		// If just feeling out whether this is possible, don't move anything
		if (testOnly) { return true; }

		// If not a test, do the thing
		map[target[0]][target[1]] = map[obj[0]][obj[1]];
		map[obj[0]][obj[1]] = ".";
		if (map[target[0]][target[1]] === "@") {
			obj[0] = target[0];
			obj[1] = target[1];
		}
		return true;
	}

	return false;
}

function __getActionVector(command: CommandCharacter): number[] {
	switch (command) {
		case "^":
			return [-1, 0];
		case "v":
			return [1, 0];
		case "<":
			return [0, -1];
		case ">":
			return [0, 1];
	}
}

function __scoreMap(map: MapCharacter[][]): number {
	let sum = 0;
	for (let row = 0; row < map.length; row++) {
		for (let col = 0; col < map[row].length; col++) {
			if (!"O[".includes(map[row][col])) { continue; }
			sum += 100 * row + col;
		}
	}
	return sum;
}

type MapCharacterBase = "@" | "#" | ".";
type LittleMapCharacter = MapCharacterBase | "O";
type BigMapCharacter = MapCharacterBase | "[" | "]";
type MapCharacter = LittleMapCharacter | BigMapCharacter;

type CommandCharacter = "^" | "v" | "<" | ">";