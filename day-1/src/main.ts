import { readFile } from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"

import "~/env"

const __EsFilename = fileURLToPath(import.meta.url)
const __EsDirname = path.dirname(__EsFilename)

const numbersList = {
	one: "1",
	two: "2",
	three: "3",
	four: "4",
	five: "5",
	six: "6",
	seven: "7",
	eight: "8",
	nine: "9"
}
const numbersListWordsArray = Object.keys(numbersList) as (keyof typeof numbersList)[]

export function calibrationSum(lines: string[], replaceSpelledNumbers = false) {
	const numbers = lines.map((line) => lineToCalibrationNumber(line, replaceSpelledNumbers))

	const sum = numbers.reduce((i, total) => total + i, 0)

	return sum
}

export function lineToCalibrationNumber(input: string, replaceSpelledNumbers = false) {
	let str = input.toLowerCase().trim().replace(" ", "")
	if (replaceSpelledNumbers) {
		str = parseSpelledNumbers(input)
	}

	// strip everything that is not a number
	const output = str
		.split("") // ["1", "a", "b", ...]
		.map((character) => {
			try {
				return Number.parseInt(character, 10)
			} catch (error) {
				return NaN
			}
		})
		.filter((i) => !Number.isNaN(i))

	if (output.length === 0) {
		throw new Error("No numbers in string")
	}

	const firstDigit = output[0]!

	const lastDigit = output[output.length - 1]!

	return Number.parseInt(`${firstDigit}${lastDigit}`)
}

export function parseSpelledNumbers(input: string) {
	const matches = numbersListWordsArray
		.flatMap((nb) => {
			const regex = new RegExp(nb, "gi")
			const matches = [...input.matchAll(regex)]
			const indexes: number[] = []
			matches.forEach((match) => {
				if (match.index !== undefined) {
					indexes.push(match.index)
				}
			})

			if (indexes.length > 0) {
				const value = numbersList[nb]

				return indexes.map((index) => ({
					nb,
					index,
					endIndex: index + nb.length,
					value: Number.parseInt(value)
				}))
			}

			return null
		})
		.filter(Boolean) as {
		nb: string
		index: number
		endIndex: number
		value: number
	}[]

	const sortedMatches = matches
		.sort((a, b) => a.index - b.index)
		.sort((a, b) => (a.index === b.index && a.value > b.value ? -1 : 1))

	const fixConflictsMatches = sortedMatches.map((match) => {
		const conflictingMatch = sortedMatches.find(
			(m) => m.nb !== match.nb && between(match.index, m.index, m.endIndex)
		)

		if (conflictingMatch) {
			match.index = conflictingMatch.endIndex
		}

		return match
	})

	let output = input

	fixConflictsMatches.sort((a, b) => b.index - a.index)

	fixConflictsMatches.forEach(({ index, endIndex, value }) => {
		output = output.substring(0, index) + value + output.substring(endIndex)
	})

	return output
}

function between(x: number, min: number, max: number) {
	return x >= min && x < max
}

export async function resolveFirstStep() {
	const file = await readFile(path.join(__EsDirname, "../input/calibration-document.txt"), "utf-8")

	const lines = file.split("\n")

	const sum = calibrationSum(lines)

	return sum
}

export async function resolveSecondStep() {
	const file = await readFile(path.join(__EsDirname, "../input/calibration-document.txt"), "utf-8")

	const lines = file.split("\n")

	const sum = calibrationSum(lines, true)

	return sum
}
