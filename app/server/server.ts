import Fastify from "fastify";
import { db } from "./src/database/client.ts";
import { postsTable, usersTable } from "./src/database/schema.ts";
import { eq } from "drizzle-orm";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { z } from "zod";

const server = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
}).withTypeProvider<ZodTypeProvider>();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

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

server.get(
  "/users/:id",
  {
    schema: {
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

    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    if (result.length > 0) {
      return { user: result[0] };
    }

    return reply.status(404).send();
  }
);

server.get(
  "/posts",
  {
    schema: {
      response: {
        200: z.object({
          posts: z.array(
            z.object({
              id: z.uuid(),
              userId: z.uuid(),
              content: z.string(),
              createdAt: z.date().nullable(),
            })
          ),
        }),
      },
    },
  },
  async (request, reply) => {
    const result = await db.select().from(postsTable);

    return reply.status(200).send({ posts: result });
  }
);

server.get(
  "/posts/:id",
  {
    schema: {
      params: z.object({
        id: z.uuid(),
      }),
      response: {
        200: z.object({
          post: {
            id: z.uuid(),
            userId: z.uuid(),
            content: z.string(),
            createdAt: z.date(),
          },
        }),
        404: z.null().describe("Post not found"),
      },
    },
  },
  async (request, reply) => {
    const postId = request.params.id;

    const result = await db
      .select()
      .from(postsTable)
      .where(eq(postsTable.id, postId));

    if (result.length > 0) {
      return {
        post: result[0],
      };
    }

    return reply.status(404).send();
  }
);

server.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running!");
});
