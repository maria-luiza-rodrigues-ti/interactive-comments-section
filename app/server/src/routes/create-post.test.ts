import request from "supertest";
import { expect, test } from "vitest";
import { fakerPT_BR as faker } from "@faker-js/faker";

import { server } from "../../app.ts";
import { makeUser } from "../test/factories/make-user.ts";

test("create a post", async () => {
  await server.ready();

  const user = await makeUser();
  const content = faker.lorem.paragraph();

  const response = await request(server.server)
    .post(`/posts`)
    .set("Content-Type", "application/json")
    .send({
      content: content,
      userId: user.id,
    });

  expect(response.status).toEqual(201);
  expect(response.body).toEqual({
    postId: expect.any(String),
  });
});
