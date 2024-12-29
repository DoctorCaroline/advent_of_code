import * as utils from "../../AdventOfCodeUtils";

/** Day 9 Solution */
export function solution(rawDiskMap: string[]): utils.Solution {

	const diskMap = rawDiskMap[0].split("");
	const fileTable: FileTableEntry[] = [];
	let disks: (number | ".")[][] = [[], []];
	let lastId = 0;

	// Populate disk for Part 1 and file table for Part 2
	for (const digit in diskMap) {
		if (+diskMap[digit] === 0) { continue; }
		const id = +digit % 2
			? "."
			: (lastId = +digit / 2); // Also assigns lastId in the process (for Part 2)
		fileTable.push({
			id: isNaN(+id) ? null : +id,
			length: +diskMap[digit],
		});
		for (let _ = 0; _ < +diskMap[digit]; _++) {
			disks[0].push(id);
		}
	}

	// Part 1
	// Start cursors at both ends, progressing inward until they meet
	let emptySpaceCursor = 0;
	while (true) {
		const disk = disks[0];

		let last = disk.pop()!;
		while (last === ".") { last = disk.pop()!; }

		while (disk[emptySpaceCursor] !== "." && emptySpaceCursor < disk.length) { emptySpaceCursor++; }
		if (emptySpaceCursor >= disk.length) {
			disk.push(last);
			break;
		}

		disk[emptySpaceCursor] = last;
	}

	// Part 2
	// Iterate backward through the table
	// Track last ID so as to not move things twice
	lastId++;
	for (let i = fileTable.length - 1; i >= 0; i--) {
		const chunk = fileTable[i];

		// No need to move empty space; don't move something already encountered
		if (chunk.id === null || chunk.id >= lastId) { continue; }

		// If not empty space, log ID
		lastId = chunk.id;
		const targetIx = fileTable.findIndex((space) => space.id === null && space.length >= chunk.length);

		// If leftmost empty space is right of current chunk, don't move
		if (targetIx === -1 || targetIx >= i) { continue; }

		// Move the block
		const target = fileTable[targetIx];
		target.length -= chunk.length; // Even if length is 0, leave in to simplify iterator
		fileTable.splice(targetIx, 0, { ...chunk });
		chunk.id = null;
		i++; // Increment iterator since everything just shifted right
	}
	// Build the disk from the file table for final tally
	for (const chunk of fileTable) {
		for (let _ = 0; _ < chunk.length; _++) {
			disks[1].push(!chunk.id ? "." : chunk.id);
		}
	}

	// The final tally
	const checksums = [0, 0];
	for (const part of [0, 1]) {
		for (const block in disks[part]) {
			checksums[part] += +block * (+disks[part][block] || 0);
		}
	}
	
	return checksums;
}

interface FileTableEntry {
	id: number | null;
	length: number;
}