import { Game, computeValidGamesIdSum, gameLineParser, loadInputLines, validateGame } from "~/main"

describe("gameLineParser", () => {
	let games: string[]
	beforeAll(async () => {
		games = await loadInputLines("example1.txt")
	})
	it("should return a valid game output from examples", () => {
		const results = games.map(gameLineParser)

		results.map((result) => {
			expect(result).toBeInstanceOf(Game)
		})
	})
})

describe("validateGame", () => {
	let exampleGames: Game[]
	const bagConfig = {
		red: 12,
		green: 13,
		blue: 14
	}
	beforeAll(async () => {
		exampleGames = (await loadInputLines("example1.txt")).map(gameLineParser).filter(Boolean) as Game[]
	})

	it("should return valid games for games id 1, 2 and 5", () => {
		const results = exampleGames
			.filter((game) => [1, 2, 5].includes(game.id))
			.map((game) => validateGame(game, bagConfig))
			.map((game) => game.valid)

		expect(results).toEqual([true, true, true])
	})
	it("should return invalid games for games id 3 and 4", () => {
		const results = exampleGames
			.filter((game) => [3, 4].includes(game.id))
			.map((game) => validateGame(game, bagConfig))
			.map((game) => game.valid)

		expect(results).toEqual([false, false])
	})
})

describe("computeValidGamesIdSum", () => {
	let exampleGames: Game[]
	const bagConfig = {
		red: 12,
		green: 13,
		blue: 14
	}
	beforeAll(async () => {
		exampleGames = ((await loadInputLines("example1.txt")).map(gameLineParser).filter(Boolean) as Game[]).map(
			(game) => validateGame(game, bagConfig)
		)
	})

	it("should return the sum of 8 for example games", () => {
		expect(computeValidGamesIdSum(exampleGames)).toEqual(8)
	})
})
