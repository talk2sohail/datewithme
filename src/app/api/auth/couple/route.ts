import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    const user = await requireAuth();
    if (!user.coupleId) {
      return NextResponse.json({ error: "Not in a couple" }, { status: 404 });
    }

    const couple = await prisma.couple.findUnique({
      where: { id: user.coupleId },
      include: {
        users: {
          select: { id: true, username: true },
          where: { id: { not: user.id } },
        },
      },
    });

    if (!couple) {
      return NextResponse.json({ error: "Couple not found" }, { status: 404 });
    }

    return NextResponse.json({
      inviteCode: couple.inviteCode,
      partnerUsername: couple.users[0]?.username,
    });
  } catch (error) {
    console.error("Error fetching couple info:", error);
    return NextResponse.json(
      { error: "Failed to fetch couple info" },
      { status: 500 },
    );
  }
}
