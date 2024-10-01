import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);

    return NextResponse.json({
      userId: payload.sub,
      username: payload.username,
      isAdmin: payload.isAdmin || false,
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}
