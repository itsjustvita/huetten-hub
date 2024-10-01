import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const response = NextResponse.json(
      { message: "Erfolgreich abgemeldet" },
      { status: 200 }
    );

    // Das Token-Cookie löschen
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // Sofort ablaufen lassen
      path: "/",
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  return NextResponse.json(
    { message: "Methode nicht erlaubt" },
    { status: 405 }
  );
}
