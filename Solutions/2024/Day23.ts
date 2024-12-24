import * as utils from "../../AdventOfCodeUtils";

/** Day 23 Solution */
export function solution(rawLinks: string[]): utils.Solution {

	rawLinks.forEach(linkStr => {
		const link = linkStr.split("-");
		for (let side = 0; side < 2; side++) {
			(links[link[side]] ||= []).push(link[side ^ 1]);
		}
	});
	
	const trios: utils.StringKeyedObject<true> = {};
	const alreadyMapped: utils.StringKeyedObject<true> = {};
	let largestSubgraph: string[] = [];
	for (const node in links) {

		if (alreadyMapped[node]) { continue; } // Node was identified as a member of another already-mapped subgraph
		const subgraph = __largestFullyConnectedSubgraph([node], links[node]);
		for (const node of subgraph) { alreadyMapped[node] = true; } // Mark all nodes in subgraph as mapped
		
		// Sort subgraph to ensure proper trio deduplication (and eventual output for longest)
		subgraph.sort();
		__logTrios(trios, subgraph);
		
		// If it's the biggest so far, keep it
		if (subgraph.length > largestSubgraph.length) { largestSubgraph = subgraph; }
	}

	let tTrioCount = 0;
	for (const trio in trios) {	tTrioCount += +!!trio.match(/(^t|,t)/); }

	return [tTrioCount, largestSubgraph];
}

const links: utils.StringKeyedObject<string[]> = {};

function __logTrios(trios: utils.StringKeyedObject<true>, subgraph: string[]): void {
	if (subgraph.length < 3) { return; }
	for (let i = 0; i < subgraph.length - 2; i++) {
		for (let j = i + 1; j < subgraph.length - 1; j++) {
			for (let k = j + 1; k < subgraph.length; k++) {
				trios[`${subgraph[i]},${subgraph[j]},${subgraph[k]}`] = true;
			}
		}
	}
}

function __largestFullyConnectedSubgraph(subgraph: string[], candidates: string[]) {

	// If no candidates remaining, this is the whole subgraph
	if (!candidates.length) { return subgraph; }
	// Dereference candidates so we can freely manipulate
	candidates = [...candidates];
	
	let largestSubgraph = subgraph;

	while (candidates.length) {
		const candidate = candidates.shift()!;
		if (subgraph.some(node => !links[node].includes(candidate))) {
			// Not all members of the subgraph point to the candidate; can't use
			continue;
		}

		// Recurse with candidate added to the subgraph
		const subgraphWithCandidate = __largestFullyConnectedSubgraph([...subgraph, candidate], candidates);
		// Remove any other candidates aggregated to subgraph in downstream recursion (will just be retracing steps)
		candidates = candidates.filter(node => !subgraphWithCandidate.includes(node));
		// If this subgraph is the longest so far, keep it
		if (subgraphWithCandidate.length > largestSubgraph.length) {
			largestSubgraph = subgraphWithCandidate;
		}
	}

	return largestSubgraph;
}