import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "../database/client.ts";
import { users } from "../database/schema.ts";
import { asc, ilike, desc } from "drizzle-orm";

export const getUsersRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/users",
    {
      schema: {
        tags: ["users"],
        summary: "Get all users",
        querystring: z.object({
          search: z.string().optional(),
          orderBy: z.enum(["asc", "desc"]).optional().default("asc"),
          page: z.coerce.number().optional().default(1),
        }),
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
      const { search, orderBy, page } = request.query;

      const result = await db
        .select()
        .from(users)
        .where(search ? ilike(users.username, `%${search}%`) : undefined)
        .orderBy(
          orderBy === "desc" ? desc(users.username) : asc(users.username)
        )
        .offset((page - 1) * 2)
        .limit(10);

      return reply.status(200).send({ users: result });
    }
  );
};
