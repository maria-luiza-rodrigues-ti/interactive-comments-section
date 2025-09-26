import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "../database/client.ts";
import { posts } from "../database/schema.ts";

export const createPostRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/posts",
    {
      schema: {
        tags: ["posts"],
        summary: "Create post",
        body: z.object({
          content: z.string(),
          userId: z.uuid(),
        }),
        response: {
          201: z.object({
            postId: z.uuid(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { content, userId } = request.body;

      const result = await db
        .insert(posts)
        .values({
          content: content,
          userId: userId,
        })
        .returning();

      return reply.status(201).send({ postId: result[0].id });
    }
  );
};
