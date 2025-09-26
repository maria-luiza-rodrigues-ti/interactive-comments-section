import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "../database/client.ts";
import { comments } from "../database/schema.ts";

export const getCommentsRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/comments",
    {
      schema: {
        tags: ["comments"],
        summary: "Get all comments",
        response: {
          200: z.object({
            comments: z.array(
              z.object({
                id: z.uuid(),
                postId: z.uuid(),
                userId: z.uuid(),
                parentCommentId: z.uuid().nullable(),
                content: z.string(),
                score: z.number().nullable(),
                createdAt: z.date().nullable(),
              })
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const result = await db.select().from(comments);

      return reply.status(200).send({ comments: result });
    }
  );
};
