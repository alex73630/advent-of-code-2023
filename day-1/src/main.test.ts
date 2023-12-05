import {
	calibrationSum,
	lineToCalibrationNumber,
	parseSpelledNumbers,
	resolveFirstStep,
	resolveSecondStep
} from "~/main"

describe("lineToCalibrationNumber", () => {
	it("should take '1abc2' and return '12' as a number", () => {
		expect(lineToCalibrationNumber("1abc2")).toBe(12)
	})
	it("should take 'pqr3stu8vwx' and return '38' as a number", () => {
		expect(lineToCalibrationNumber("pqr3stu8vwx")).toBe(38)
	})
	it("should take 'a1b2c3d4e5f' and return '15' as a number", () => {
		expect(lineToCalibrationNumber("a1b2c3d4e5f")).toBe(15)
	})
	it("should take 'treb7uchet' and return '77' as a number", () => {
		expect(lineToCalibrationNumber("treb7uchet")).toBe(77)
	})
	it("should take 'abcdefg' and throw an error", () => {
		const t = () => {
			return lineToCalibrationNumber("abcdefg")
		}
		expect(t).toThrow("No numbers in string")
	})
	it("should take 'two1nine' and return '29' as a number", () => {
		expect(lineToCalibrationNumber("two1nine", true)).toBe(29)
	})
	it("should take 'eightwothree' and return '83' as a number", () => {
		expect(lineToCalibrationNumber("eightwothree", true)).toBe(83)
	})
	it("should take 'abcone2threexyz' and return '13' as a number", () => {
		expect(lineToCalibrationNumber("abcone2threexyz", true)).toBe(13)
	})
	it("should take 'xtwone3four' and return '24' as a number", () => {
		expect(lineToCalibrationNumber("xtwone3four", true)).toBe(24)
	})
	it("should take '4nineeightseven2' and return '42' as a number", () => {
		expect(lineToCalibrationNumber("4nineeightseven2", true)).toBe(42)
	})
	it("should take 'zoneight234' and return '14' as a number", () => {
		expect(lineToCalibrationNumber("zoneight234", true)).toBe(14)
	})
	it("should take '7pqrstsixteen' and return '76' as a number", () => {
		expect(lineToCalibrationNumber("7pqrstsixteen", true)).toBe(76)
	})
})

describe("parseSpelledNumbers", () => {
	it("two1nine > 219", () => {
		expect(parseSpelledNumbers("two1nine")).toBe("219")
	})
	it("eightwothree > 823", () => {
		expect(parseSpelledNumbers("eightwothree")).toBe("823")
	})
	it("abcone2threexyz > abc123xyz", () => {
		expect(parseSpelledNumbers("abcone2threexyz")).toBe("abc123xyz")
	})
	it("xtwone3four > x2134", () => {
		expect(parseSpelledNumbers("xtwone3four")).toBe("x2134")
	})
	it("4nineeightseven2 > 49872", () => {
		expect(parseSpelledNumbers("4nineeightseven2")).toBe("49872")
	})
	it("zoneight234 > z18234", () => {
		expect(parseSpelledNumbers("zoneight234")).toBe("z18234")
	})
	it("7pqrstsixteen > 7pqrst6teen", () => {
		expect(parseSpelledNumbers("7pqrstsixteen")).toBe("7pqrst6teen")
	})
	it("eighthree > 83", () => {
		expect(parseSpelledNumbers("eighthree")).toBe("83")
	})
	it("sevenine > 79", () => {
		expect(parseSpelledNumbers("sevenine")).toBe("79")
	})
})

describe("calibrationSum", () => {
	it("should take the exampleLines and return a total of '142' as a number", () => {
		const exampleLines = ["1abc2", "pqr3stu8vwx", "a1b2c3d4e5f", "treb7uchet"]

		expect(calibrationSum(exampleLines)).toBe(142)
	})
	it("should take the exampleLines with spelled numbers and return a total of '281' as a number", () => {
		const exampleLines = [
			"two1nine",
			"eightwothree",
			"abcone2threexyz",
			"xtwone3four",
			"4nineeightseven2",
			"zoneight234",
			"7pqrstsixteen"
		]

		expect(calibrationSum(exampleLines, true)).toBe(281)
	})
})

describe("resolveFirstStep", () => {
	it("should return '55816'", async () => {
		await expect(resolveFirstStep()).resolves.toBe(55816)
	})
})

describe("resolveSecondStep", () => {
	it("should return '54980'", async () => {
		await expect(resolveSecondStep()).resolves.toBe(54980)
	})
})
