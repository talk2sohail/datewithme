"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/auth";
import { redirect } from "next/navigation";

const AuthSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100),
});

export type AuthState = {
  errors?: { username?: string[]; password?: string[] };
  message?: string;
} | undefined;

export async function register(state: AuthState, formData: FormData) {
  const validated = AuthSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { username, password } = validated.data;

  try {
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return { errors: { username: ["Username already taken"] } };
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { username, passwordHash },
    });

    await createSession(user.id, user.username);
  } catch {
    return { message: "Something went wrong. Please try again." };
  }

  redirect("/");
}

export async function login(state: AuthState, formData: FormData) {
  const validated = AuthSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { username, password } = validated.data;

  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return { message: "Invalid username or password" };
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return { message: "Invalid username or password" };
    }

    await createSession(user.id, user.username);
  } catch {
    return { message: "Something went wrong. Please try again." };
  }

  redirect("/");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
