import type { FastifyPluginAsync, FastifyRequest } from "fastify";
import { eq, and, lte, gt } from "drizzle-orm";
import { restaurantsTable, restaurantHoursTable } from "../../db/schema.js";

type RestaurantsRequest = FastifyRequest<{
	Querystring: { datetime: string };
}>;

const restaurants: FastifyPluginAsync = async (
	fastify,
	opts,
): Promise<void> => {
	fastify.get(
		"/",
		{
			schema: {
				querystring: {
					type: "object",
					properties: {
						datetime: {
							type: "string",
						},
					},
				},
			},
		},
		async function (request: RestaurantsRequest, reply) {
			const datetimeParam = request.query.datetime;
			const timestamp = Date.parse(datetimeParam);
			if (Number.isNaN(timestamp))
				throw new Error("Datetime parameter provided is invalid");
			const date = new Date(timestamp);
			const time = Number(`${date.getHours()}${date.getMinutes()}`);
			const query = fastify.db
				.select({ name: restaurantsTable.name })
				.from(restaurantsTable)
				.innerJoin(
					restaurantHoursTable,
					eq(restaurantsTable.id, restaurantHoursTable.restaurant_id),
				)
				.where(
					and(
						eq(restaurantHoursTable.weekday, date.getDay()),
						lte(restaurantHoursTable.time_open, time),
						gt(restaurantHoursTable.time_closed, time),
					),
				);
			const results = await query.all();
			return results.map(({ name }) => name);
		},
	);
};

export default restaurants;
