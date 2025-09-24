import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  username: text().notNull(),
  imagePng: text(),
  imageWebp: text(),
});

export const postsTable = pgTable("posts", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid()
    .notNull()
    .references(() => userTable.id),
  content: text().notNull(),
  createdAt: timestamp().defaultNow(),
});
