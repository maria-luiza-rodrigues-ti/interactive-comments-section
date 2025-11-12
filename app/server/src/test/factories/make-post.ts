import { fakerPT_BR as faker } from "@faker-js/faker";

import { db } from "../../database/client.ts";
import { posts } from "../../database/schema.ts";

export async function makePost(userId: string) {
  const result = await db
    .insert(posts)
    .values({
      content: faker.lorem.paragraphs(3),
      userId: userId,
    })
    .returning();

  return result[0];
}
