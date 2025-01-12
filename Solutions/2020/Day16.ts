import * as utils from "../../AdventOfCodeUtils";

/** Day 16 Solution */
export function solution(rawInput: string[]): utils.Solution {

	const ranges: utils.StringKeyedObject<number[][]> = {};
	const myTicket: number[] = [];
	const tickets: number[][] = [];
	const out = [0];
	
	for (const line of rawInput) {
		const range = line.match(/^(.*): (\d*)-(\d*) or (\d*)-(\d*)$/)?.slice(1, 6);
		if (range) { ranges[range[0]] = [[+range[1], +range[2]], [+range[3], +range[4]]]; }

		const ticketMatch = line.match(/^\d+(,\d*)*$/);
		if (!ticketMatch) { continue; }
		const ticket = line.split(",").map(n => +n);

		if (!myTicket.length) { myTicket.push(...ticket); }
		tickets.push(ticket);
	}

	const consolidatedRanges: number[][] = [];
	for (const field in ranges) {
		for (const range of ranges[field]) {
			consolidatedRanges.push([...range]);
		}
	}
	consolidatedRanges.sort((a, b) => a[0] - b[0]);
	for (let ix = 0; ix < consolidatedRanges.length; ix++) {
		const current = consolidatedRanges[ix];
		let next: number[];
		while (current[1] >= (next = consolidatedRanges[ix + 1])?.[0]) {
			current[1] = Math.max(current[1], next[1]);
			consolidatedRanges.splice(ix + 1, 1);
		}
	}

	for (let ix = 0; ix < tickets.length; ix++) {
		const ticket = tickets[ix];
		let ticketIsValid = true;
		for (const value of ticket) {
			let valueIsValid = false;
			for (const range of consolidatedRanges) {
				if (value >= range[0] && value <= range[1]) {
					valueIsValid = true;
					break;
				}
			}
			ticketIsValid &&= valueIsValid;
			out[0] += value * +(!valueIsValid);
		}
		if (!ticketIsValid) {
			tickets.splice(ix--, 1);
		}
	}

	const fieldSequence: string[] = new Array(tickets[0].length).fill("");
	while (true) {
		for (const ix in fieldSequence) {
			if (fieldSequence[ix]) { continue; }
			const candidates: string[] = [];
			for (const field in ranges) {
				if (!__allIndexedInRanges(ranges[field], tickets, +ix)) { continue; }
				candidates.push(field);
				if (candidates.length > 1) { break; }
			}
			if (candidates.length === 1) {
				fieldSequence[ix] = candidates[0];
				delete ranges[candidates[0]];
				break;
			}
		}
		if (fieldSequence.every(Boolean)) { break; }
	}

	out.push(fieldSequence.reduce((prod, field, ix) => {
		return field.includes("departure")
			? myTicket[ix] * prod
			: prod;
	}, 1));
	
	return out;
}

function __allIndexedInRanges(ranges: number[][], tickets: number[][], index: number): boolean {
	for (const ticket of tickets) {
		const value = ticket[index];
		let validRangeFound = false;
		for (const range of ranges) {
			if (value >= range[0] && value <= range[1]) {
				validRangeFound = true;
				break;
			}
		}
		if (!validRangeFound) { return false; }
	}
	return true;
}