import { db } from "./client.ts";
import { comments, posts, users } from "./schema.ts";
import { fakerPT_BR as faker } from "@faker-js/faker";

async function seed() {
  const usersInsert = await db
    .insert(users)
    .values([
      { username: faker.lorem.slug({ min: 6, max: 20 }) },
      { username: faker.lorem.slug({ min: 6, max: 20 }) },
      { username: faker.lorem.slug({ min: 6, max: 20 }) },
      { username: faker.lorem.slug({ min: 6, max: 20 }) },
      { username: faker.lorem.slug({ min: 6, max: 20 }) },
      { username: faker.lorem.slug({ min: 6, max: 20 }) },
    ])
    .returning();

  const postsInsert = await db
    .insert(posts)
    .values([
      {
        content: faker.lorem.paragraphs({ min: 1, max: 3 }),
        userId: usersInsert[0].id,
      },
      {
        content: faker.lorem.paragraphs({ min: 1, max: 3 }),
        userId: usersInsert[1].id,
      },
    ])
    .returning();

  const commentsInsert = await db
    .insert(comments)
    .values([
      {
        postId: postsInsert[0].id,
        userId: usersInsert[3].id,
        content: faker.lorem.paragraph(1),
        parentCommentId: null,
      },
      {
        postId: postsInsert[1].id,
        userId: usersInsert[5].id,
        content: faker.lorem.paragraph(1),
        parentCommentId: null,
      },
    ])
    .returning();

  await db.insert(comments).values({
    postId: postsInsert[1].id,
    userId: usersInsert[5].id,
    content: faker.lorem.paragraph(1),
    parentCommentId: commentsInsert[1].id,
  });
}

seed();
