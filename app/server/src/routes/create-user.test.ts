import request from "supertest";
import { expect, test } from "vitest";
import { fakerPT_BR as faker } from "@faker-js/faker";

import { server } from "../../app.ts";

test("create a user", async () => {
  await server.ready();

  const username = faker.lorem.slug();
  const email = faker.internet.email();
  const avatar = faker.image.urlPicsumPhotos();

  const response = await request(server.server)
    .post(`/users`)
    .set("Content-Type", "application/json")
    .send({
      username,
      email,
      avatar,
    });

  expect(response.status).toEqual(201);
  expect(response.body).toEqual({
    userId: expect.any(String),
  });
});
