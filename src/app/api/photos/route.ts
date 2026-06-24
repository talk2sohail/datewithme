import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireCouple } from "@/lib/auth";
import { uploadPhoto } from "@/lib/storage";
import { logInfo, logWarn, logError } from "@/lib/logger";

export async function POST(request: NextRequest) {
  let user: Awaited<ReturnType<typeof requireCouple>> | undefined;
  try {
    user = await requireCouple();
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const caption = (formData.get("caption") as string) || "";
    const dateId = formData.get("dateId") as string | null;

    if (!file) {
      logWarn("photo.upload", "no file provided", {
        userId: user.id, username: user.username, coupleId: user.coupleId,
      });
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    let finalDateId = dateId;
    if (!finalDateId) {
      const latestDate = await prisma.date.findFirst({
        where: { coupleId: user.coupleId },
        orderBy: { dateTime: "desc" },
      });
      if (!latestDate) {
        const placeholder = await prisma.date.create({
          data: {
            coupleId: user.coupleId,
            places: ["Our Special Day"],
            foods: ["Delicious Food"],
            dateTime: new Date(),
          },
        });
        finalDateId = placeholder.id;
        logInfo("photo.upload", `placeholder date ${placeholder.id} created for photo`, {
          userId: user.id, username: user.username, coupleId: user.coupleId, dateId: placeholder.id,
        });
      } else {
        finalDateId = latestDate.id;
      }
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || "image/jpeg";
    const fileSizeKb = Math.round(buffer.length / 1024);

    logInfo("photo.upload", `uploading ${fileSizeKb}KB ${mimeType} to date ${finalDateId}`, {
      userId: user.id, username: user.username, coupleId: user.coupleId,
      dateId: finalDateId, fileSizeKb, mimeType,
    });

    const imageUrl = await uploadPhoto(buffer, mimeType);

    const photo = await prisma.photo.create({
      data: { dateId: finalDateId, imageUrl, caption: caption || null },
    });

    logInfo("photo.upload", `photo ${photo.id} uploaded by ${user.username}`, {
      userId: user.id, username: user.username, coupleId: user.coupleId,
      dateId: finalDateId, photoId: photo.id, imageUrl,
    });

    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    logError("photo.upload", `upload failed for ${user?.username}`, {
      userId: user?.id, username: user?.username, coupleId: user?.coupleId, error: String(error),
    });
    return NextResponse.json(
      { error: "Failed to upload photo" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  let user: Awaited<ReturnType<typeof requireCouple>> | undefined;
  try {
    user = await requireCouple();
    const { searchParams } = new URL(request.url);
    const dateId = searchParams.get("dateId");

    const photos = await prisma.photo.findMany({
      where: {
        date: { coupleId: user.coupleId },
        ...(dateId ? { dateId } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        date: {
          select: { places: true, dateTime: true },
        },
      },
    });

    logInfo("photo.list", `${user.username} listed ${photos.length} photos`, {
      userId: user.id, username: user.username, coupleId: user.coupleId, count: photos.length, dateId: dateId || undefined,
    });

    return NextResponse.json(photos);
  } catch (error) {
    logError("photo.list", `list failed for ${user?.username}`, {
      userId: user?.id, username: user?.username, coupleId: user?.coupleId, error: String(error),
    });
    return NextResponse.json(
      { error: "Failed to fetch photos" },
      { status: 500 },
    );
  }
}
