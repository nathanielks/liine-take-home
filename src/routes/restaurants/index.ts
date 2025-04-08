import type { FastifyPluginAsync } from "fastify";

const restaurants: FastifyPluginAsync = async (
	fastify,
	opts,
): Promise<void> => {
	fastify.get("/", async function (request, reply) {
		// TODO: query restaurants
		// TODO: return restaurants
		return [];
	});
};

export default restaurants;
