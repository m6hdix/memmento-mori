import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const weeks = await prisma.week.findMany({
    where: {
      user: {
        email: session.user.email,
      },
    },
  });

  return NextResponse.json(weeks);
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { weekNumber, note, isCompleted } = await request.json();

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  const week = await prisma.week.upsert({
    where: {
      userId_weekNumber_year: {
        userId: user.id,
        weekNumber,
        year: new Date().getFullYear(),
      },
    },
    update: {
      note,
      isCompleted,
    },
    create: {
      userId: user.id,
      weekNumber,
      year: new Date().getFullYear(),
      note,
      isCompleted,
    },
  });

  return NextResponse.json(week);
}
