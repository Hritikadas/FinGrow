import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  
  if (!token) {
    return NextResponse.json({ 
      authenticated: false, 
      message: 'No token found in cookies' 
    });
  }

  const verified = verifyToken(token);
  
  return NextResponse.json({
    authenticated: !!verified,
    userId: verified?.userId,
    tokenLength: token.length,
    message: verified ? 'Token is valid' : 'Token is invalid'
  });
}
