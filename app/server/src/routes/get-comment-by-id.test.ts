import { randomUUID } from "node:crypto";

import request from "supertest";
import { expect, test } from "vitest";

import { server } from "../../app.ts";
import { makeUser } from "../test/factories/make-user.ts";
import { makePost } from "../test/factories/make-post.ts";
import { makeComment } from "../test/factories/make-comment.ts";

test("get a comment by id", async () => {
  await server.ready();

  const user = await makeUser();
  const post = await makePost({ userId: user.id });

  const commentId = randomUUID();

  const comment = await makeComment({
    userId: user.id,
    postId: post.id,
    commentId,
  });

  const response = await request(server.server).get(`/comments/${comment.id}`);

  expect(response.status).toEqual(200);
  expect(response.body).toEqual({
    comment: {
      id: commentId,
      postId: post.id,
      userId: user.id,
      content: expect.any(String),
      createdAt: expect.any(String),
      parentCommentId: null,
      score: expect.any(Number),
      username: expect.any(String),
      avatar: expect.any(String),
    },
  });
});

test("return 404 for non existing comments", async () => {
  await server.ready();

  const response = await request(server.server).get(
    `/comments/569d8f11-563c-4048-8b1b-0c36b83d597b`
  );

  expect(response.status).toEqual(404);
});
