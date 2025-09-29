import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "../database/client.ts";
import { posts, users } from "../database/schema.ts";
import { or, SQL, ilike, and, eq, asc } from "drizzle-orm";

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
            total: z.number().nullable(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { search, page, orderBy } = request.query;

      const conditions: SQL[] | undefined = [];

      const orCondition = or(
        ilike(posts.content, `%${search}%`),
        ilike(users.username, `%${search}%`)
      );

      if (search) {
        conditions.push(orCondition!);
      }

      const [result, total] = await Promise.all([
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
        db.$count(
          posts,
          search ? ilike(posts.content, `%${search}%`) : undefined
        ),
      ]);

      return reply.status(200).send({ posts: result, total });
    }
  );
};
