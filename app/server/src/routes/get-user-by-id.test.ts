import { randomUUID } from "node:crypto";

import request from "supertest";
import { expect, test } from "vitest";

import { server } from "../../app.ts";
import { makeUser } from "../test/factories/make-user.ts";

test("get a user by id", async () => {
  await server.ready();

  const userId = randomUUID();
  const user = await makeUser({ userId });

  const response = await request(server.server).get(`/users/${userId}`);

  expect(response.status).toEqual(200);
  expect(response.body).toEqual({
    user: {
      id: userId,
      username: user.username,
      avatar: expect.any(String),
      email: expect.any(String),
      createdAt: expect.any(String),
    },
  });
});

test("return 404 for non existing user", async () => {
  await server.ready();

  const response = await request(server.server).get(
    `/users/b1838185-b04f-4806-b73a-c20b1eca9924`
  );

  expect(response.status).toEqual(404);
});
