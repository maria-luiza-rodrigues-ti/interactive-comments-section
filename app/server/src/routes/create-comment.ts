import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "../database/client.ts";
import { comments } from "../database/schema.ts";

export const createCommentRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/comments",
    {
      schema: {
        tags: ["comments"],
        summary: "Create comment",
        body: z.object({
          postId: z.uuid(),
          userId: z.uuid(),
          parentCommentId: z.uuid().nullable(),
          content: z.string(),
        }),
        response: {
          201: z.object({
            commentId: z.uuid(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { postId, userId, parentCommentId, content } = request.body;

      const result = await db
        .insert(comments)
        .values({
          postId: postId,
          userId: userId,
          content: content,
          parentCommentId: parentCommentId ?? null,
        })
        .returning();

      return reply.status(201).send({ commentId: result[0].id });
    }
  );
};
