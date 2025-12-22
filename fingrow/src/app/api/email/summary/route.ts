/**
 * Simulation Summary Email API Route
 * 
 * POST /api/email/summary
 * 
 * Sends a simulation summary email to users after they complete an investment
 * simulation. This endpoint is called after simulation results are saved to
 * the database to provide users with a detailed email summary.
 * 
 * Request body:
 * - userId: string - The ID of the user to send summary email to
 * - simulationId: string - The ID of the InvestmentHistory record
 * 
 * Response:
 * - 200: Email sent successfully
 * - 400: Invalid request data
 * - 404: User or simulation not found
 * - 500: Email service error
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendSimulationSummaryEmail, validateEmailConfig, SimulationSummary } from '@/lib/email';
import { logger } from '@/lib/logger';
import { handleApiError, ValidationError } from '@/lib/errorHandling';
import { z } from 'zod';

const summaryEmailSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  simulationId: z.string().min(1, 'Simulation ID is required'),
});

export async function POST(req: NextRequest) {
  const correlationId = logger.generateCorrelationId();
  const startTime = Date.now();
  const context = { correlationId, action: 'send-simulation-summary-email-api' };
  
  try {
    logger.info('Simulation summary email API request started', context);
    
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
    const validationResult = summaryEmailSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(e => 
        `${e.path.join('.')}: ${e.message}`
      ).join(', ');
      throw new ValidationError(`Validation failed: ${errors}`, correlationId);
    }
    
    const { userId, simulationId } = validationResult.data;
    
    // Fetch user and simulation from database
    const [user, simulation] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
        },
      }),
      prisma.investmentHistory.findUnique({
        where: { id: simulationId },
        select: {
          id: true,
          userId: true,
          bundleType: true,
          amount: true,
          expectedReturn: true,
          duration: true,
          currentValue: true,
          investedAt: true,
        },
      })
    ]);
    
    if (!user) {
      logger.warn('Summary email requested for non-existent user', {
        ...context,
        metadata: { userId }
      });
      
      return NextResponse.json({
        error: 'User not found'
      }, { status: 404 });
    }
    
    if (!simulation) {
      logger.warn('Summary email requested for non-existent simulation', {
        ...context,
        metadata: { simulationId, userId }
      });
      
      return NextResponse.json({
        error: 'Simulation not found'
      }, { status: 404 });
    }
    
    if (simulation.userId !== userId) {
      logger.warn('Summary email requested for simulation not owned by user', {
        ...context,
        metadata: { simulationId, userId, simulationUserId: simulation.userId }
      });
      
      return NextResponse.json({
        error: 'Simulation not found'
      }, { status: 404 });
    }
    
    // Calculate simulation summary data
    const monthlyAmount = simulation.amount;
    const totalInvested = monthlyAmount * simulation.duration;
    const finalCorpus = simulation.currentValue || totalInvested;
    const totalReturns = finalCorpus - totalInvested;
    
    // Format period from investedAt date
    const investedDate = new Date(simulation.investedAt);
    const period = investedDate.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
    
    const summaryData: SimulationSummary = {
      monthlyAmount,
      duration: simulation.duration,
      bundleType: simulation.bundleType as 'safe' | 'balanced' | 'growth',
      totalInvested,
      finalCorpus,
      totalReturns,
      expectedReturn: simulation.expectedReturn,
      period,
    };
    
    logger.info('Sending simulation summary email to user', {
      ...context,
      userId: user.id,
      metadata: { 
        email: user.email, 
        simulationId,
        bundleType: simulation.bundleType,
        duration: simulation.duration
      }
    });
    
    // Send simulation summary email
    const emailSent = await sendSimulationSummaryEmail(user, summaryData);
    
    const duration = Date.now() - startTime;
    
    if (emailSent) {
      logger.info('Simulation summary email sent successfully via API', {
        ...context,
        userId: user.id,
        metadata: { 
          email: user.email,
          simulationId,
          bundleType: simulation.bundleType,
          duration: `${duration}ms`
        }
      });
      
      logger.apiLog('POST', '/api/email/summary', context, 200, duration);
      
      return NextResponse.json({
        success: true,
        message: 'Simulation summary email sent successfully'
      });
    } else {
      logger.error('Simulation summary email failed to send via API', {
        ...context,
        userId: user.id,
        metadata: { 
          email: user.email, 
          simulationId,
          bundleType: simulation.bundleType
        }
      });
      
      logger.apiLog('POST', '/api/email/summary', context, 500, duration);
      
      return NextResponse.json({
        error: 'Failed to send simulation summary email'
      }, { status: 500 });
    }
    
  } catch (error: any) {
    const duration = Date.now() - startTime;
    const errorResponse = handleApiError(error, correlationId);
    
    logger.apiLog('POST', '/api/email/summary', context, errorResponse.statusCode, duration);
    
    return NextResponse.json(errorResponse, { 
      status: errorResponse.statusCode 
    });
  }
}