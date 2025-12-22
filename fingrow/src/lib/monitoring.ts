import { prisma } from './prisma';
import { logger } from './logger';

export interface HealthCheck {
  service: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime?: number;
  error?: string;
  metadata?: Record<string, any>;
}

export interface SystemHealth {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  version: string;
  uptime: number;
  checks: HealthCheck[];
}

class MonitoringService {
  private startTime = Date.now();

  async checkDatabase(): Promise<HealthCheck> {
    const startTime = Date.now();
    
    try {
      // Simple connectivity test
      await prisma.$queryRaw`SELECT 1`;
      
      const responseTime = Date.now() - startTime;
      
      return {
        service: 'database',
        status: responseTime > 1000 ? 'degraded' : 'healthy',
        responseTime,
        metadata: {
          provider: 'postgresql',
          orm: 'prisma',
        },
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      return {
        service: 'database',
        status: 'unhealthy',
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown database error',
        metadata: {
          provider: 'postgresql',
          orm: 'prisma',
        },
      };
    }
  }

  async checkAIEngines(): Promise<HealthCheck> {
    const startTime = Date.now();
    
    try {
      // Test AI engines with minimal data
      const { LiquidityPredictor } = await import('./ai/LiquidityPredictor');
      const predictor = new LiquidityPredictor(5000, []);
      const predictions = predictor.predict(1);
      
      if (!predictions || predictions.length === 0) {
        throw new Error('AI engine returned invalid results');
      }
      
      const responseTime = Date.now() - startTime;
      
      return {
        service: 'ai-engines',
        status: 'healthy',
        responseTime,
        metadata: {
          engines: ['LiquidityPredictor', 'MicroInvestmentAllocator', 'SimulationEngine'],
          testResult: 'predictions generated successfully',
        },
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      return {
        service: 'ai-engines',
        status: 'unhealthy',
        responseTime,
        error: error instanceof Error ? error.message : 'AI engine test failed',
      };
    }
  }

  async checkExternalServices(): Promise<HealthCheck> {
    // Placeholder for external service checks (APIs, etc.)
    return {
      service: 'external-services',
      status: 'healthy',
      responseTime: 0,
      metadata: {
        note: 'No external services configured',
      },
    };
  }

  async getSystemHealth(): Promise<SystemHealth> {
    const correlationId = logger.generateCorrelationId();
    const context = { correlationId, action: 'health-check' };
    
    logger.info('Starting system health check', context);
    
    const checks = await Promise.all([
      this.checkDatabase(),
      this.checkAIEngines(),
      this.checkExternalServices(),
    ]);
    
    // Determine overall system status
    const hasUnhealthy = checks.some(check => check.status === 'unhealthy');
    const hasDegraded = checks.some(check => check.status === 'degraded');
    
    let overallStatus: SystemHealth['status'];
    if (hasUnhealthy) {
      overallStatus = 'unhealthy';
    } else if (hasDegraded) {
      overallStatus = 'degraded';
    } else {
      overallStatus = 'healthy';
    }
    
    const health: SystemHealth = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      uptime: Date.now() - this.startTime,
      checks,
    };
    
    logger.info(`Health check completed: ${overallStatus}`, {
      ...context,
      metadata: {
        status: overallStatus,
        checksCount: checks.length,
        unhealthyCount: checks.filter(c => c.status === 'unhealthy').length,
        degradedCount: checks.filter(c => c.status === 'degraded').length,
      },
    });
    
    return health;
  }

  async getMetrics() {
    const correlationId = logger.generateCorrelationId();
    const context = { correlationId, action: 'get-metrics' };
    
    try {
      // Basic application metrics
      const metrics = {
        uptime: Date.now() - this.startTime,
        memory: process.memoryUsage(),
        version: process.env.npm_package_version || '1.0.0',
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
      };
      
      logger.debug('Metrics collected', { ...context, metadata: metrics });
      
      return metrics;
    } catch (error) {
      logger.error('Failed to collect metrics', context, error as Error);
      throw error;
    }
  }
}

export const monitoring = new MonitoringService();