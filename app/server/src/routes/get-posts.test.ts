import request from "supertest";
import { expect, test } from "vitest";
import { fakerPT_BR as faker } from "@faker-js/faker";

import { server } from "../../app.ts";
import { makeUser } from "../test/factories/make-user.ts";
import { makePost } from "../test/factories/make-post.ts";

test("get a post searching by content", async () => {
  await server.ready();

  const user = await makeUser();
  const content = faker.word.noun(5);
  const post = await makePost({ userId: user.id, content });

  const response = await request(server.server).get(`/posts?search=${content}`);

  expect(response.status).toEqual(200);
  expect(response.body).toEqual({
    total: 1,
    posts: [
      {
        id: post.id,
        content: content,
        userId: user.id,
        createdAt: post.createdAt?.toISOString() || null,
        username: user.username,
        avatar: user.avatar,
      },
    ],
  });
});

test("get a post searching by username", async () => {
  await server.ready();

  const username = faker.lorem.slug();
  const user = await makeUser({ username });

  const post = await makePost({ userId: user.id });

  const response = await request(server.server).get(
    `/posts?search=${user.username}`
  );

  expect(response.status).toEqual(200);
  expect(response.body).toEqual({
    total: 1,
    posts: [
      {
        id: post.id,
        content: post.content,
        userId: user.id,
        createdAt: expect.any(String),
        username: username,
        avatar: expect.any(String),
      },
    ],
  });
});
