import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "../database/client.ts";
import { comments } from "../database/schema.ts";
import { eq } from "drizzle-orm";

export const getCommentByIdRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/comments/:id",
    {
      schema: {
        tags: ["comments"],
        summary: "Get comment by id",
        params: z.object({
          id: z.uuid(),
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

      const result = await db
        .select()
        .from(comments)
        .where(eq(comments.id, commentId));

      if (result.length > 0) {
        return {
          comment: result[0],
        };
      }

      return reply.status(404).send();
    }
  );
};
