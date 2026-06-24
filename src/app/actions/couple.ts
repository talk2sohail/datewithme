"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser, updateSessionCouple } from "@/lib/auth";
import { redirect } from "next/navigation";
import crypto from "crypto";

function generateInviteCode(): string {
  return crypto.randomBytes(8).toString("hex").toUpperCase();
}

export async function createCouple(): Promise<{
  inviteCode?: string;
  error?: string;
}> {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };
  if (user.coupleId) {
    await updateSessionCouple(user.coupleId);
    redirect("/history");
  }

  let inviteCode: string;
  let existing = true;
  do {
    inviteCode = generateInviteCode();
    existing = !!(await prisma.couple.findUnique({
      where: { inviteCode },
    }));
  } while (existing);

  const couple = await prisma.couple.create({
    data: { inviteCode },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { coupleId: couple.id },
  });

  await updateSessionCouple(couple.id);

  return { inviteCode: couple.inviteCode };
}

export async function getCoupleInfo(): Promise<{
  inviteCode?: string;
  partnerUsername?: string;
  error?: string;
}> {
  const user = await getCurrentUser();
  if (!user || !user.coupleId) return { error: "Not in a couple" };

  const couple = await prisma.couple.findUnique({
    where: { id: user.coupleId },
    include: {
      users: {
        select: { id: true, username: true },
        where: { id: { not: user.id } },
      },
    },
  });

  if (!couple) return { error: "Couple not found" };

  return {
    inviteCode: couple.inviteCode,
    partnerUsername: couple.users[0]?.username,
  };
}

export async function joinCouple(formData: FormData): Promise<{
  ok?: boolean;
  error?: string;
}> {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };
  if (user.coupleId) {
    await updateSessionCouple(user.coupleId);
    redirect("/history");
  }

  const code = (formData.get("code") as string || "").trim().toUpperCase();
  if (!code) return { error: "Please enter an invite code" };

  const couple = await prisma.couple.findUnique({
    where: { inviteCode: code },
    include: { users: { select: { id: true } } },
  });
  if (!couple) return { error: "Invalid invite code" };
  if (couple.users.length >= 2) {
    return { error: "This couple already has two partners" };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { coupleId: couple.id },
  });

  await updateSessionCouple(couple.id);

  return { ok: true };
}

export async function resetCouple(): Promise<{
  ok?: boolean;
  error?: string;
}> {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };
  if (!user.coupleId) return { error: "Not in a couple" };

  const couple = await prisma.couple.findUnique({
    where: { id: user.coupleId },
    include: { users: { select: { id: true } } },
  });
  if (!couple) return { error: "Couple not found" };
  if (couple.users.length > 1) {
    return {
      error: "Cannot reset — your partner has already joined. They must leave first.",
    };
  }

  await prisma.couple.delete({ where: { id: user.coupleId } });

  await prisma.user.update({
    where: { id: user.id },
    data: { coupleId: null },
  });

  await updateSessionCouple(null);

  return { ok: true };
}
