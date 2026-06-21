"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser, updateSessionCouple } from "@/lib/auth";
import { redirect } from "next/navigation";
import crypto from "crypto";

function generateInviteCode(): string {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
}

export type CoupleState = {
  message?: string;
  inviteCode?: string;
} | undefined;

export async function createCouple(
  _state: CoupleState,
  _formData: FormData,
): Promise<CoupleState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.coupleId) redirect("/history");

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

export async function joinCouple(state: CoupleState, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.coupleId) redirect("/history");

  const code = (formData.get("code") as string || "").trim().toUpperCase();
  if (!code) {
    return { message: "Please enter an invite code" };
  }

  const couple = await prisma.couple.findUnique({
    where: { inviteCode: code },
  });
  if (!couple) {
    return { message: "Invalid invite code. Check with your partner." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { coupleId: couple.id },
  });

  await updateSessionCouple(couple.id);
  redirect("/history");
}
