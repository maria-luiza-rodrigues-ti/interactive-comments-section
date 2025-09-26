import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "../database/client.ts";
import { comments } from "../database/schema.ts";
import { eq } from "drizzle-orm";

export const updateCommentRoute: FastifyPluginAsyncZod = async (server) => {
  server.put(
    "/comments/:id",
    {
      schema: {
        tags: ["comments"],
        summary: "Update comment",
        params: z.object({
          id: z.uuid(),
        }),
        body: z.object({
          content: z.string(),
          score: z.number().optional(),
        }),
        response: {
          200: z.object({
            comment: z.object({
              id: z.uuid(),
              postId: z.uuid(),
              userId: z.uuid(),
              parentCommentId: z.uuid().nullable(),
              content: z.string(),
              score: z.number().nullable(),
              createdAt: z.date().nullable(),
            }),
          }),
          404: z.null().describe("Comment not found"),
        },
      },
    },
    async (request, reply) => {
      const commentId = request.params.id;
      const { content, score } = request.body;

      const result = await db
        .update(comments)
        .set({
          content: content,
          score: score ?? 0,
        })
        .where(eq(comments.id, commentId))
        .returning();

      if (result.length > 0) {
        return reply.status(200).send({ comment: result[0] });
      }

      return reply.status(404).send();
    }
  );
};
