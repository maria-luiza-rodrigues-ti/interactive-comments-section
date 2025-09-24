import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "../database/client.ts";
import { usersTable } from "../database/schema.ts";

export const getUsersRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/users",
    {
      schema: {
        response: {
          200: z.object({
            users: z.array(
              z.object({
                id: z.uuid(),
                username: z.string(),
                imagePng: z.string().nullable(),
                imageWebp: z.string().nullable(),
              })
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const result = await db.select().from(usersTable);

      return reply.status(200).send({ users: result });
    }
  );
};
