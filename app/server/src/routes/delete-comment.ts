import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "../database/client.ts";
import { comments } from "../database/schema.ts";
import { eq } from "drizzle-orm";

export const deleteCommentRoute: FastifyPluginAsyncZod = async (server) => {
  server.delete(
    "/comments/:id",
    {
      schema: {
        tags: ["comments"],
        summary: "Delete comment",
        params: z.object({
          id: z.uuid(),
        }),
        response: {
          204: z.null().describe("Comment deleted successfully delete"),
          404: z.null().describe("Comment not found"),
        },
      },
    },
    async (request, reply) => {
      const commentId = request.params.id;

      const result = await db
        .delete(comments)
        .where(eq(comments.id, commentId))
        .returning();

      if (result.length > 0) {
        return reply.status(204).send();
      }

      return reply.status(404).send();
    }
  );
};
