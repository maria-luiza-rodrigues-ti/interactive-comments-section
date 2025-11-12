import { fakerPT_BR as faker } from "@faker-js/faker";

import { db } from "../../database/client.ts";
import { comments } from "../../database/schema.ts";

export async function makeComment({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) {
  const result = await db
    .insert(comments)
    .values({
      postId,
      userId,
      content: faker.lorem.paragraph(),
    })
    .returning();

  return result[0];
}
