import scalarAPIReference from "@scalar/fastify-api-reference";
import Fastify from "fastify";
import { fastifySwagger } from "@fastify/swagger";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import { getPostsRoute } from "./src/routes/get-posts.ts";
import { getUsersRoute } from "./src/routes/get-users.ts";
import { getPostByIdRoute } from "./src/routes/get-post-by-id.ts";
import { getUserByIdRoute } from "./src/routes/get-user-by-id.ts";
import { createPostRoute } from "./src/routes/create-post.ts";
import { createUserRoute } from "./src/routes/create-user.ts";
import { getCommentsRoute } from "./src/routes/get-comments.ts";
import { createCommentRoute } from "./src/routes/create-comment.ts";
import { getCommentByIdRoute } from "./src/routes/get-comment-by-id.ts";
import { updateCommentRoute } from "./src/routes/update-comment.ts";
import { deleteCommentRoute } from "./src/routes/delete-comment.ts";

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

server.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Interactive Comments Section",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

server.register(scalarAPIReference, {
  routePrefix: "/docs",
});

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.register(getPostsRoute);
server.register(getUsersRoute);
server.register(getPostByIdRoute);
server.register(getUserByIdRoute);
server.register(createPostRoute);
server.register(createUserRoute);
server.register(getCommentsRoute);
server.register(createCommentRoute);
server.register(getCommentByIdRoute);
server.register(updateCommentRoute);
server.register(deleteCommentRoute);

server.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running!");
});
