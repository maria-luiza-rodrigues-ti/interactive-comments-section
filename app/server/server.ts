import Fastify from "fastify";

const server = Fastify({
  logger: true,
});

const posts = [
  {
    user: {
      username: "juliusomo",
      image: {
        png: "./images/avatars/image-juliusomo.png",
        webp: "./images/avatars/image-juliusomo.webp",
      },
    },
  },
];

server.get("/posts", async function handler(request, reply) {
  return { hello: "world" };
});

server.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running!");
});
