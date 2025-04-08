import { test } from "node:test";
import * as assert from "node:assert";
import { build } from "../helper.js";

test("queries restaurants", async (t) => {
	const app = await build(t);

	const res = await app.inject({
		url: "/restaurants",
	});

	assert.equal(res.payload, "[]");
});
