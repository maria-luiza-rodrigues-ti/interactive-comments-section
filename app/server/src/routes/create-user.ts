import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "../database/client.ts";
import { users } from "../database/schema.ts";

export const createUserRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/users",
    {
      schema: {
        tags: ["users"],
        summary: "Create user",
        body: z.object({
          username: z.string(),
        }),
        response: {
          201: z.object({
            userId: z.uuid(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { username } = request.body;

      const result = await db
        .insert(users)
        .values({
          username: username,
        })
        .returning();

      return reply.status(201).send({ userId: result[0].id });
    }
  );
};
