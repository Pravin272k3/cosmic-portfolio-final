import { NextRequest, NextResponse } from 'next/server';

// Hardcoded admin credentials
const ADMIN_EMAIL = 'sharma272k3@gmail.com';
const ADMIN_PASSWORD = '27april2003';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { email, password } = data;

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Create a response with authentication cookie
      const response = NextResponse.json({ success: true });

      // Set the cookie
      response.cookies.set('admin_authenticated', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      });

      return response;
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  // Create a response for logout
  const response = NextResponse.json({ success: true });

  // Remove the authentication cookie
  response.cookies.delete('admin_authenticated');

  return response;
}
