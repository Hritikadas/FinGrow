/**
 * Email Service for FinGrow
 * 
 * This module provides a clean abstraction for sending transactional emails
 * using Resend. It handles welcome emails after signup and simulation summary
 * emails after running investment simulations.
 * 
 * Features:
 * - Type-safe email templates
 * - Environment variable validation
 * - Error handling with graceful fallbacks
 * - Educational disclaimer compliance
 */

import { Resend } from 'resend';
import { logger } from './logger';

// Types for email data
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface SimulationSummary {
  monthlyAmount: number;
  duration: number;
  bundleType: 'safe' | 'balanced' | 'growth';
  totalInvested: number;
  finalCorpus: number;
  totalReturns: number;
  expectedReturn: number;
  period: string; // e.g., "December 2024"
}

// Initialize Resend client
let resend: Resend | null = null;

function initializeResend(): Resend {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is required');
    }
    
    resend = new Resend(apiKey);
    logger.info('Resend client initialized successfully', {
      correlationId: 'resend-init',
      action: 'initialize-resend'
    });
  }
  
  return resend;
}

function getEmailFrom(): string {
  const emailFrom = process.env.EMAIL_FROM;
  
  if (!emailFrom) {
    throw new Error('EMAIL_FROM environment variable is required');
  }
  
  return emailFrom;
}

/**
 * Send welcome email to new users after successful signup
 */
export async function sendWelcomeEmail(user: User): Promise<boolean> {
  const correlationId = logger.generateCorrelationId();
  const context = { correlationId, action: 'send-welcome-email', userId: user.id };
  
  try {
    logger.info('Sending welcome email', {
      ...context,
      metadata: { email: user.email, name: user.name }
    });
    
    const resendClient = initializeResend();
    const fromEmail = getEmailFrom();
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to FinGrow</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            body { font-family: 'Inter', Arial, sans-serif; }
          </style>
        </head>
        <body style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f8fafc;">
          
          <!-- Header with Logo -->
          <div style="background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%); padding: 40px 30px; text-align: center; border-radius: 0;">
            <div style="background: white; display: inline-block; padding: 15px 25px; border-radius: 50px; margin-bottom: 20px;">
              <h1 style="color: #3B82F6; margin: 0; font-size: 24px; font-weight: 700;">FinGrow</h1>
            </div>
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700;">Welcome to FinGrow! 🚀</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 18px;">
              Your AI-Powered Investment Journey Starts Here
            </p>
          </div>
          
          <!-- Main Content -->
          <div style="background: white; padding: 40px 30px;">
            <h2 style="color: #1F2937; margin-top: 0; font-size: 24px; font-weight: 600;">Hi ${user.name}! 👋</h2>
            
            <p style="font-size: 16px; margin-bottom: 25px; color: #4B5563; line-height: 1.7;">
              Thank you for joining <strong>FinGrow</strong>, your AI-powered micro-investment simulator! 
              We're excited to help you explore the world of automated investing and learn about building wealth through smart financial decisions.
            </p>
            
            <!-- Features Grid -->
            <div style="margin: 30px 0;">
              <h3 style="color: #1F2937; font-size: 20px; font-weight: 600; margin-bottom: 20px;">🎯 What You Can Do:</h3>
              
              <div style="display: grid; gap: 15px;">
                <div style="background: #F0F9FF; border-left: 4px solid #3B82F6; padding: 15px; border-radius: 8px;">
                  <strong style="color: #1E40AF;">📊 Explore Investment Bundles</strong><br>
                  <span style="color: #64748B; font-size: 14px;">Safe (7%), Balanced (10%), Growth (14%) - Find your perfect match</span>
                </div>
                
                <div style="background: #F3E8FF; border-left: 4px solid #8B5CF6; padding: 15px; border-radius: 8px;">
                  <strong style="color: #7C3AED;">🤖 Run AI-Powered Simulations</strong><br>
                  <span style="color: #64748B; font-size: 14px;">See how your investments could grow over time with compound interest</span>
                </div>
                
                <div style="background: #FDF2F8; border-left: 4px solid #EC4899; padding: 15px; border-radius: 8px;">
                  <strong style="color: #DB2777;">📈 Track Portfolio Growth</strong><br>
                  <span style="color: #64748B; font-size: 14px;">Monitor your simulated investments and learn from the data</span>
                </div>
                
                <div style="background: #F0FDF4; border-left: 4px solid #22C55E; padding: 15px; border-radius: 8px;">
                  <strong style="color: #16A34A;">🎓 Learn Investment Strategies</strong><br>
                  <span style="color: #64748B; font-size: 14px;">Compare different approaches and build your financial knowledge</span>
                </div>
              </div>
            </div>
            
            <!-- Educational Disclaimer -->
            <div style="background: #FEF3C7; border: 2px solid #F59E0B; border-radius: 12px; padding: 20px; margin: 30px 0;">
              <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <span style="font-size: 24px; margin-right: 10px;">📚</span>
                <strong style="color: #92400E; font-size: 16px;">Educational Prototype Notice</strong>
              </div>
              <p style="margin: 0; font-size: 14px; color: #92400E; line-height: 1.6;">
                FinGrow is an educational simulation platform designed for learning purposes. All returns (7%, 10%, 14%) and investment data are <strong>simulated examples only</strong> and do not constitute financial advice. Always consult qualified financial advisors for real investment decisions.
              </p>
            </div>
            
            <!-- Call to Action -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard" 
                 style="background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);">
                🚀 Go to Dashboard
              </a>
            </div>
            
            <!-- Quick Start Tips -->
            <div style="background: #F8FAFC; border-radius: 12px; padding: 25px; margin: 30px 0;">
              <h3 style="color: #1F2937; font-size: 18px; font-weight: 600; margin-top: 0;">💡 Quick Start Tips:</h3>
              <ol style="color: #4B5563; font-size: 14px; line-height: 1.7; padding-left: 20px;">
                <li>Complete your <strong>Risk Assessment</strong> (takes 2 minutes)</li>
                <li>Explore the <strong>Investment Bundles</strong> based on your risk profile</li>
                <li>Run your first <strong>Simulation</strong> with different amounts and durations</li>
                <li>Check out the <strong>AI Insights</strong> for personalized recommendations</li>
              </ol>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #E5E7EB;">
              <p style="font-size: 16px; color: #1F2937; margin-bottom: 5px; font-weight: 600;">
                Happy investing (simulated)! 📈
              </p>
              <p style="font-size: 14px; color: #6B7280; margin: 0;">
                The FinGrow Team<br>
                <span style="font-size: 12px;">Building the future of AI-powered investment education</span>
              </p>
            </div>
          </div>
          
          <!-- Footer Banner -->
          <div style="background: #1F2937; padding: 20px 30px; text-align: center;">
            <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
              This email was sent from FinGrow's educational investment simulator.<br>
              All data and returns shown are simulated for learning purposes only.
            </p>
          </div>
        </body>
      </html>
    `;
    
    const result = await resendClient.emails.send({
      from: fromEmail,
      to: user.email,
      subject: 'Welcome to FinGrow - Start Your Investment Journey! 🚀',
      html: htmlContent,
      // Add headers to improve deliverability
      headers: {
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal',
        'X-Mailer': 'FinGrow Investment Platform',
        'List-Unsubscribe': `<${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/unsubscribe>`,
      },
      // Add tags for tracking
      tags: [
        { name: 'category', value: 'welcome' },
        { name: 'environment', value: process.env.NODE_ENV || 'development' }
      ]
    });
    
    logger.info('Welcome email sent successfully', {
      ...context,
      metadata: { 
        emailId: result.data?.id,
        email: user.email 
      }
    });
    
    return true;
    
  } catch (error: any) {
    logger.error('Failed to send welcome email', {
      ...context,
      metadata: {
        message: error.message,
        stack: error.stack,
        name: error.name
      }
    });
    
    // Don't throw - email failure shouldn't break signup
    return false;
  }
}

/**
 * Send simulation summary email after user runs a simulation
 */
export async function sendSimulationSummaryEmail(
  user: User, 
  summary: SimulationSummary
): Promise<boolean> {
  const correlationId = logger.generateCorrelationId();
  const context = { 
    correlationId, 
    action: 'send-simulation-summary-email', 
    userId: user.id 
  };
  
  try {
    logger.info('Sending simulation summary email', {
      ...context,
      metadata: { 
        email: user.email, 
        bundleType: summary.bundleType,
        duration: summary.duration 
      }
    });
    
    const resendClient = initializeResend();
    const fromEmail = getEmailFrom();
    
    // Format currency for display
    const formatCurrency = (amount: number) => 
      new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(amount);
    
    // Get bundle details
    const bundleDetails = {
      safe: { name: 'Safe Bundle', color: '#10b981', return: '7%' },
      balanced: { name: 'Balanced Bundle', color: '#3b82f6', return: '10%' },
      growth: { name: 'Growth Bundle', color: '#8b5cf6', return: '14%' }
    };
    
    const bundle = bundleDetails[summary.bundleType];
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Investment Simulation Results</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, ${bundle.color} 0%, #667eea 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Your Simulation Results 📊</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
              ${summary.period} • ${bundle.name}
            </p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Hi ${user.name}!</h2>
            
            <p style="font-size: 16px; margin-bottom: 25px;">
              Here's a summary of your latest investment simulation using the ${bundle.name}.
            </p>
            
            <div style="background: white; border-radius: 12px; padding: 25px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h3 style="margin-top: 0; color: ${bundle.color}; text-align: center;">Simulation Summary</h3>
              
              <div style="display: grid; gap: 15px;">
                <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
                  <span style="font-weight: bold;">Monthly Investment:</span>
                  <span>${formatCurrency(summary.monthlyAmount)}</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
                  <span style="font-weight: bold;">Duration:</span>
                  <span>${summary.duration} months</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
                  <span style="font-weight: bold;">Bundle Type:</span>
                  <span style="color: ${bundle.color}; font-weight: bold;">${bundle.name} (${bundle.return})</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
                  <span style="font-weight: bold;">Total Invested:</span>
                  <span>${formatCurrency(summary.totalInvested)}</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; padding: 15px 0; background: #f0f9ff; margin: 10px -15px -15px -15px; padding: 20px; border-radius: 0 0 12px 12px;">
                  <span style="font-weight: bold; font-size: 18px;">Final Corpus:</span>
                  <span style="color: ${bundle.color}; font-weight: bold; font-size: 18px;">${formatCurrency(summary.finalCorpus)}</span>
                </div>
              </div>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 25px 0;">
              <p style="margin: 0; font-weight: bold; color: #856404;">
                ⚠️ Simulated Returns Only
              </p>
              <p style="margin: 5px 0 0 0; font-size: 14px; color: #856404;">
                These results are based on simulated ${bundle.return} annual returns and are for educational purposes only. Actual investment returns may vary significantly.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/simulation" 
                 style="background: linear-gradient(135deg, ${bundle.color} 0%, #667eea 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin-right: 10px;">
                Run Another Simulation
              </a>
              
              <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/scenario-comparison" 
                 style="background: transparent; color: ${bundle.color}; padding: 15px 30px; text-decoration: none; border: 2px solid ${bundle.color}; border-radius: 8px; font-weight: bold; display: inline-block;">
                Compare Strategies
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; text-align: center; margin-top: 30px;">
              Keep exploring and learning!<br>
              The FinGrow Team
            </p>
          </div>
        </body>
      </html>
    `;
    
    const result = await resendClient.emails.send({
      from: fromEmail,
      to: user.email,
      subject: `Your ${bundle.name} Simulation Results - ${formatCurrency(summary.finalCorpus)} Projected!`,
      html: htmlContent,
    });
    
    logger.info('Simulation summary email sent successfully', {
      ...context,
      metadata: { 
        emailId: result.data?.id,
        email: user.email,
        bundleType: summary.bundleType,
        finalCorpus: summary.finalCorpus
      }
    });
    
    return true;
    
  } catch (error: any) {
    logger.error('Failed to send simulation summary email', {
      ...context,
      metadata: {
        message: error.message,
        stack: error.stack,
        name: error.name
      }
    });
    
    // Don't throw - email failure shouldn't break simulation
    return false;
  }
}

/**
 * Validate email configuration on startup
 */
export function validateEmailConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!process.env.RESEND_API_KEY) {
    errors.push('RESEND_API_KEY environment variable is missing');
  }
  
  if (!process.env.EMAIL_FROM) {
    errors.push('EMAIL_FROM environment variable is missing');
  }
  
  if (errors.length > 0) {
    logger.warn('Email configuration validation failed', {
      correlationId: 'email-config-validation',
      action: 'validate-email-config',
      metadata: { errors }
    });
  } else {
    logger.info('Email configuration validated successfully', {
      correlationId: 'email-config-validation',
      action: 'validate-email-config'
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}