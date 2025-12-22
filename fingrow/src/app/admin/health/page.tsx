'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Database, 
  Cpu, 
  Globe,
  Clock,
  Server,
  Activity
} from 'lucide-react';

interface HealthCheck {
  service: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime?: number;
  error?: string;
  metadata?: Record<string, any>;
}

interface SystemHealth {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  version: string;
  uptime: number;
  checks: HealthCheck[];
}

interface Metrics {
  uptime: number;
  memory: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
  };
  version: string;
  nodeVersion: string;
  environment: string;
  timestamp: string;
}

export default function HealthPage() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchHealth = async () => {
    try {
      setLoading(true);
      const [healthResponse, metricsResponse] = await Promise.all([
        fetch('/api/admin/health'),
        fetch('/api/admin/metrics')
      ]);

      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        setHealth(healthData);
      }

      if (metricsResponse.ok) {
        const metricsData = await metricsResponse.json();
        setMetrics(metricsData);
      }

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch health data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'unhealthy':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <RefreshCw className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'unhealthy':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'database':
        return <Database className="h-5 w-5" />;
      case 'ai-engines':
        return <Cpu className="h-5 w-5" />;
      case 'external-services':
        return <Globe className="h-5 w-5" />;
      default:
        return <Server className="h-5 w-5" />;
    }
  };

  const formatUptime = (uptime: number) => {
    const seconds = Math.floor(uptime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const formatBytes = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  if (loading && !health) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Loading system health...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Activity className="h-8 w-8 mr-3 text-blue-600" />
                System Health Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Monitor system status, performance metrics, and service health
              </p>
            </div>
            <div className="text-right">
              <button
                onClick={fetchHealth}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              {lastUpdated && (
                <p className="text-sm text-gray-500 mt-1">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Overall Status */}
        {health && (
          <Card className={`p-6 mb-8 border-2 ${getStatusColor(health.status)}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {getStatusIcon(health.status)}
                <div className="ml-3">
                  <h2 className="text-xl font-semibold capitalize">
                    System Status: {health.status}
                  </h2>
                  <p className="text-sm opacity-75">
                    Version {health.version} • Uptime: {formatUptime(health.uptime)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-75">
                  {new Date(health.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Service Health Checks */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Health</h3>
            <div className="space-y-4">
              {health?.checks.map((check) => (
                <Card key={check.service} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      {getServiceIcon(check.service)}
                      <h4 className="ml-2 font-medium capitalize">
                        {check.service.replace('-', ' ')}
                      </h4>
                    </div>
                    <div className="flex items-center">
                      {getStatusIcon(check.status)}
                      <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getStatusColor(check.status)}`}>
                        {check.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    {check.responseTime && (
                      <p>Response time: {check.responseTime}ms</p>
                    )}
                    {check.error && (
                      <p className="text-red-600">Error: {check.error}</p>
                    )}
                    {check.metadata && Object.keys(check.metadata).length > 0 && (
                      <div className="mt-2">
                        <p className="font-medium">Details:</p>
                        <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                          {JSON.stringify(check.metadata, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* System Metrics */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Metrics</h3>
            {metrics && (
              <div className="space-y-4">
                <Card className="p-4">
                  <div className="flex items-center mb-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <h4 className="ml-2 font-medium">Runtime Information</h4>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Uptime: {formatUptime(metrics.uptime)}</p>
                    <p>Environment: {metrics.environment}</p>
                    <p>Node.js: {metrics.nodeVersion}</p>
                    <p>App Version: {metrics.version}</p>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center mb-3">
                    <Server className="h-5 w-5 text-green-600" />
                    <h4 className="ml-2 font-medium">Memory Usage</h4>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>RSS: {formatBytes(metrics.memory.rss)}</p>
                    <p>Heap Total: {formatBytes(metrics.memory.heapTotal)}</p>
                    <p>Heap Used: {formatBytes(metrics.memory.heapUsed)}</p>
                    <p>External: {formatBytes(metrics.memory.external)}</p>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center mb-3">
                    <Activity className="h-5 w-5 text-purple-600" />
                    <h4 className="ml-2 font-medium">Application Info</h4>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Platform: {process.platform}</p>
                    <p>Architecture: {process.arch}</p>
                    <p>PID: {process.pid}</p>
                    <p>Last Check: {new Date(metrics.timestamp).toLocaleString()}</p>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>FinGrow Health Dashboard • Educational Prototype</p>
          <p>This page shows system health for monitoring and debugging purposes</p>
        </div>
      </div>
    </div>
  );
}