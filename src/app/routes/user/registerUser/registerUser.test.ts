import { describe, it, expect, afterAll } from "vitest"
import { Server } from "@/core/server"
import { db } from "@/core/database"
import { UserRole } from "@prisma/client"
import { AuthService } from "@/core/services/AuthService"
import { Body } from "./registerUser.schema"
import { faker } from "@faker-js/faker"

describe("createSiteUser", async () => {
  const server = Server.new()
  const url = "/api/user/register-user"
  const method = "POST"

  afterAll(() => server.close())

  it("valid request", async () => {
    /** test */
    const email = faker.internet.email()
    const password = faker.string.alphanumeric({ length: 10 })

    const payload: Body = {
      name: faker.internet.userName(),
      email,
      password,
      confirmPassword: password,
    }

    const res = await server.inject({
      url,
      method,
      payload,
    })
    expect(res.statusCode).toBe(200)

    const foundUser = await db.user.findUnique({
      where: { email },
    })
    expect(foundUser?.name).toBe(payload.name)

    /** cleanup */
    await db.user.delete({ where: { email } })
  })

  it("email already taken", async () => {
    /** setup */
    const email = faker.internet.email()
    const password = faker.string.alphanumeric({ length: 10 })

    const user = await db.user.create({
      data: {
        email,
        name: faker.internet.userName(),
      },
    })

    /** test */
    const payload: Body = {
      name: "User two",
      email,
      password,
      confirmPassword: password,
    }

    const res = await server.inject({
      url,
      method,
      payload,
    })
    expect(res.statusCode).toBe(400)

    const body = JSON.parse(res.body) as { message: string }
    expect(body.message.includes("in use")).toBe(true)

    /** cleanup */
    await db.user.delete({ where: { id: user.id } })
  })
})
