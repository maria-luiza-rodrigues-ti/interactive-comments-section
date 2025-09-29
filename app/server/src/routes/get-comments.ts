import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "../database/client.ts";
import { comments, users } from "../database/schema.ts";
import { or, SQL, ilike, asc, eq, and } from "drizzle-orm";

export const getCommentsRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/comments",
    {
      schema: {
        tags: ["comments"],
        summary: "Get all comments",
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
            comments: z.array(
              z.object({
                id: z.uuid(),
                postId: z.uuid(),
                userId: z.uuid(),
                parentCommentId: z.uuid().nullable(),
                content: z.string(),
                score: z.number().nullable(),
                createdAt: z.date().nullable(),
                username: z.string().nullable(),
                avatar: z.url().nullable(),
              })
            ),
            total: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { search, page, orderBy } = request.query;

      const conditions: SQL[] | undefined = [];

      const orCondition = or(
        ilike(comments.content, `%${search}%`),
        ilike(users.username, `%${search}%`)
      );

      if (search) {
        conditions.push(orCondition!);
      }

      const [result, total] = await Promise.all([
        db
          .select({
            id: comments.id,
            postId: comments.postId,
            userId: comments.userId,
            parentCommentId: comments.parentCommentId,
            content: comments.content,
            score: comments.score,
            createdAt: comments.createdAt,
            username: users.username,
            avatar: users.avatar,
          })
          .from(comments)
          .leftJoin(users, eq(comments.userId, users.id))
          .where(and(...conditions))
          .orderBy(
            orderBy === "username" ? asc(users.username) : asc(comments.content)
          )
          .offset((page - 1) * 10)
          .limit(10),
        db.$count(
          comments,
          search ? ilike(comments.content, `%${search}%`) : undefined
        ),
      ]);

      return reply.status(200).send({ comments: result, total });
    }
  );
};
