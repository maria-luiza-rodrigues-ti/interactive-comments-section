import { fakerPT_BR as faker } from "@faker-js/faker";

import { db } from "../../database/client.ts";
import { comments } from "../../database/schema.ts";

export async function makeComment({
  commentId,
  postId,
  userId,
  content,
  parentCommentId,
  score,
}: {
  commentId?: string;
  postId: string;
  userId: string;
  content?: string;
  parentCommentId?: string;
  score?: number;
}) {
  const result = await db
    .insert(comments)
    .values({
      id: commentId,
      postId,
      userId,
      content: content ?? faker.lorem.paragraph(),
      parentCommentId,
      score,
    })
    .returning();

  return result[0];
}
