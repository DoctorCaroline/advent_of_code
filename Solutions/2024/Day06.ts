/** Day 6 Solution */
export function solution(rawInput: string[]): { toString: Function }[] {
	let map = rawInput.map(row => row.split(""));
	let guard;
	for (const rowI in map) {
		const row = map[rowI];
		for (const colI in row) {
			const guardChar = row[colI];
			switch (guardChar) {
				case "#":
				case ".":
					continue;
				case "^":
					guard = [+rowI, +colI, -1, 0];
					break;
			}
			if (guard) { break; }
		}
		if (guard) { break; }
	}
	if (!guard) { 
		console.log("Bad input. No guard.");
		process.exit();
	}
	
	const out = [0, 0];

	const walk = (guard: number[], input: string[][]) => {
		guard = [...guard];
		const visited: Visited = {};
		const safeInput = JSON.parse(JSON.stringify(input));

		const countVisited = (visited: Visited) => {
			let count = 0;
			for (const _ in visited) { count++; }
			return count;
		};

		while (true) {
			const place = `${guard[0]},${guard[1]}`;
			const direction = `${guard[2]},${guard[3]}`;
			visited[place] ||= [];

			if (visited[place].includes(direction)) {
				return { loops: true, visited, count: countVisited(visited) };
			}
			visited[place].push(direction);
			
			const next = [guard[0] + guard[2], guard[1] + guard[3]];
			if (next[0] === safeInput.length || next[0] < 0 || next[1] === safeInput[0].length || next[1] < 0) { 
				return { loops: false, visited, count: countVisited(visited) }; 
			}

			const turnGuard = (guard: number[]) => {
				guard.splice(2, 0, guard[3]);
				guard[3] *= -1;
				guard.pop();
			}

			if (safeInput[next[0]][next[1]] === "#") {
				turnGuard(guard);
			}
			else {
				guard[0] = next[0];
				guard[1] = next[1];
			}
		}
	};

	const result = walk(guard, map);
	out[0] = result.count;

	for (const place in result.visited) {
		if (guard.slice(0, 2).toString() === place.toString()) { continue; }
		const coord = place.split(",").map(n => +n);
		map[coord[0]][coord[1]] = "#";
		out[1] += +walk(guard, map).loops;
		map[coord[0]][coord[1]] = ".";
	}

	return out;
};

interface Visited {
	[places: string]: string[];
}