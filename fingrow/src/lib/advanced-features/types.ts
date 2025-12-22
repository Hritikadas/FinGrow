// Core Types for Advanced Features

// Scenario Comparison Types
export interface InvestmentRules {
  roundUpEnabled: boolean;
  roundUpMultiplier: number;
  percentageRule: number;
  sweepThreshold: number;
  sweepPercentage: number;
}

export interface MonthlyProjection {
  month: number;
  investedAmount: number;
  cumulativeInvested: number;
  projectedValue: number;
  returns: number;
}

export interface InvestmentScenario {
  id: string;
  name: string;
  rules: InvestmentRules;
  projections: MonthlyProjection[];
  totalInvested: number;
  finalCorpus: number;
  totalReturns: number;
  returnPercentage: number;
}

export interface ScenarioDifferences {
  totalInvestedDiff: number;
  finalCorpusDiff: number;
  returnsDiff: number;
  percentageImprovement: number;
  breakEvenMonth?: number;
}

export interface ScenarioComparison {
  id: string;
  userId: string;
  baseScenario: InvestmentScenario;
  alternativeScenario: InvestmentScenario;
  differences: ScenarioDifferences;
  breakEvenPoint?: number;
  recommendations: string[];
  createdAt: Date;
  lastModified: Date;
}

// User Segmentation Types
export type UserSegmentType = 'salaried' | 'freelance';

export interface SeasonalPattern {
  month: number;
  incomeMultiplier: number;
  expenseMultiplier: number;
}

export interface SegmentCharacteristics {
  incomeStability: number; // 0-1 score
  cashFlowPredictability: number; // 0-1 score
  seasonalPatterns: SeasonalPattern[];
  riskTolerance: number; // 0-1 score
  liquidityNeed: number; // 0-1 score
}

export interface InvestmentStrategy {
  name: string;
  description: string;
  recommendedAllocation: {
    conservative: number;
    moderate: number;
    aggressive: number;
  };
  liquidityBuffer: number; // months of expenses
  ruleAdjustments: Partial<InvestmentRules>;
}

export interface UserSegment {
  type: UserSegmentType;
  confidence: number; // 0-1 score
  characteristics: SegmentCharacteristics;
  recommendedStrategies: InvestmentStrategy[];
  lastAnalyzed: Date;
}

export interface SegmentCustomizations {
  liquidityBufferMultiplier: number;
  recommendationAggression: number;
  educationalContentLevel: 'basic' | 'intermediate' | 'advanced';
}

export interface UserSegmentation {
  userId: string;
  segment: UserSegment;
  lastAnalyzed: Date;
  segmentHistory: SegmentChange[];
  customizations: SegmentCustomizations;
}

export interface SegmentChange {
  fromSegment: UserSegmentType;
  toSegment: UserSegmentType;
  reason: string;
  confidence: number;
  changedAt: Date;
}

// Notification System Types
export type NotificationType = 
  | 'rule_trigger'
  | 'milestone_achievement'
  | 'goal_progress'
  | 'market_alert'
  | 'behavioral_nudge'
  | 'performance_highlight'
  | 'reminder'
  | 'educational';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

export type DeliveryChannel = 'in_app' | 'push' | 'email' | 'sms';

export interface NotificationMetadata {
  actionUrl?: string;
  actionText?: string;
  imageUrl?: string;
  category: string;
  tags: string[];
  expiresAt?: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  actionUrl?: string;
  metadata: NotificationMetadata;
  deliveryChannels: DeliveryChannel[];
  createdAt: Date;
  scheduledFor?: Date;
}

export interface ChannelPreferences {
  inApp: boolean;
  push: boolean;
  email: boolean;
  sms: boolean;
}

export interface FrequencySettings {
  immediate: boolean;
  daily: boolean;
  weekly: boolean;
  monthly: boolean;
  maxPerDay: number;
}

export interface QuietHoursConfig {
  enabled: boolean;
  startHour: number; // 0-23
  endHour: number; // 0-23
  timezone: string;
}

export interface CategoryPreferences {
  ruleTriggersEnabled: boolean;
  milestonesEnabled: boolean;
  marketAlertsEnabled: boolean;
  behavioralNudgesEnabled: boolean;
  performanceHighlightsEnabled: boolean;
  remindersEnabled: boolean;
  educationalEnabled: boolean;
}

export interface NotificationPreferences {
  userId: string;
  channels: ChannelPreferences;
  frequency: FrequencySettings;
  quietHours: QuietHoursConfig;
  categories: CategoryPreferences;
  updatedAt: Date;
}

export interface DeliveryAttempt {
  channel: DeliveryChannel;
  attemptedAt: Date;
  success: boolean;
  error?: string;
  responseTime?: number;
}

export interface NotificationQueue {
  id: string;
  notification: Notification;
  scheduledFor: Date;
  attempts: DeliveryAttempt[];
  status: 'pending' | 'delivered' | 'failed' | 'cancelled';
  retryCount: number;
  maxRetries: number;
}

export interface DeliveredNotification extends Notification {
  deliveredAt: Date;
  deliveryChannel: DeliveryChannel;
  opened: boolean;
  openedAt?: Date;
  clicked: boolean;
  clickedAt?: Date;
  converted: boolean;
  convertedAt?: Date;
}

export interface EngagementMetrics {
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  totalConverted: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  averageResponseTime: number;
}

export interface NotificationHistory {
  userId: string;
  notifications: DeliveredNotification[];
  engagementMetrics: EngagementMetrics;
  fatigueScore: number; // 0-1, higher means more fatigued
  lastEngagement: Date;
}

// Common utility types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Performance monitoring types
export interface PerformanceMetrics {
  scenarioGenerationTime: number;
  segmentationTime: number;
  notificationDeliveryTime: number;
  chartRenderTime: number;
  memoryUsage: number;
}