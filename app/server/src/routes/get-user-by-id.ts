import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "../database/client.ts";
import { users } from "../database/schema.ts";
import { eq } from "drizzle-orm";

export const getUserByIdRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/users/:id",
    {
      schema: {
        tags: ["users"],
        summary: "Get user by id",
        params: z.object({
          id: z.uuid(),
        }),
        response: {
          200: z.object({
            user: z.object({
              id: z.uuid(),
              username: z.string(),
              imagePng: z.string().nullable(),
              imageWebp: z.string().nullable(),
            }),
          }),
          404: z.null().describe("User not found."),
        },
      },
    },
    async (request, reply) => {
      const userId = request.params.id;

      const result = await db.select().from(users).where(eq(users.id, userId));

      if (result.length > 0) {
        return { user: result[0] };
      }

      return reply.status(404).send();
    }
  );
};
