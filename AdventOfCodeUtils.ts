/**
 * AdventOfCodeUtils.ts
 * 
 * Contains a collection of helper functions, classes, and other utilities
 * to simplify and abstract away a lot of the development for solutions to
 * Advent of Code puzzles
 */

// #region Classes

/** Efficient array structure for managing priority queues */
export class Heap<T> {
	private __heap: T[] = [];
	private __compare: (left: T, right: T) => number = () => 0;

	/** Constructs a new heap from a compare function or a new copy from an existing heap */
	constructor(compareOrHeap: Heap<T> | CompareFunction<T>) {
		if (this.__isHeap(compareOrHeap)) {
			this.__copyFrom(compareOrHeap);
		}
		else {
			this.__compare = compareOrHeap;
		}
	}

	/**
	 * Iterator signature to allow for native handling of "for-of" syntax
	 * This default iterator iterates over a deep copy to prevent exhaustion of internal array
	 */
	public *[Symbol.iterator](): Iterator<T> {
		const copy = this.copy();
		while (copy.length) {
			yield copy.pop()!;
		}
	}

	/**
	 * Additional iterator signature to allow for use with "for-of" syntax
	 * This iterator operates on this heap's own internal array
	 */
	public *drain(): IterableIterator<T> {
		while (this.length) {
			yield this.pop()!;
		}
	}

	/** Gives the current number of elements in the heap */
	public get length(): number {
		return this.__heap.length;
	}

	/** Creates and returns a deep copy of this heap */
	public copy(): Heap<T> {
		return new Heap<T>(this);
	}

	/**
	 * Adds a new element to the heap
	 * Returns the heap so it can be chained
	 */
	public add(node: T): Heap<T> {
		this.__heap.push(node);
		this.__upheap(this.length - 1);
		return this;
	}

	/** Dequeues and returns the next element from the heap */
	public pop(): T | null {
		if (!this.length) { return null; }
		this.__swap(0, this.length - 1);
		const value = this.__heap.pop()!;
		this.__downheap();
		return value;
	}

	/** Returns the next element from the heap without removing it */
	public look(): T | null {
		return this.length ? this.__heap[0] : null;
	}

	/** Adjusts the heap from a child up to preserve the heap property */
	private __upheap(index: number): void {
		if (!index) { return; }
		const currentParent = Math.floor((index - 1) / 2);
		const newParent = this.__getRightfulParent(currentParent);
		if (newParent === currentParent) { return; }
		this.__swap(newParent, currentParent);
		this.__upheap(currentParent);
	}

	/** Adjusts the heap from a parent down to preserve the heap property */
	private __downheap(currentParent: number = 0): void {
		const newParent = this.__getRightfulParent(currentParent);
		if (newParent === currentParent) { return; }
		this.__swap(newParent, currentParent);
		this.__downheap(newParent);
	}

	/** Given a parent index, returns which element from among itself and its two children should be the new parent in a reheap operation */
	private __getRightfulParent(index: number): number {
		let parent = index;
		for (const child of [2 * index + 1, 2 * index + 2]) {
			if (child < this.length && this.__compare(this.__heap[parent], this.__heap[child]) > 0) {
				parent = child;
			}
		}
		return parent;
	}

	/** Switches the places of two elements in the heap given their indices */
	private __swap(indexA: number, indexB: number): void {
		[this.__heap[indexA], this.__heap[indexB]] = [this.__heap[indexB], this.__heap[indexA]];
	}

	/** Copies state from the given heap, overwriting any local state */
	private __copyFrom(heap: Heap<T>): void {
		this.__heap = [...heap.__heap];
		this.__compare = heap.__compare;
	}

	/** Checker function for constructor overloading */
	private __isHeap(heapOrCompare: Heap<T> | CompareFunction<T>): heapOrCompare is Heap<T> {
		return heapOrCompare.hasOwnProperty("__heap");
	}
}

// #endregion Classes

// #region Functions

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
	return Math.abs(a * b) / _gcd(a, b);
}

/** Simple Euclidean algorithm implementation that returns the greatest common denominator for a list of numbers */
export function _gcd(a: number, b: number): number {
	let temp;
	a = Math.abs(a);
	b = Math.abs(b);
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

/** Returns straight-line distance between two n-dimensional coordinates */
export function _euclideanDistance(coord1: number[], coord2: number[]): number {
	return Math.sqrt(_squareEuclideanDistance(coord1, coord2));
}

/**
 * Returns the square of the Euclidean distance between two n-dimensional coordinates
 * Safer and faster than true Euclidean distance when indexing and ranking large numbers of distances
 */
export function _squareEuclideanDistance(coord1: number[], coord2: number[]): number {
	if (coord1.length !== coord2.length) { throw new Error("Dimension mismatch."); }
	return coord1.reduce((sum, value, index) => sum + (value - coord2[index]) ** 2, 0);
}

/** Converts a matrix into row echelon form */
export function _refMatrix(matrix: number[][], preserveInts: boolean = false): void {
	const rowCount = matrix.length;
	const colCount = matrix[0].length;
	let pivotRow = 0;
	let pivotCol = 0;

	while (pivotCol < colCount && pivotRow < rowCount) {
		// Locate a row with an element to pivot
		let targetRow = pivotRow;
		while (targetRow < rowCount && matrix[targetRow][pivotCol] === 0) { targetRow++; }
		if (targetRow === rowCount) {
			pivotCol++;
			continue;
		}

		// Swap rows, if necessary
		if (targetRow !== pivotRow) {
			[matrix[targetRow], matrix[pivotRow]] = [matrix[pivotRow], matrix[targetRow]]
		}

		// Clear out column beneath the pivot
		for (let row = pivotRow + 1; row < rowCount; row++) {
			const pivotCell = matrix[pivotRow][pivotCol];
			const targetCell = matrix[row][pivotCol];
			if (targetCell === 0) { continue; }

			// If preserving integer values, scale up accordingly
			const multiple = preserveInts
				? _lcm(pivotCell, targetCell)
				: Math.abs(pivotCell);

			const pivotScale = multiple / Math.abs(pivotCell);
			const rowScale = multiple / Math.abs(targetCell);

			// Multiply rows (respecting sign)
			const pivotMultiplier = pivotScale * Math.sign(pivotCell);
			const rowMultiplier = rowScale * Math.sign(targetCell);

			for (let col = pivotCol; col < colCount; col++) {
				matrix[row][col] = matrix[row][col] * rowMultiplier - matrix[pivotRow][col] * pivotMultiplier;
			}
		}

		pivotRow++;
		pivotCol++;
	}
}

// #endregion Functions

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

/** Comparer function for array.sort() and heap implementations */
export type CompareFunction<T> = (left: T, right: T) => number;

// #endregion Types