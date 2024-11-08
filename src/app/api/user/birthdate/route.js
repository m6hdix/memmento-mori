import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

// دریافت تاریخ تولد
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "لطفا وارد حساب کاربری خود شوید" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        birthDate: true,
      },
    });

    return NextResponse.json({ birthDate: user?.birthDate });
  } catch (error) {
    console.error("Error fetching birth date:", error);
    return NextResponse.json(
      { error: "خطا در دریافت تاریخ تولد" },
      { status: 500 }
    );
  }
}

// ذخیره یا بروزرسانی تاریخ تولد
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "لطفا وارد حساب کاربری خود شوید" },
        { status: 401 }
      );
    }

    const { birthDate } = await request.json();

    // اعتبارسنجی تاریخ تولد
    const birthDateObj = new Date(birthDate);
    if (isNaN(birthDateObj.getTime())) {
      return NextResponse.json(
        { error: "تاریخ تولد نامعتبر است" },
        { status: 400 }
      );
    }

    // بروزرسانی تاریخ تولد کاربر
    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        birthDate: birthDateObj,
      },
    });

    return NextResponse.json({
      message: "تاریخ تولد با موفقیت ذخیره شد",
      birthDate: updatedUser.birthDate,
    });
  } catch (error) {
    console.error("Error updating birth date:", error);
    return NextResponse.json(
      { error: "خطا در ذخیره تاریخ تولد" },
      { status: 500 }
    );
  }
}

// حذف تاریخ تولد
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "لطفا وارد حساب کاربری خود شوید" },
        { status: 401 }
      );
    }

    await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        birthDate: null,
      },
    });

    return NextResponse.json({ message: "تاریخ تولد با موفقیت حذف شد" });
  } catch (error) {
    console.error("Error deleting birth date:", error);
    return NextResponse.json(
      { error: "خطا در حذف تاریخ تولد" },
      { status: 500 }
    );
  }
}
