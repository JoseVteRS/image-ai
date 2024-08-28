import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono().post(
  "/",
  zValidator(
    "json",
    z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(3),
    })
  ),
  async (c) => {
    const { email, name, password } = c.req.valid("json");

    const query = await db.select().from(users).where(eq(users.email, email));
    if (query[0]) return c.json({ error: "Email already in use" }, 400);

    const hashedPasswod = await hash(password, 12);

    await db.insert(users).values({
      email,
      name,
      password: hashedPasswod,
    });

    return c.json(null, 201);
  }
);

export default app;
