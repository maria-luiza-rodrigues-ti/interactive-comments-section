import { fakerPT_BR as faker } from "@faker-js/faker";

import { db } from "../../database/client.ts";
import { users } from "../../database/schema.ts";

export async function makeUser() {
  const result = await db
    .insert(users)
    .values({
      username: faker.lorem.slug(),
      email: faker.internet.email(),
      avatar: faker.image.urlPicsumPhotos(),
    })
    .returning();

  return result[0];
}
