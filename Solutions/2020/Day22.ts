import * as utils from "../../AdventOfCodeUtils";

/** Day 22 Solution */
export function solution(rawInput: string[]): utils.Solution {
	
	const players: number[][] = [];
	let currentPlayer: number[] = [];
	for (const line of rawInput) {
		if (!line) { continue; }
		if (!isNaN(+line)) {
			currentPlayer.push(+line);
			continue;
		}
		currentPlayer = [];
		players.push(currentPlayer);
	}
	const [player1, player2] = players;

	const scoreHand = (hand: number[]) => {
		return hand.reduce((sum, value, index) => sum + value * (hand.length - index), 0);
	}

	const playCombat = utils._memo((player1: number[], player2: number[], isRecursive: boolean = false) => {
		const recursionCache = isRecursive ? new Set<string>() : null;

		while (player1.length && player2.length) {
			if (isRecursive) {
				const gameState = `${player1.join(",")};${player2.join(",")}`;
				if (recursionCache!.has(gameState)) { return scoreHand(player1) }
				recursionCache!.add(gameState);
			}

			const card1 = player1.shift()!;
			const card2 = player2.shift()!;
			let outcome = card1 - card2;

			if (isRecursive && card1 <= player1.length && card2 <= player2.length) {
				outcome = playCombat(
					player1.slice(0, card1),
					player2.slice(0, card2),
					isRecursive);
			}
			
			outcome > 0
				? player1.push(card1, card2)
				: player2.push(card2, card1);
		}
		
		return player1.length
			? scoreHand(player1)
			: -scoreHand(player2);
	});

	return [
		Math.abs(playCombat([...player1], [...player2])),
		Math.abs(playCombat(player1, player2, true))
	];
}