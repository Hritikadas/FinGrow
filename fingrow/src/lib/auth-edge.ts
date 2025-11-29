import { jwtVerify, SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);

export async function verifyTokenEdge(token: string): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    console.log('Token verified successfully (Edge):', { userId: payload.userId });
    return { userId: payload.userId as string };
  } catch (error: any) {
    console.error('Token verification failed (Edge):', { 
      error: error.message,
      tokenPreview: token.substring(0, 20) + '...'
    });
    return null;
  }
}

export async function generateTokenEdge(userId: string): Promise<string> {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
  
  return token;
}
