/**
 * AdventOfCodeUtils.ts
 * 
 * Contains a collection of helper functions, classes, and other utilities
 * to simplify and abstract away a lot of the development for solutions to
 * Advent of Code puzzles
 */

/** Generates a PromiseResolvePair<T> for the specified type T */
export function _makePromise<T>(): PromiseResolvePair<T> {
	let resolve: (value: T) => void = () => {};
	let promise = new Promise<T>(res => { resolve = res; });
	return { promise, resolve };
}

/** Given two points, A and B, returns a linear function that passes through both points */
export function _linearFit(pointA: number[], pointB: number[]): (x: number) => number {
	const mNum = pointB[1] - pointA[1];
	const mDenom = pointB[0] - pointA[0];
	const bNum = mDenom * pointA[1] - mNum * pointA[0];
	return (x: number) => (mNum * x + bNum) / mDenom;
}

/** Given an arbitrarily keyed object, returns the number of keys with values assigned to the object */
export function _countObjectNodes(object: Object): number {
	let count = 0;
	for (const _ in object) { count++; }
	return count;
}

/** Returns a memoized version of the provided function */
export function _memo<F extends (...args: any) => any>(fn: F): (...args: Parameters<F>) => ReturnType<F> {
	var storage = new Map();
	return (...args: Parameters<F>) => {
		var key = JSON.stringify(args);
		if (!storage.has(key)) {
			storage.set(key, fn(...args));
		}
		return storage.get(key) as ReturnType<F>;
	};
}

/** Generates a linked list from an array and returns the initial value of the list */
export function _makeLinkedList<T>(arr: T[]): LinkedListEntry<T> | null {
	if (!arr.length) { return null; }
	const initial: LinkedListEntry<T> = {
		value: arr.shift()!,
		prev: null,
		next: null,
	}
	let previous = initial;
	while (arr.length) {
		previous = _linkedListInsertAfter(previous, arr.shift()!);
	}
	return initial;
}

/** Inserts a new value prior to the specified element of a linked list */
export function _linkedListInsertBefore<T>(location: LinkedListEntry<T>, value: T): LinkedListEntry<T> {
	const insertAfter = location.prev;
	if (insertAfter) { _linkedListInsertAfter(insertAfter, value); }
	const newEntry: LinkedListEntry<T> = {
		value,
		prev: null,
		next: location,
	}
	location.prev = newEntry;
	return newEntry;
}

/** Inserts a new value after the specified element of a linked list */
export function _linkedListInsertAfter<T>(location: LinkedListEntry<T>, value: T): LinkedListEntry<T> {
	const newEntry: LinkedListEntry<T> = {
		value,
		prev: location,
		next: location.next,
	}
	if (location.next) { location.next.prev = newEntry; }
	location.next = newEntry;
	return newEntry;
}

/** Returns the mean of a list of numbers */
export function _mean(list: number[]): number {
	return list.reduce((total, element) => total + element, 0) / list.length;
}

/** Returns the variance of a list of numbers */
export function _variance(list: number[]): number {
	const mean = _mean(list);
	return list.reduce((total, element) => total + (element - mean) ** 2, 0) / list.length;
}

/** Given an ordered set of integer coordinates of arbitrary dimension, returns all adjacent integer coordinates */
export function _getAdjacents(coords: number[], includeDiagonals: boolean = false): number[][] {
	
	const diffs = [-1, 0, 1];
	const moves: number[][] = [[]];
	while (moves[0].length < coords.length) {
		const move = moves.shift()!;
		for (const diff of diffs) {
			moves.push([...move, diff]);
		}
	}

	const adjacents: number[][] = [];
	for (const move of moves) {
		if (!move.some(Boolean)) { continue; } // All zeros (not a move)
		if (move.filter(Boolean).length > 1 && !includeDiagonals) { continue; }
		adjacents.push(move.map((value, axis) => value + coords[axis]));
	}

	return adjacents;
}

/** Given two ordered pairs, returns the Manhattan distance between them */
export function _manhattanDistance(pairA: number[], pairB: number[]): number {
	return Math.abs(pairA[0] - pairB[0]) + Math.abs(pairA[1] - pairB[1]);
}

/** Given a pair of numbers, returns their least common multiple */
export function _lcm(a: number, b: number): number {
	return a * b / _gcd(a, b);
}

/** Simple Euclidean algorithm implementation that returns the greatest common denominator for a list of numbers */
export function _gcd(a: number, b: number): number {
	let temp;
	while (b !== 0) {
		temp = b;
		b = a % b;
		a = temp;
	}
	return a;
};

/** Given a divisor and dividend, returns the *positive* remainder of their division */
export function _mod(divisor: number, dividend: number): number {
	return (divisor % dividend + dividend) % dividend;
}

/** Adds all the values in the given array */
export function _sum(arr: number[]): number {
	return arr.reduce((prev, curr) => prev + curr, 0);
}

/** Multiplies all the values in the given array */
export function _product(arr: number[]): number {
	return arr.reduce((prev, curr) => prev * curr, 1);
}

// #region Interfaces

/** Numerically indexed queue of states in a pathfinding algorithm that have yet to be evaluated */
export interface IDijkstraQueue {
	[cost: number]: string[];
}

/**
 * Simple JS object containing a promise/resolver pair
 * to facilitate asynchronous execution.
 */
export interface PromiseResolvePair<T> {
	promise: Promise<T>,
	resolve: (value: T) => void,
}

/** A single entry in a linked list */
export interface LinkedListEntry<T> {
	value: T;
	prev: LinkedListEntry<T> | null;
	next: LinkedListEntry<T> | null;
}

// #endregion Intefaces

// #region Types

/** Simple string-keyed object whose values are all of type T */
export type StringKeyedObject<T> = { [key: string]: T }

/** Simple string-keyed object whose values are all of type T */
export type NumberKeyedObject<T> = { [key: number]: T }

/** Standard return type of AOC solutions, any array of string-able primitives */
export type Solution = { toString: VoidFunction }[];

// #endregion Types