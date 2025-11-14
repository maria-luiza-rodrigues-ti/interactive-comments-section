import { randomUUID } from "node:crypto";

import { expect, test } from "vitest";
import request from "supertest";

import { server } from "../../app";
import { makeUser } from "../test/factories/make-user";
import { makePost } from "../test/factories/make-post";
import { makeComment } from "../test/factories/make-comment";

test("delete a comment", async () => {
  await server.ready();

  const user = await makeUser();
  const post = await makePost({ userId: user.id });
  const comment = await makeComment({ postId: post.id, userId: user.id });

  const response = await request(server.server).delete(
    `/comments/${comment.id}`
  );

  expect(response.status).toEqual(204);
});

test("return 404 for non existing comment", async () => {
  await server.ready();

  const commentId = randomUUID();

  const response = await request(server.server).delete(
    `/comments/${commentId}`
  );

  expect(response.status).toEqual(404);
});
