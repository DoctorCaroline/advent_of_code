import * as utils from "../../AdventOfCodeUtils";

const __rulePattern = /^(\d+): (.*)$/;
const __stringSubrulePattern = /^"(.*)\"$/;
const __messagePattern =  /^[ab]+$/;

/** Day 19 Solution */
export function solution(rawInput: string[]): utils.Solution {

	const ruleMap: utils.StringKeyedObject<string[][]> = {}
	const messages: string[] = [];

	for (const line of rawInput) {
		const ruleMatch = line.match(__rulePattern);
		if (ruleMatch) {
			const [_, id, rawRule] = ruleMatch;

			const rule: string[][] = [];
			ruleMap[id] = rule;

			const rawSubrules = rawRule.split(" | ");
			for (const subrule of rawSubrules) {
				const stringSubrule = subrule.match(__stringSubrulePattern);
				if (stringSubrule) {
					rule.push([stringSubrule[1]]);
					continue;
				}
				rule.push(subrule.split(" "));
			}
		}

		if (line.match(__messagePattern)) {
			messages.push(line);
		}
	}

	// Recursively formalize rules into regex
	const getRegex = (ruleID: string) => {
		if (isNaN(+ruleID)) { return `${ruleID}`; }
		const rules = ruleMap[ruleID];
		const subRegexes: string[] = [];
		for (const rule of rules) {
			subRegexes.push(`${rule.map(subrule => getRegex(subrule)).join("")}`);
		}
		return `(${subRegexes.join("|")})`;
	};

	const regex0 = new RegExp(`^${getRegex("0")}$`);
	const regex1 = new RegExp(`^(${getRegex("42")}+)(${getRegex("31")}+)$`);

	const out = [0, 0];

	for (const message of messages) {
		out[0] += +!!message.match(regex0);
		const match = message.match(regex1);
		if (!match) { continue; }
		out[1] += +(match[0].length < 2 * match[1].length);
	}
	
	return out;
}