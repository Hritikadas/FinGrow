import { NextRequest, NextResponse } from 'next/server';
import { validateEmailConfig, sendWelcomeEmail } from '@/lib/email';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
  const correlationId = logger.generateCorrelationId();
  const context = { correlationId, action: 'test-email-config' };
  
  try {
    logger.info('Testing email configuration', context);
    
    // Validate email configuration
    const validation = validateEmailConfig();
    
    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        message: 'Email configuration is invalid',
        errors: validation.errors,
        config: {
          hasResendKey: !!process.env.RESEND_API_KEY,
          hasEmailFrom: !!process.env.EMAIL_FROM,
          emailFrom: process.env.EMAIL_FROM
        }
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Email configuration is valid',
      config: {
        hasResendKey: !!process.env.RESEND_API_KEY,
        hasEmailFrom: !!process.env.EMAIL_FROM,
        emailFrom: process.env.EMAIL_FROM,
        resendKeyPreview: process.env.RESEND_API_KEY ? 
          `${process.env.RESEND_API_KEY.substring(0, 8)}...` : 'Not set'
      }
    });
    
  } catch (error: any) {
    logger.error('Email configuration test failed', {
      ...context,
      metadata: {
        message: error.message,
        stack: error.stack
      }
    });
    
    return NextResponse.json({
      success: false,
      message: 'Email configuration test failed',
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const correlationId = logger.generateCorrelationId();
  const context = { correlationId, action: 'send-test-email' };
  
  try {
    const body = await req.json();
    const { email, name } = body;
    
    if (!email || !name) {
      return NextResponse.json({
        success: false,
        message: 'Email and name are required'
      }, { status: 400 });
    }
    
    logger.info('Sending test email', {
      ...context,
      metadata: { email, name }
    });
    
    // Send test welcome email
    const emailSent = await sendWelcomeEmail({
      id: 'test-user-id',
      email,
      name
    });
    
    if (emailSent) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
        recipient: email
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to send test email'
      }, { status: 500 });
    }
    
  } catch (error: any) {
    logger.error('Test email sending failed', {
      ...context,
      metadata: {
        message: error.message,
        stack: error.stack
      }
    });
    
    return NextResponse.json({
      success: false,
      message: 'Test email sending failed',
      error: error.message
    }, { status: 500 });
  }
}