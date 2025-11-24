import { NextRequest, NextResponse } from 'next/server';

const CORRECT_PASSWORD = 'withaplan';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { password } = body;

  if (password === CORRECT_PASSWORD) {
    const response = NextResponse.json({ success: true });
    response.cookies.set('authenticated', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });
    return response;
  }

  return NextResponse.json({ success: false }, { status: 401 });
}
