import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { or, SQL, ilike, and, eq, asc, count } from "drizzle-orm";

import { db } from "../database/client.ts";
import { posts, users } from "../database/schema.ts";

export const getPostsRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/posts",
    {
      schema: {
        tags: ["posts"],
        summary: "Get all posts",
        querystring: z.object({
          search: z.string().optional(),
          orderBy: z
            .enum(["content", "username"])
            .optional()
            .default("content"),
          page: z.coerce.number().optional().default(1),
        }),
        response: {
          200: z.object({
            posts: z.array(
              z.object({
                id: z.uuid(),
                userId: z.uuid(),
                content: z.string(),
                createdAt: z.date().nullable(),
                username: z.string().nullable(),
                avatar: z.string().nullable(),
              })
            ),
            total: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { search, page, orderBy } = request.query;

      const conditions: SQL[] = [];

      const orCondition = or(
        ilike(posts.content, `%${search}%`),
        ilike(users.username, `%${search}%`)
      );

      if (search) {
        conditions.push(orCondition!);
      }

      const [result, [{ count: total }]] = await Promise.all([
        db
          .select({
            id: posts.id,
            userId: posts.userId,
            content: posts.content,
            createdAt: posts.createdAt,
            username: users.username,
            avatar: users.avatar,
          })
          .from(posts)
          .leftJoin(users, eq(posts.userId, users.id))
          .where(and(...conditions))
          .orderBy(
            orderBy === "username" ? asc(users.username) : asc(posts.content)
          )
          .offset((page - 1) * 10)
          .limit(10),
        db
          .select({ count: count(posts.id) })
          .from(posts)
          .leftJoin(users, eq(posts.userId, users.id))
          .where(and(...conditions)),
      ]);

      return reply.status(200).send({ posts: result, total });
    }
  );
};
