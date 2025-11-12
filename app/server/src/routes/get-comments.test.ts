import request from "supertest";
import { expect, test } from "vitest";

import { server } from "../../app.ts";
import { makeUser } from "../test/factories/make-user.ts";
import { makePost } from "../test/factories/make-post.ts";
import { makeComment } from "../test/factories/make-comment.ts";

test("get a comment", async () => {
  await server.ready();

  const user = await makeUser();
  const post = await makePost(user.id);
  const comment = await makeComment({ userId: user.id, postId: post.id });

  const response = await request(server.server).get(`/comments`);

  expect(response.status).toEqual(200);
  expect(response.body).toEqual({
    total: 1,
    comments: [
      {
        id: comment.id,
        postId: post.id,
        userId: user.id,
        content: comment.content,
        createdAt: comment.createdAt?.toISOString() || null,
        username: user.username,
        avatar: user.avatar,
        parentCommentId: null,
        score: 0,
      },
    ],
  });
});
