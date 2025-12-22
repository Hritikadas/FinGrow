/**
 * Investment Simulation API Route
 * 
 * POST /api/simulation
 * 
 * Runs an investment simulation, saves the results to InvestmentHistory,
 * and optionally sends a summary email to the user. This endpoint provides
 * server-side simulation processing with database persistence.
 * 
 * Request body:
 * - monthlyAmount: number - Monthly investment amount
 * - duration: number - Investment duration in months
 * - bundleType: 'safe' | 'balanced' | 'growth' - Investment bundle type
 * - sendEmail?: boolean - Whether to send summary email (default: false)
 * 
 * Response:
 * - 200: Simulation completed successfully with results
 * - 400: Invalid request data
 * - 401: Unauthorized (no valid token)
 * - 500: Simulation or database error
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { SimulationEngine } from '@/lib/ai/SimulationEngine';
import { sendSimulationSummaryEmail, SimulationSummary } from '@/lib/email';
import { logger } from '@/lib/logger';
import { handleApiError, ValidationError, AuthenticationError } from '@/lib/errorHandling';
import { z } from 'zod';

const simulationSchema = z.object({
  monthlyAmount: z.number().positive('Monthly amount must be positive'),
  duration: z.number().int().min(1).max(120, 'Duration must be between 1 and 120 months'),
  bundleType: z.enum(['safe', 'balanced', 'growth']),
  sendEmail: z.boolean().optional().default(false),
});

export async function POST(req: NextRequest) {
  const correlationId = logger.generateCorrelationId();
  const startTime = Date.now();
  const context = { correlationId, action: 'run-simulation-api' };
  
  try {
    logger.info('Simulation API request started', context);
    
    // Verify authentication
    const token = req.cookies.get('token')?.value;
    if (!token) {
      throw new AuthenticationError('No authentication token provided', correlationId);
    }
    
    const tokenPayload = verifyToken(token);
    if (!tokenPayload) {
      throw new AuthenticationError('Invalid authentication token', correlationId);
    }
    
    const userId = tokenPayload.userId;
    
    const body = await req.json();
    
    // Validate request body
    const validationResult = simulationSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(e => 
        `${e.path.join('.')}: ${e.message}`
      ).join(', ');
      throw new ValidationError(`Validation failed: ${errors}`, correlationId);
    }
    
    const { monthlyAmount, duration, bundleType, sendEmail } = validationResult.data;
    
    logger.info('Running investment simulation', {
      ...context,
      userId: userId,
      metadata: { 
        monthlyAmount, 
        duration, 
        bundleType,
        sendEmail
      }
    });
    
    // Run simulation using SimulationEngine
    const engine = new SimulationEngine(monthlyAmount, duration, bundleType);
    const simulationResult = engine.simulate();
    
    // Calculate expected return percentage
    const expectedReturns = { safe: 7, balanced: 10, growth: 14 };
    const expectedReturn = expectedReturns[bundleType];
    
    // Calculate risk score (1-10 scale)
    const riskScores = { safe: 3, balanced: 6, growth: 9 };
    const riskScore = riskScores[bundleType];
    
    // Calculate maturity date
    const maturityDate = new Date();
    maturityDate.setMonth(maturityDate.getMonth() + duration);
    
    // Save simulation to database
    const investmentHistory = await prisma.investmentHistory.create({
      data: {
        userId: userId,
        bundleType,
        amount: monthlyAmount,
        expectedReturn,
        riskScore,
        duration,
        currentValue: simulationResult.finalCorpus,
        maturityDate,
        status: 'active',
      },
    });
    
    logger.info('Simulation saved to database', {
      ...context,
      userId: userId,
      metadata: { 
        simulationId: investmentHistory.id,
        bundleType,
        finalCorpus: simulationResult.finalCorpus
      }
    });
    
    // Send email if requested
    let emailSent = false;
    if (sendEmail) {
      try {
        // Fetch user details for email
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            name: true,
          },
        });
        
        if (user) {
          // Format period for email
          const period = new Date().toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
          });
          
          const summaryData: SimulationSummary = {
            monthlyAmount,
            duration,
            bundleType,
            totalInvested: simulationResult.totalInvested,
            finalCorpus: simulationResult.finalCorpus,
            totalReturns: simulationResult.totalReturns,
            expectedReturn,
            period,
          };
          
          emailSent = await sendSimulationSummaryEmail(user, summaryData);
          
          logger.info('Simulation summary email sent', {
            ...context,
            userId: userId,
            metadata: { 
              simulationId: investmentHistory.id,
              emailSent
            }
          });
        }
      } catch (emailError: any) {
        logger.error('Failed to send simulation summary email', {
          ...context,
          userId: userId,
          metadata: {
            message: emailError.message,
            stack: emailError.stack,
            name: emailError.name
          }
        });
        // Don't fail the simulation if email fails
      }
    }
    
    const duration_ms = Date.now() - startTime;
    
    logger.info('Simulation API completed successfully', {
      ...context,
      userId: userId,
      metadata: { 
        simulationId: investmentHistory.id,
        finalCorpus: simulationResult.finalCorpus,
        emailSent,
        duration: `${duration_ms}ms`
      }
    });
    
    logger.apiLog('POST', '/api/simulation', context, 200, duration_ms);
    
    return NextResponse.json({
      success: true,
      simulation: {
        id: investmentHistory.id,
        ...simulationResult,
        bundleType,
        expectedReturn,
        riskScore,
        duration,
        maturityDate: investmentHistory.maturityDate,
      },
      emailSent,
    });
    
  } catch (error: any) {
    const duration = Date.now() - startTime;
    const errorResponse = handleApiError(error, correlationId);
    
    logger.apiLog('POST', '/api/simulation', context, errorResponse.statusCode, duration);
    
    return NextResponse.json(errorResponse, { 
      status: errorResponse.statusCode 
    });
  }
}