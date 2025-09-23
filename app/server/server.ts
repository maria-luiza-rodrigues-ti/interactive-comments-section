import Fastify from "fastify";
import crypto from "crypto";

const server = Fastify({
  logger: true,
});

const users = [
  {
    id: "0fc7fef2-57fa-49be-8006-481356466d63",
    username: "juliusomo",
    image: {
      png: "./images/avatars/image-juliusomo.png",
      webp: "./images/avatars/image-juliusomo.webp",
    },
  },
  {
    id: "a97aec26-e0dd-4aa9-bed3-d22838479e4e",
    image: {
      png: "./images/avatars/image-amyrobson.png",
      webp: "./images/avatars/image-amyrobson.webp",
    },
    username: "amyrobson",
  },
  {
    id: "950de311-fc14-41c4-b63e-cb8396862c1d",
    image: {
      png: "./images/avatars/image-ramsesmiron.png",
      webp: "./images/avatars/image-ramsesmiron.webp",
    },
    username: "ramsesmiron",
  },
];

const posts = [
  {
    id: crypto.randomUUID(),
    user: {
      id: "0fc7fef2-57fa-49be-8006-481356466d63",
      username: "juliusomo",
      image: {
        png: "./images/avatars/image-juliusomo.png",
        webp: "./images/avatars/image-juliusomo.webp",
      },
    },
    post: "Ut pariatur Lorem in est velit minim velit. Officia enim anim commodo pariatur cillum velit pariatur quis incididunt. Laboris dolore dolor pariatur elit sunt ad eiusmod labore irure magna minim dolore occaecat. Et aute eu enim qui pariatur labore. Adipisicing consectetur aliqua aliquip minim est amet deserunt do consequat.",
    comments: [
      {
        id: crypto.randomUUID(),
        content:
          "Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.",
        createdAt: "1 month ago",
        score: 12,
        user: {
          id: "a97aec26-e0dd-4aa9-bed3-d22838479e4e",
          image: {
            png: "./images/avatars/image-amyrobson.png",
            webp: "./images/avatars/image-amyrobson.webp",
          },
          username: "amyrobson",
        },
        replies: [],
      },
      {
        id: crypto.randomUUID(),
        content:
          "Woah, your project looks awesome! How long have you been coding for? I'm still new, but think I want to dive into React as well soon. Perhaps you can give me an insight on where I can learn React? Thanks!",
        createdAt: "2 weeks ago",
        score: 5,
        user: {
          id: crypto.randomUUID(),
          image: {
            png: "./images/avatars/image-maxblagun.png",
            webp: "./images/avatars/image-maxblagun.webp",
          },
          username: "maxblagun",
        },
        replies: [
          {
            id: crypto.randomUUID(),
            content:
              "If you're still new, I'd recommend focusing on the fundamentals of HTML, CSS, and JS before considering React. It's very tempting to jump ahead but lay a solid foundation first.",
            createdAt: "1 week ago",
            score: 4,
            replyingTo: "maxblagun",
            user: {
              id: "950de311-fc14-41c4-b63e-cb8396862c1d",
              image: {
                png: "./images/avatars/image-ramsesmiron.png",
                webp: "./images/avatars/image-ramsesmiron.webp",
              },
              username: "ramsesmiron",
            },
          },
          {
            id: crypto.randomUUID(),
            content:
              "I couldn't agree more with this. Everything moves so fast and it always seems like everyone knows the newest library/framework. But the fundamentals are what stay constant.",
            createdAt: "2 days ago",
            score: 2,
            replyingTo: "ramsesmiron",
            user: {
              id: "0fc7fef2-57fa-49be-8006-481356466d63",
              image: {
                png: "./images/avatars/image-juliusomo.png",
                webp: "./images/avatars/image-juliusomo.webp",
              },
              username: "juliusomo",
            },
          },
        ],
      },
    ],
  },
];

server.get("/users", () => {
  return { users };
});

server.get("/users/:id", (request, reply) => {
  type Params = {
    id: string;
  };

  const params = request.params as Params;
  const userId = params.id;

  const user = users.find((user) => user.id === userId);

  if (user) {
    return { user };
  }

  return reply.status(400).send();
});

server.get("/posts", () => {
  return { posts };
});

server.get("/posts/:id", (request, reply) => {
  type Params = {
    id: string;
  };

  const params = request.params as Params;
  const postId = params.id;

  const post = posts.find((post) => post.id === postId);

  if (post) {
    return { post };
  }

  return reply.status(404).send();
});

server.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running!");
});
