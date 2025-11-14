import request from "supertest";
import { expect, test } from "vitest";
import { fakerPT_BR as faker } from "@faker-js/faker";

import { server } from "../../app.ts";
import { makeUser } from "../test/factories/make-user.ts";
import { makePost } from "../test/factories/make-post.ts";
import { makeComment } from "../test/factories/make-comment.ts";

test("get a comment searching from content", async () => {
  await server.ready();

  const user = await makeUser();
  const post = await makePost({ userId: user.id });

  const content = faker.word.noun();
  const parentContent = faker.word.noun();

  const parentComment = await makeComment({
    userId: user.id,
    postId: post.id,
    content: parentContent,
  });

  const comment = await makeComment({
    userId: user.id,
    postId: post.id,
    content,
    parentCommentId: parentComment.id,
  });

  const response = await request(server.server).get(
    `/comments?search=${content}`
  );

  expect(response.status).toEqual(200);
  expect(response.body).toEqual({
    total: 1,
    comments: [
      {
        id: comment.id,
        postId: post.id,
        userId: user.id,
        content: content,
        createdAt: expect.any(String),
        username: expect.any(String),
        avatar: expect.any(String),
        parentCommentId: parentComment.id,
        score: expect.any(Number),
      },
    ],
  });
});

test("get a comment searching from username", async () => {
  await server.ready();

  const username = faker.lorem.slug();

  const user = await makeUser({ username });
  const post = await makePost({ userId: user.id });

  const comment = await makeComment({
    userId: user.id,
    postId: post.id,
  });

  const response = await request(server.server).get(
    `/comments?search=${username}`
  );

  expect(response.status).toEqual(200);
  expect(response.body).toEqual({
    total: 1,
    comments: [
      {
        id: comment.id,
        postId: post.id,
        userId: user.id,
        content: expect.any(String),
        createdAt: expect.any(String),
        username: username,
        avatar: expect.any(String),
        parentCommentId: null,
        score: expect.any(Number),
      },
    ],
  });
});
