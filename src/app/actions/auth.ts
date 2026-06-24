"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { logInfo, logWarn } from "@/lib/logger";

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
  const redirectTo = (formData.get("redirect") as string) || "/";

  try {
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      logWarn("auth.register.fail", `username taken: ${username}`, { username });
      return { errors: { username: ["Username already taken"] } };
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { username, passwordHash },
    });

    await createSession(user.id, user.username);
    logInfo("auth.register", `user registered: ${username}`, { userId: user.id, username });
  } catch {
    logWarn("auth.register.fail", `registration failed for: ${username}`, { username });
    return { message: "Something went wrong. Please try again." };
  }

  redirect(redirectTo);
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
  const redirectTo = (formData.get("redirect") as string) || "/";

  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      logWarn("auth.login.fail", `user not found: ${username}`, { username });
      return { message: "Invalid username or password" };
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      logWarn("auth.login.fail", `wrong password for: ${username}`, { username });
      return { message: "Invalid username or password" };
    }

    await createSession(user.id, user.username, user.coupleId);
    logInfo("auth.login", `user logged in: ${username}`, { userId: user.id, username, coupleId: user.coupleId });
  } catch {
    logWarn("auth.login.fail", `login error for: ${username}`, { username });
    return { message: "Something went wrong. Please try again." };
  }

  redirect(redirectTo);
}

export async function logout() {
  logInfo("auth.logout", "user logged out", {});
  await deleteSession();
  redirect("/login");
}
