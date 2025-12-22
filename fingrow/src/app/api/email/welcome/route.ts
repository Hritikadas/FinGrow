/**
 * Welcome Email API Route
 * 
 * POST /api/email/welcome
 * 
 * Sends a welcome email to newly registered users. This endpoint is called
 * after successful user signup to send an onboarding email with educational
 * disclaimers and dashboard access.
 * 
 * Request body:
 * - userId: string - The ID of the user to send welcome email to
 * 
 * Response:
 * - 200: Email sent successfully
 * - 400: Invalid request data
 * - 404: User not found
 * - 500: Email service error
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendWelcomeEmail, validateEmailConfig } from '@/lib/email';
import { logger } from '@/lib/logger';
import { handleApiError, ValidationError } from '@/lib/errorHandling';
import { z } from 'zod';

const welcomeEmailSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
});

export async function POST(req: NextRequest) {
  const correlationId = logger.generateCorrelationId();
  const startTime = Date.now();
  const context = { correlationId, action: 'send-welcome-email-api' };
  
  try {
    logger.info('Welcome email API request started', context);
    
    // Validate email configuration first
    const emailConfig = validateEmailConfig();
    if (!emailConfig.isValid) {
      logger.error('Email configuration invalid', {
        ...context,
        metadata: { errors: emailConfig.errors }
      });
      
      return NextResponse.json({
        error: 'Email service not configured',
        details: emailConfig.errors
      }, { status: 500 });
    }
    
    const body = await req.json();
    
    // Validate request body
    const validationResult = welcomeEmailSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(e => 
        `${e.path.join('.')}: ${e.message}`
      ).join(', ');
      throw new ValidationError(`Validation failed: ${errors}`, correlationId);
    }
    
    const { userId } = validationResult.data;
    
    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
    
    if (!user) {
      logger.warn('Welcome email requested for non-existent user', {
        ...context,
        metadata: { userId }
      });
      
      return NextResponse.json({
        error: 'User not found'
      }, { status: 404 });
    }
    
    logger.info('Sending welcome email to user', {
      ...context,
      userId: user.id,
      metadata: { email: user.email, name: user.name }
    });
    
    // Send welcome email
    const emailSent = await sendWelcomeEmail(user);
    
    const duration = Date.now() - startTime;
    
    if (emailSent) {
      logger.info('Welcome email sent successfully via API', {
        ...context,
        userId: user.id,
        metadata: { 
          email: user.email,
          duration: `${duration}ms`
        }
      });
      
      logger.apiLog('POST', '/api/email/welcome', context, 200, duration);
      
      return NextResponse.json({
        success: true,
        message: 'Welcome email sent successfully'
      });
    } else {
      logger.error('Welcome email failed to send via API', {
        ...context,
        userId: user.id,
        metadata: { email: user.email }
      });
      
      logger.apiLog('POST', '/api/email/welcome', context, 500, duration);
      
      return NextResponse.json({
        error: 'Failed to send welcome email'
      }, { status: 500 });
    }
    
  } catch (error: any) {
    const duration = Date.now() - startTime;
    const errorResponse = handleApiError(error, correlationId);
    
    logger.apiLog('POST', '/api/email/welcome', context, errorResponse.statusCode, duration);
    
    return NextResponse.json(errorResponse, { 
      status: errorResponse.statusCode 
    });
  }
}