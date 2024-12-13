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

// #region Interfaces

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

/** Standard return type of AOC solutions, any array of string-able primitives */
export type Solution = { toString: VoidFunction }[];

// #endregion Types