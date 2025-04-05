import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key-for-development';
const COOKIE_NAME = 'auth_token';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch (error) {
    return null;
  }
}

export function setAuthCookie(response: NextResponse, token: string): void {
  console.log("Setting auth cookie", { token: token.substring(0, 10) + '...' });
  
  // Set cookie for both HTTP and client-side access
  // First set the HTTP-only cookie for security
  response.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
    sameSite: 'lax',
  });
  
  // Then set a non-HTTP-only cookie with just a flag indicating user is logged in
  // This allows client-side JavaScript to detect login state without exposing the token
  response.cookies.set({
    name: 'auth_state',
    value: 'logged_in', 
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
    sameSite: 'lax',
  });
}

export function removeAuthCookie(response: NextResponse): void {
  response.cookies.set({
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    path: '/',
    sameSite: 'lax',
  });
}

export function getAuthToken(request: NextRequest): string | undefined {
  // Try to get token from cookie
  const cookieToken = request.cookies.get(COOKIE_NAME)?.value;
  if (cookieToken) return cookieToken;
  
  // Try to get token from Authorization header
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  return undefined;
}

export function getCurrentUserId(request: NextRequest): string | null {
  const token = getAuthToken(request);
  if (!token) return null;
  
  const payload = verifyToken(token);
  return payload?.userId || null;
}

// Server-side function to get the current user ID from cookies
export function getUserIdFromCookies(): string | null {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  
  if (!token) return null;
  
  const payload = verifyToken(token);
  return payload?.userId || null;
} 