import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import * as jose from "jose";
import { query } from "@/lib/db";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  try {
    const users = (await query("SELECT * FROM users WHERE username = ?", [
      username,
    ])) as any[];

    if (users.length === 0) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new jose.SignJWT({
      userId: user.id,
      username: user.username,
      isAdmin: user.is_admin,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(secret);

    const response = NextResponse.json(
      { message: "Login successful" },
      { status: 200 }
    );
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600, // 1 hour
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
