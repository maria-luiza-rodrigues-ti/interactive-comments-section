import { randomUUID } from "node:crypto";

import request from "supertest";
import { expect, test } from "vitest";
import { fakerPT_BR as faker } from "@faker-js/faker";

import { server } from "../../app.ts";
import { makeUser } from "../test/factories/make-user.ts";
import { makePost } from "../test/factories/make-post.ts";
import { makeComment } from "../test/factories/make-comment.ts";

test("update a comment", async () => {
  await server.ready();

  const user = await makeUser();
  const post = await makePost({ userId: user.id });

  const commentId = randomUUID();
  const score = faker.number.int({ min: 0, max: 100 });

  const comment = await makeComment({
    userId: user.id,
    postId: post.id,
    commentId,
    score,
  });

  const updatedContent = faker.lorem.paragraph();
  const updatedScore = faker.number.int({ min: 0, max: 100 });

  const response = await request(server.server)
    .put(`/comments/${comment.id}`)
    .set("Content-Type", "application/json")
    .send({
      content: updatedContent,
      score: updatedScore,
    });

  expect(response.status).toEqual(200);
  expect(response.body).toEqual({
    comment: {
      id: commentId,
      postId: post.id,
      userId: user.id,
      content: updatedContent,
      createdAt: expect.any(String),
      parentCommentId: null,
      score: updatedScore,
    },
  });
});

test("return 404 for non existing comments", async () => {
  await server.ready();

  const response = await request(server.server)
    .put(`/comments/569d8f11-563c-4048-8b1b-0c36b83d597b`)
    .set("Content-Type", "application/json")
    .send({
      content: faker.lorem.paragraph(),
    });

  expect(response.status).toEqual(404);
});
