import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "../database/client.ts";
import { posts } from "../database/schema.ts";

export const getPostsRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/posts",
    {
      schema: {
        tags: ["posts"],
        summary: "Get all posts",
        queryString: z.object({
          search: z.string().optional(),
          orderBy: z.enum(["content", "username"]).optional(),
          page: z.coerce.number().optional(),
        }),
        response: {
          200: z.object({
            posts: z.array(
              z.object({
                id: z.uuid(),
                userId: z.uuid(),
                content: z.string(),
                createdAt: z.date().nullable(),
              })
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const result = await db.select().from(posts);

      return reply.status(200).send({ posts: result });
    }
  );
};
