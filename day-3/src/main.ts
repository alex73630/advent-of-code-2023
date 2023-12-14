import { readFile } from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"

import chalk from "chalk"
import "~/env"
import lodash from "lodash"
// eslint-disable-next-line @typescript-eslint/unbound-method
const { cloneDeep } = lodash

const __EsFilename = fileURLToPath(import.meta.url)
const __EsDirname = path.dirname(__EsFilename)

export class Grid {
	private grid: string[][]

	numbers = new Map<
		string,
		{
			line: number
			start: number
			end: number
			val: string
			symbols: { x: number; y: number; val: string }[]
		}
	>()

	constructor(grid: string[][]) {
		this.grid = grid
	}

	public get(x: number, y: number): string {
		if (this.isOutOfBounds(x, y)) {
			throw new Error(`Out of bounds: ${x}, ${y}`)
		}
		return this.grid[y]![x]!
	}

	public set(x: number, y: number, value: string): void {
		if (this.isOutOfBounds(x, y)) {
			throw new Error(`Out of bounds: ${x}, ${y}`)
		}
		this.grid[y]![x] = value
	}

	public get width(): number {
		return this.grid[0]?.length || 0
	}

	public get height(): number {
		return this.grid.length
	}

	public getAdjacent(x: number, y: number): { x: number; y: number; val: string }[] {
		const adjacent: { x: number; y: number; val: string }[] = []

		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				if (i === 0 && j === 0) {
					continue
				}

				try {
					const val = this.get(x + i, y + j)

					if (val && val !== ".") {
						adjacent.push({ x: x + i, y: y + j, val })
					}
				} catch (error) {
					continue
				}
			}
		}

		return adjacent
	}

	public getAllNumbers(): {
		line: number
		start: number
		end: number
		val: string
		symbols: { x: number; y: number; val: string }[]
	}[] {
		if (this.numbers.size > 0) {
			return [...this.numbers.values()]
		}

		const numbers: {
			line: number
			start: number
			end: number
			val: string
			symbols: { x: number; y: number; val: string }[]
		}[] = []

		for (let y = 0; y < this.height; y++) {
			const row = this.grid[y]!

			for (let x = 0; x < this.width; x++) {
				const val = row[x]!

				if (val && val !== "." && !isNaN(Number(val))) {
					let end = row.slice(x).findIndex((val) => isNaN(Number(val))) + x

					if (end <= x) {
						end = row.slice(x).length + x
					}

					const value = row.slice(x, end).join("")

					const adjacentSymbols = getAllAdjacentSymbols(this, y, x, end)

					numbers.push({ line: y, start: x, end, val: value, symbols: adjacentSymbols })

					x = x + value.length
				}
			}
		}

		for (const number of numbers) {
			this.numbers.set([number.val, number.start, number.end, number.line].join("-"), number)
		}

		return numbers
	}

	public isOutOfBounds(x: number, y: number): boolean {
		return x < 0 || y < 0 || x >= this.width || y >= this.height
	}

	public async printGridWithColoredNumbers(): Promise<void> {
		if (this.numbers.size === 0) {
			await new Promise((r) => r(this.getAllNumbers()))
		}

		// Change numbers with at least a symbol to gold using the numbers start and end coordinates
		const clonedGrid = cloneDeep(this.grid)

		for (const number of this.numbers.values()) {
			if (number.symbols.length > 0) {
				for (let x = number.start; x < number.end; x++) {
					clonedGrid[number.line]![x] = chalk.bold.yellow(clonedGrid[number.line]![x])
				}

				// Change symbols to green
				for (const symbol of number.symbols) {
					clonedGrid[symbol.y]![symbol.x] = chalk.bold.green(clonedGrid[symbol.y]![symbol.x])
				}
			} else {
				for (let x = number.start; x < number.end; x++) {
					clonedGrid[number.line]![x] = chalk.bold.red(clonedGrid[number.line]![x])
				}
			}
		}

		// Print the grid
		console.log(clonedGrid.map((row) => row.join("")).join("\n"))
	}
}

function getAllAdjacentSymbols(
	grid: Grid,
	line: number,
	start: number,
	end: number
): { x: number; y: number; val: string }[] {
	const adjacent: { x: number; y: number; val: string }[] = []

	for (let x = start; x < end; x++) {
		const val = grid.getAdjacent(x, line).filter((val) => isNaN(Number(val.val)))

		adjacent.push(...val)
	}

	return adjacent
}

export function sumPartNumbers(numbers: ReturnType<typeof Grid.prototype.getAllNumbers>): number {
	return numbers.filter((n) => n.symbols.length > 0).reduce((acc, curr) => acc + Number(curr.val), 0)
}

export async function main() {
	console.log("Hello World!")

	const grid = new Grid(await loadInputGrid("input.txt"))

	// console.dir(grid.getAllNumbers(), { depth: null })

	console.log(sumPartNumbers(grid.getAllNumbers()))

	void grid.printGridWithColoredNumbers()

	return "Hello World!"
}

export async function loadInputGrid(filename: string): Promise<string[][]> {
	const file = await readFile(path.join(__EsDirname, "../input/", filename), "utf-8")

	return file.split("\n").map((line) => line.split(""))
}

void main()
