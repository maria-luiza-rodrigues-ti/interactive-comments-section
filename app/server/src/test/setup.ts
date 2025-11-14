import { beforeEach } from "vitest";

import { db } from "../database/client.ts";
import { posts, users, comments } from "../database/schema.ts";

beforeEach(async () => {
  await db.delete(comments);
  await db.delete(posts);
  await db.delete(users);
});
