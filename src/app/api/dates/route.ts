import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCouple } from "@/lib/auth";
import { logInfo, logWarn, logError } from "@/lib/logger";

export async function POST(request: NextRequest) {
  let user: Awaited<ReturnType<typeof requireCouple>> | undefined;
  try {
    user = await requireCouple();
    const body = await request.json();
    const { places, foods, dateTime } = body;

    if (!places || !foods || !dateTime) {
      logWarn("date.create", "missing fields", {
        userId: user.id, username: user.username, coupleId: user.coupleId,
      });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const date = await prisma.date.create({
      data: {
        coupleId: user.coupleId,
        places: Array.isArray(places) ? places : [places],
        foods: Array.isArray(foods) ? foods : [foods],
        dateTime: new Date(dateTime),
      },
    });

    logInfo("date.create", `date ${date.id} created by ${user.username}`, {
      userId: user.id, username: user.username, coupleId: user.coupleId, dateId: date.id,
    });

    return NextResponse.json(date, { status: 201 });
  } catch (error) {
    logError("date.create", `create failed for couple ${user?.coupleId}`, {
      userId: user?.id, coupleId: user?.coupleId, error: String(error),
    });
    return NextResponse.json(
      { error: "Failed to create date" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  let user: Awaited<ReturnType<typeof requireCouple>> | undefined;
  try {
    user = await requireCouple();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const date = await prisma.date.findFirst({
        where: { id, coupleId: user.coupleId },
        include: { photos: { orderBy: { createdAt: "desc" } } },
      });
      if (!date) {
        logWarn("date.get", `date ${id} not found for couple ${user.coupleId}`, {
          userId: user.id, username: user.username, coupleId: user.coupleId, dateId: id,
        });
        return NextResponse.json({ error: "Date not found" }, { status: 404 });
      }
      logInfo("date.get", `date ${id} viewed by ${user.username}`, {
        userId: user.id, username: user.username, coupleId: user.coupleId, dateId: id,
      });
      return NextResponse.json(date);
    }

    const dates = await prisma.date.findMany({
      where: { coupleId: user.coupleId },
      orderBy: { dateTime: "desc" },
      include: {
        photos: {
          take: 1,
          orderBy: { createdAt: "desc" },
          select: { imageUrl: true },
        },
      },
    });
    logInfo("date.list", `${user.username} listed ${dates.length} dates`, {
      userId: user.id, username: user.username, coupleId: user.coupleId, count: dates.length,
    });
    return NextResponse.json(dates);
  } catch (error) {
    logError("date.list", `list failed for ${user?.username}`, {
      userId: user?.id, username: user?.username, coupleId: user?.coupleId, error: String(error),
    });
    return NextResponse.json(
      { error: "Failed to fetch dates" },
      { status: 500 },
    );
  }
}
