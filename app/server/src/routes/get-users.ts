import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "../database/client.ts";
import { users } from "../database/schema.ts";
import { asc, ilike, and, SQL } from "drizzle-orm";

export const getUsersRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/users",
    {
      schema: {
        tags: ["users"],
        summary: "Get all users",
        querystring: z.object({
          search: z.string().optional(),
          orderBy: z.enum(["email", "username"]).optional().default("username"),
          page: z.coerce.number().optional().default(1),
        }),
        response: {
          200: z.object({
            users: z.array(
              z.object({
                id: z.uuid(),
                username: z.string(),
                email: z.email(),
                avatar: z.url().nullable(),
                createdAt: z.date().nullable(),
              })
            ),
            total: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { search, orderBy, page } = request.query;

      const conditions: SQL[] = [];

      if (search) {
        conditions.push(ilike(users.username, `%${search}%`));
      }

      const [result, total] = await Promise.all([
        db
          .select()
          .from(users)
          .where(and(...conditions))
          .orderBy(asc(users[orderBy]))
          .offset((page - 1) * 10)
          .limit(10),
        db.$count(users, and(...conditions)),
      ]);

      return reply.status(200).send({ users: result, total });
    }
  );
};
