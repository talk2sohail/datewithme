import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const caption = (formData.get("caption") as string) || "";
    const dateId = formData.get("dateId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    let finalDateId = dateId;
    if (!finalDateId) {
      const latestDate = await prisma.date.findFirst({
        orderBy: { dateTime: "desc" },
      });
      if (!latestDate) {
        const placeholder = await prisma.date.create({
          data: {
            places: ["Our Special Day"],
            foods: ["Delicious Food"],
            dateTime: new Date(),
          },
        });
        finalDateId = placeholder.id;
      } else {
        finalDateId = latestDate.id;
      }
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const uniqueName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    const filePath = path.join(uploadsDir, uniqueName);
    await writeFile(filePath, buffer);

    const imageUrl = `/uploads/${uniqueName}`;

    const photo = await prisma.photo.create({
      data: { dateId: finalDateId, imageUrl, caption: caption || null },
    });

    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error("Error uploading photo:", error);
    return NextResponse.json(
      { error: "Failed to upload photo" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateId = searchParams.get("dateId");

    const photos = await prisma.photo.findMany({
      where: dateId ? { dateId } : {},
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        date: {
          select: { places: true, dateTime: true },
        },
      },
    });
    return NextResponse.json(photos);
  } catch (error) {
    console.error("Error fetching photos:", error);
    return NextResponse.json(
      { error: "Failed to fetch photos" },
      { status: 500 },
    );
  }
}
