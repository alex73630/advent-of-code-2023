import { readFile } from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"
import "~/env"

const __EsFilename = fileURLToPath(import.meta.url)
const __EsDirname = path.dirname(__EsFilename)

interface IGame {
	id: number
	valid?: boolean
	rounds: Round[]
	minCubes?: Round
}

export class Game implements IGame {
	id: number
	valid?: boolean
	rounds: Round[]
	minCubes?: Round

	constructor(game: IGame) {
		this.id = game.id
		this.valid = game.valid
		this.rounds = game.rounds
		this.minCubes = game.minCubes
	}
}

interface Round {
	red: number
	blue: number
	green: number
}

interface Cube {
	color: "red" | "blue" | "green"
	qty: number
}

export function gameLineParser(input: string): Game | null {
	try {
		const gameRegex = new RegExp(/^Game (\d+):(.+)/)

		const [, gameId, roundsLine] = gameRegex.exec(input) ?? []

		if (!gameId || !roundsLine) {
			throw new Error("Invalid game line")
		}

		const cubesPerRounds = roundsLine.split(";").map((round) =>
			round
				.trim()
				.split(",")
				.map((cube) => {
					const cubeLine = cube.trim().split(" ")
					return { qty: Number(cubeLine[0]), color: cubeLine[1] as "red" | "blue" | "green" } as Cube
				})
		)

		const rounds: Round[] = cubesPerRounds.map((round) => {
			return {
				red: round.find((cube) => cube.color === "red")?.qty ?? 0,
				blue: round.find((cube) => cube.color === "blue")?.qty ?? 0,
				green: round.find((cube) => cube.color === "green")?.qty ?? 0
			}
		})

		const minCubes = rounds.reduce(
			(acc, round) => {
				return {
					red: Math.max(acc.red, round.red),
					blue: Math.max(acc.blue, round.blue),
					green: Math.max(acc.green, round.green)
				}
			},
			{ red: 0, blue: 0, green: 0 }
		)

		return new Game({
			id: Number(gameId),
			rounds,
			minCubes
		})
	} catch (error) {
		console.warn(`Failed to parse game line: ${input}`)
		return null
	}
}

export function validateGame(game: Game, bagConfig: Round): Game {
	const valid = game.rounds.every((round) => {
		const redValid = round.red <= bagConfig.red
		const blueValid = round.blue <= bagConfig.blue
		const greenValid = round.green <= bagConfig.green

		return redValid && blueValid && greenValid
	})

	return {
		...game,
		valid
	}
}

export function computeValidGamesIdSum(games: Game[]): number {
	return games.filter((game) => game.valid).reduce((acc, game) => acc + game.id, 0)
}

export function computeCubeSetPower(game: Game): number {
	if (!game.minCubes) return 0

	return game.minCubes.red * game.minCubes.blue * game.minCubes.green
}

export function computeGamesCubeSetPowerSum(games: Game[]): number {
	return games.reduce((acc, game) => acc + computeCubeSetPower(game), 0)
}

export async function loadInputLines(filename: string): Promise<string[]> {
	const file = await readFile(path.join(__EsDirname, "../input/", filename), "utf-8")

	return file.split("\n")
}

export async function main() {
	console.log("Hello World!")

	const input = (await loadInputLines("input1.txt")).filter((line) => line.length > 0)

	const bagConfig = {
		red: 12,
		green: 13,
		blue: 14
	}

	const games = input.map(gameLineParser).filter(Boolean) as Game[]

	const verifiedGames = games.map((game) => validateGame(game, bagConfig))

	const sum = computeValidGamesIdSum(verifiedGames)

	console.dir(
		verifiedGames.map(({ id, valid, minCubes }) => ({ id, valid, minCubes })),
		{ depth: 10 }
	)

	const power = computeGamesCubeSetPowerSum(games)

	console.log(sum, power)

	return
}

void main()
