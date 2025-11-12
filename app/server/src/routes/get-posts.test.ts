import request from "supertest";
import { expect, test } from "vitest";

import { server } from "../../app.ts";
import { makeUser } from "../test/factories/make-user.ts";
import { makePost } from "../test/factories/make-post.ts";

test("get a posts", async () => {
  await server.ready();

  const user = await makeUser();
  const post = await makePost(user.id);

  const response = await request(server.server).get(`/posts`);

  expect(response.status).toEqual(200);
  expect(response.body).toEqual({
    total: 1,
    posts: [
      {
        id: post.id,
        content: post.content,
        userId: user.id,
        createdAt: post.createdAt?.toISOString() || null,
        username: user.username,
        avatar: user.avatar,
      },
    ],
  });
});
