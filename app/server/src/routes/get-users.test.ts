import { test, expect } from "vitest";
import request from "supertest";
import { server } from "../../app.ts";
import { makeUser } from "../test/factories/make-user.ts";

test("get a user", async () => {
  await server.ready();

  const user = await makeUser();

  const response = await request(server.server).get(`/users`);

  console.log("user", user);

  expect(response.status).toEqual(200);
  expect(response.body).toEqual({
    total: 1,
    users: [
      {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        email: user.email,
        createdAt: user.createdAt,
      },
    ],
  });
});
