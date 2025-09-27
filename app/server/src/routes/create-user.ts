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
          email: z.email(),
          avatar: z.url().optional(),
        }),
        response: {
          201: z.object({
            userId: z.uuid(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { username, email, avatar } = request.body;

      const result = await db
        .insert(users)
        .values({
          username: username,
          email: email,
          avatar: avatar ?? null,
        })
        .returning();

      return reply.status(201).send({ userId: result[0].id });
    }
  );
};
