import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { eq } from "drizzle-orm";

import { db } from "../database/client.ts";
import { posts, users } from "../database/schema.ts";

export const getPostByIdRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/posts/:id",
    {
      schema: {
        tags: ["posts"],
        summary: "Get post by id",
        params: z.object({
          id: z.uuid(),
        }),
        response: {
          200: z.object({
            post: z.object({
              id: z.uuid(),
              userId: z.uuid(),
              content: z.string(),
              createdAt: z.date().nullable(),
              username: z.string().nullable(),
              avatar: z.string().nullable(),
            }),
          }),
          404: z.null().describe("Post not found"),
        },
      },
    },
    async (request, reply) => {
      const postId = request.params.id;

      const result = await db
        .select({
          id: posts.id,
          userId: posts.userId,
          content: posts.content,
          createdAt: posts.createdAt,
          username: users.username,
          avatar: users.avatar,
        })
        .from(posts)
        .leftJoin(users, eq(posts.userId, users.id))
        .where(eq(posts.id, postId));

      if (result.length > 0) {
        return {
          post: result[0],
        };
      }

      return reply.status(404).send();
    }
  );
};
