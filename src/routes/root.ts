import type { FastifyPluginAsync } from "fastify";

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	fastify.get("/", async function (request, reply) {
		reply
			.code(200)
			.type("text/html")
			.send(
				'<div style="width:100%;height:0;padding-bottom:56%;position:relative;"><iframe src="https://giphy.com/embed/10bxTLrpJNS0PC" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/dancing-cartoons-adventure-time-10bxTLrpJNS0PC">via GIPHY</a></p>',
			);
	});
};

export default root;
