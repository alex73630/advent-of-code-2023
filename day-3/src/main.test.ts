import { main } from "~/main"

describe("main", () => {
	it("should return 'Hello World!'", async () => {
		await expect(main()).resolves.toBe("Hello World!")
	})
})
