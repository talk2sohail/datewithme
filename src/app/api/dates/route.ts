import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const { places, foods, dateTime } = body;

    if (!places || !foods || !dateTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const date = await prisma.date.create({
      data: {
        places: Array.isArray(places) ? places : [places],
        foods: Array.isArray(foods) ? foods : [foods],
        dateTime: new Date(dateTime),
      },
    });

    return NextResponse.json(date, { status: 201 });
  } catch (error) {
    console.error("Error creating date:", error);
    return NextResponse.json(
      { error: "Failed to create date" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const date = await prisma.date.findUnique({
        where: { id },
        include: { photos: { orderBy: { createdAt: "desc" } } },
      });
      if (!date) {
        return NextResponse.json({ error: "Date not found" }, { status: 404 });
      }
      return NextResponse.json(date);
    }

    const dates = await prisma.date.findMany({
      orderBy: { dateTime: "desc" },
      include: {
        photos: {
          take: 1,
          orderBy: { createdAt: "desc" },
          select: { imageUrl: true },
        },
      },
    });
    return NextResponse.json(dates);
  } catch (error) {
    console.error("Error fetching dates:", error);
    return NextResponse.json(
      { error: "Failed to fetch dates" },
      { status: 500 },
    );
  }
}
