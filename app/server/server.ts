import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { getPostsRoute } from "./src/routes/get-posts.ts";
import { getUsersRoute } from "./src/routes/get-users.ts";
import { getPostByIdRoute } from "./src/routes/get-post-by-id.ts";
import { getUserByIdRoute } from "./src/routes/get-user-by-id.ts";

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

server.register(getPostsRoute);
server.register(getUsersRoute);
server.register(getPostByIdRoute);
server.register(getUserByIdRoute);

server.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running!");
});
