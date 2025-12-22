import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';
import { sendWelcomeEmail } from '@/lib/email';
import { logger } from '@/lib/logger';
import { handleApiError, ValidationError, DatabaseError } from '@/lib/errorHandling';
import { RiskProfiler } from '@/lib/ai/RiskProfiler';
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  age: z.number().int().min(18).max(100),
  monthlyIncome: z.number().positive(),
  monthlyExpenses: z.number().positive(),
  investmentHorizon: z.number().int().min(1).max(50), // 1-50 years
});

export async function POST(req: NextRequest) {
  const correlationId = logger.generateCorrelationId();
  const startTime = Date.now();
  const context = { correlationId, action: 'user-signup' };
  
  try {
    logger.info('User signup attempt started', context);
    
    const body = await req.json();
    
    // Validate with Zod
    const validationResult = signupSchema.safeParse(body);
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw new ValidationError(`Validation failed: ${errors}`, correlationId);
    }

    const data = validationResult.data;
    
    logger.info('Signup validation passed', {
      ...context,
      metadata: { email: data.email, name: data.name, age: data.age },
    });

    // Check for existing user
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      logger.warn('Signup attempt with existing email', {
        ...context,
        metadata: { email: data.email },
      });
      
      throw new ValidationError('User already exists with this email', correlationId);
    }

    // Calculate risk profile using AI
    const riskProfiler = new RiskProfiler(
      data.age,
      data.monthlyIncome,
      data.monthlyExpenses,
      data.investmentHorizon
    );
    
    const riskProfile = riskProfiler.calculateRiskProfile();
    
    logger.info('Risk profile calculated', {
      ...context,
      metadata: { 
        riskScore: riskProfile.riskScore,
        riskCategory: riskProfile.riskCategory,
        recommendedBundle: riskProfile.recommendedBundle
      },
    });

    // Hash password and create user
    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        age: data.age,
        monthlyIncome: data.monthlyIncome,
        monthlyExpenses: data.monthlyExpenses,
        investmentHorizon: data.investmentHorizon,
        riskScore: riskProfile.riskScore,
        riskCategory: riskProfile.riskCategory,
        recommendedBundle: riskProfile.recommendedBundle,
      },
    });

    const token = generateToken(user.id);
    const duration = Date.now() - startTime;

    // Send welcome email (don't block signup if email fails)
    sendWelcomeEmail({
      id: user.id,
      email: user.email,
      name: user.name,
    }).catch((error) => {
      logger.error('Welcome email failed during signup', {
        ...context,
        userId: user.id,
        metadata: {
          message: error.message,
          stack: error.stack,
          name: error.name
        }
      });
    });

    logger.info('User signup completed successfully', {
      ...context,
      userId: user.id,
      metadata: { 
        email: user.email, 
        name: user.name,
        age: user.age,
        riskCategory: user.riskCategory,
        riskScore: user.riskScore,
        duration: `${duration}ms`,
      },
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        age: user.age,
        riskCategory: user.riskCategory,
        riskScore: user.riskScore,
        recommendedBundle: user.recommendedBundle,
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

    logger.apiLog('POST', '/api/auth/signup', context, 200, duration);
    return response;
    
  } catch (error: any) {
    const duration = Date.now() - startTime;
    const errorResponse = handleApiError(error, correlationId);
    
    logger.apiLog('POST', '/api/auth/signup', context, errorResponse.statusCode, duration);
    
    return NextResponse.json(errorResponse, { 
      status: errorResponse.statusCode 
    });
  }
}
