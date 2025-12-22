import { NextResponse } from 'next/server';
import { monitoring } from '@/lib/monitoring';
import { logger } from '@/lib/logger';

export async function GET() {
  const correlationId = logger.generateCorrelationId();
  const context = { correlationId, action: 'metrics-api' };
  
  try {
    logger.info('Metrics API called', context);
    
    const metrics = await monitoring.getMetrics();
    
    logger.info('Metrics API completed', {
      ...context,
      metadata: { uptime: metrics.uptime, environment: metrics.environment },
    });
    
    return NextResponse.json(metrics);
  } catch (error) {
    logger.error('Metrics API failed', context, error as Error);
    
    return NextResponse.json(
      {
        error: 'Failed to collect metrics',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}