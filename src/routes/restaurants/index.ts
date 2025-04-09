import type { FastifyPluginAsync } from "fastify";
// import { eq, and, lt, gte } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { restaurantsTable, restaurantHoursTable } from "../../db/schema.js";

const restaurants: FastifyPluginAsync = async (
	fastify,
	opts,
): Promise<void> => {
	fastify.get("/", async function (request, reply) {
		const results = await fastify.db
			.select({ name: restaurantsTable.name })
			// .select()
			.from(restaurantsTable)
			.innerJoin(
				restaurantHoursTable,
				eq(restaurantsTable.id, restaurantHoursTable.restaurant_id),
			)
			.where(eq(restaurantHoursTable.weekday, 1))
			.all();
		// return results
		return results.map(({ name }) => name);
	});
};

export default restaurants;
