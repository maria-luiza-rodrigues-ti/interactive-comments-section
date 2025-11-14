import request from "supertest";
import { expect, test } from "vitest";
import { faker } from "@faker-js/faker";

import { server } from "../../app.ts";
import { makeUser } from "../test/factories/make-user.ts";

test("get a user", async () => {
  await server.ready();

  const username = faker.lorem.slug();
  const user = await makeUser({ username });

  const response = await request(server.server).get(
    `/users?search=${username}`
  );

  expect(response.status).toEqual(200);
  expect(response.body).toEqual({
    total: 1,
    users: [
      {
        id: user.id,
        username: username,
        avatar: expect.any(String),
        email: expect.any(String),
        createdAt: expect.any(String),
      },
    ],
  });
});
