import request from "supertest";
import { expect, test } from "vitest";
import { fakerPT_BR as faker } from "@faker-js/faker";

import { server } from "../../app.ts";
import { makeUser } from "../test/factories/make-user.ts";
import { makePost } from "../test/factories/make-post.ts";
import { makeComment } from "../test/factories/make-comment.ts";

test("create a comment", async () => {
  await server.ready();

  const user = await makeUser();
  const post = await makePost({ userId: user.id });

  const parentContent = faker.lorem.paragraph();

  const parentComment = await makeComment({
    postId: post.id,
    userId: user.id,
    content: parentContent,
  });

  const content = faker.lorem.paragraph();

  const response = await request(server.server)
    .post(`/comments`)
    .set("Content-Type", "application/json")
    .send({
      postId: post.id,
      userId: user.id,
      content: content,
      parentCommentId: parentComment.id,
    });

  expect(response.status).toEqual(201);
  expect(response.body).toEqual({
    commentId: expect.any(String),
  });
});
