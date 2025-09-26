import { pgTable, text, uuid, timestamp, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  username: text().notNull(),
  imagePng: text(),
  imageWebp: text(),
});

export const posts = pgTable("posts", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid()
    .notNull()
    .references(() => users.id),
  content: text().notNull(),
  createdAt: timestamp().defaultNow(),
});

export const comments = pgTable(
  "comments",
  {
    id: uuid().primaryKey().defaultRandom(),
    postId: uuid()
      .notNull()
      .references(() => posts.id),
    userId: uuid()
      .notNull()
      .references(() => users.id),
    parentCommentId: uuid(),
    replyingTo: text(),
    content: text().notNull(),
    score: integer().default(0),
    createdAt: timestamp().defaultNow(),
  },
  (table) => {
    return {
      parentCommentRef: {
        columns: [table.parentCommentId],
        foreignTable: table,
        foreignColumns: [table.id],
      },
    };
  }
);
