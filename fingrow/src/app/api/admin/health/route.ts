import { NextResponse } from 'next/server';
import { monitoring } from '@/lib/monitoring';
import { logger } from '@/lib/logger';

export async function GET() {
  const correlationId = logger.generateCorrelationId();
  const context = { correlationId, action: 'health-check-api' };
  
  try {
    logger.info('Health check API called', context);
    
    const health = await monitoring.getSystemHealth();
    
    logger.info('Health check API completed', {
      ...context,
      metadata: { status: health.status, checksCount: health.checks.length },
    });
    
    // Return appropriate HTTP status based on health
    const httpStatus = health.status === 'healthy' ? 200 : 
                      health.status === 'degraded' ? 200 : 503;
    
    return NextResponse.json(health, { status: httpStatus });
  } catch (error) {
    logger.error('Health check API failed', context, error as Error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}