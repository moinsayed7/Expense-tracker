import { prisma } from "@/app/lib/prisma";
import { signUpValidation } from "@/app/lib/registerValidation";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Unable to parse the data" },
      { status: 400 },
    );
  }

  const parsed = signUpValidation.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const hashedPass = await bcrypt.hash(parsed.data.password, 12);

  try {
    const createdData = await prisma.user.create({
      data: {
        email: parsed.data.email,
        password: hashedPass,
      },
    });

    return NextResponse.json(
      { message: "Account created successfully" },
      { status: 201 },
    );
  } catch (err: unknown) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 },
      );
    }
    console.error("POST api/register failed:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
