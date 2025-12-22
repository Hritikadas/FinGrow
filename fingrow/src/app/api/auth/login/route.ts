import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, generateToken } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { handleApiError, ValidationError, AuthenticationError } from '@/lib/errorHandling';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(req: NextRequest) {
  const correlationId = logger.generateCorrelationId();
  const startTime = Date.now();
  const context = { correlationId, action: 'user-login' };
  
  try {
    logger.info('User login attempt started', context);
    
    const body = await req.json();
    
    const validationResult = loginSchema.safeParse(body);
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw new ValidationError(`Validation failed: ${errors}`, correlationId);
    }

    const data = validationResult.data;
    
    logger.info('Login validation passed', {
      ...context,
      metadata: { email: data.email },
    });

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      logger.warn('Login attempt with non-existent email', {
        ...context,
        metadata: { email: data.email },
      });
      
      throw new AuthenticationError('Invalid email or password', correlationId);
    }

    const isValid = await verifyPassword(data.password, user.password);

    if (!isValid) {
      logger.warn('Login attempt with invalid password', {
        ...context,
        userId: user.id,
        metadata: { email: data.email },
      });
      
      throw new AuthenticationError('Invalid email or password', correlationId);
    }

    const token = generateToken(user.id);
    const duration = Date.now() - startTime;

    logger.info('User login completed successfully', {
      ...context,
      userId: user.id,
      metadata: { 
        email: user.email, 
        name: user.name,
        duration: `${duration}ms`,
      },
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    });

    // Set token as HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    // Also set a non-httpOnly version for client-side checks (less secure but helps with debugging)
    response.cookies.set('auth_status', 'authenticated', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    logger.apiLog('POST', '/api/auth/login', context, 200, duration);
    return response;
    
  } catch (error: any) {
    const duration = Date.now() - startTime;
    const errorResponse = handleApiError(error, correlationId);
    
    logger.apiLog('POST', '/api/auth/login', context, errorResponse.statusCode, duration);
    
    return NextResponse.json(errorResponse, { 
      status: errorResponse.statusCode 
    });
  }
}
