import { randomUUID } from "node:crypto";

import request from "supertest";
import { expect, test } from "vitest";

import { server } from "../../app.ts";
import { makeUser } from "../test/factories/make-user.ts";
import { makePost } from "../test/factories/make-post.ts";

test("get a post by id", async () => {
  await server.ready();

  const postId = randomUUID();

  const user = await makeUser();
  const post = await makePost({ userId: user.id, postId });

  const response = await request(server.server).get(`/posts/${postId}`);

  expect(response.status).toEqual(200);
  expect(response.body).toEqual({
    post: {
      id: postId,
      content: post.content,
      userId: user.id,
      createdAt: expect.any(String) || null,
      username: user.username,
      avatar: user.avatar,
    },
  });
});

test("return 404 for non existing post", async () => {
  await server.ready();

  const response = await request(server.server).get(
    `/posts/b6159e7d-9a96-40c5-b58e-8256d212821b`
  );

  expect(response.status).toEqual(404);
});
