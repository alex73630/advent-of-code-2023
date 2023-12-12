import {
	Game,
	computeCubeSetPower,
	computeGamesCubeSetPowerSum,
	computeValidGamesIdSum,
	gameLineParser,
	loadInputLines,
	validateGame
} from "~/main"

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
	it("should return a minCube of 4 red, 2 green and 6 blue for first example", () => {
		const results = games.map(gameLineParser)
		const result = results.find((game) => game?.id === 1)

		expect(result?.minCubes).toEqual({
			red: 4,
			green: 2,
			blue: 6
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

describe("computeCubeSetPower", () => {
	let exampleGames: Game[]
	beforeAll(async () => {
		exampleGames = (await loadInputLines("example1.txt")).map(gameLineParser).filter(Boolean) as Game[]
	})

	it("should return the sum of 48 for the first example game", () => {
		const game = exampleGames.find((game) => game.id === 1)
		expect(computeCubeSetPower(game!)).toEqual(48)
	})

	it("should return the sum of 12 for the second example game", () => {
		const game = exampleGames.find((game) => game.id === 2)
		expect(computeCubeSetPower(game!)).toEqual(12)
	})

	it("should return the sum of 1560 for the third example game", () => {
		const game = exampleGames.find((game) => game.id === 3)
		expect(computeCubeSetPower(game!)).toEqual(1560)
	})
})

describe("computeGamesCubeSetPowerSum", () => {
	let exampleGames: Game[]
	beforeAll(async () => {
		exampleGames = (await loadInputLines("example1.txt")).map(gameLineParser).filter(Boolean) as Game[]
	})

	it("should return the sum of 2286 for example games", () => {
		expect(computeGamesCubeSetPowerSum(exampleGames)).toEqual(2286)
	})
})
