"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser, updateSessionCouple } from "@/lib/auth";
import { redirect } from "next/navigation";
import crypto from "crypto";
import { logInfo, logWarn } from "@/lib/logger";

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

  logInfo("couple.create", `couple created by ${user.username}`, {
    userId: user.id, username: user.username, coupleId: couple.id, inviteCode: couple.inviteCode,
  });

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
  if (!couple) {
    logWarn("couple.join.fail", `${user.username} tried invalid code`, {
      userId: user.id, username: user.username, attemptedCode: code,
    });
    return { error: "Invalid invite code" };
  }
  if (couple.users.length >= 2) {
    logWarn("couple.join.fail", `${user.username} tried full couple ${couple.id}`, {
      userId: user.id, username: user.username, coupleId: couple.id,
    });
    return { error: "This couple already has two partners" };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { coupleId: couple.id },
  });

  const updatedCouple = await prisma.couple.findUnique({
    where: { id: couple.id },
    include: { users: { select: { id: true } } },
  });

  if (updatedCouple && updatedCouple.users.length >= 2) {
    await prisma.couple.update({
      where: { id: couple.id },
      data: { inviteCode: `USED_${couple.id}` },
    });
  }

  await updateSessionCouple(couple.id);

  logInfo("couple.join", `${user.username} joined couple ${couple.id}`, {
    userId: user.id, username: user.username, coupleId: couple.id,
  });

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
    logWarn("couple.reset.fail", `${user.username} tried to reset full couple ${user.coupleId}`, {
      userId: user.id, username: user.username, coupleId: user.coupleId,
    });
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

  logInfo("couple.reset", `${user.username} reset couple ${user.coupleId}`, {
    userId: user.id, username: user.username, coupleId: user.coupleId,
  });

  return { ok: true };
}
