import { NextRequest, NextResponse } from 'next/server';
import { ScenarioGenerator } from '@/lib/advanced-features/scenario-comparison/ScenarioGenerator';
import { ComparisonCalculator } from '@/lib/advanced-features/scenario-comparison/ComparisonCalculator';
import { InvestmentRules } from '@/lib/advanced-features/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      baseRules,
      alternativeRules,
      userIncome,
      userExpenses,
      projectionMonths = 60
    } = body;

    // Validate required fields
    if (!baseRules || !alternativeRules || !userIncome || !userExpenses) {
      return NextResponse.json(
        { error: 'Missing required fields: baseRules, alternativeRules, userIncome, userExpenses' },
        { status: 400 }
      );
    }

    const generator = new ScenarioGenerator();
    const calculator = new ComparisonCalculator();

    // Validate rules
    const baseValidation = generator.validateRules(baseRules, userIncome, userExpenses);
    const altValidation = generator.validateRules(alternativeRules, userIncome, userExpenses);

    if (!baseValidation.isValid) {
      return NextResponse.json(
        { error: 'Invalid base rules', details: baseValidation.errors },
        { status: 400 }
      );
    }

    if (!altValidation.isValid) {
      return NextResponse.json(
        { error: 'Invalid alternative rules', details: altValidation.errors },
        { status: 400 }
      );
    }

    // Generate scenarios
    const baseScenario = generator.generateScenario(
      'base',
      'Current Strategy',
      baseRules,
      userIncome,
      userExpenses,
      projectionMonths
    );

    const alternativeScenario = generator.generateScenario(
      'alternative',
      'Alternative Strategy',
      alternativeRules,
      userIncome,
      userExpenses,
      projectionMonths
    );

    // Calculate comparison
    const comparison = calculator.createComparison(
      'temp', // Will be replaced with actual user ID in real implementation
      baseScenario,
      alternativeScenario
    );

    return NextResponse.json({
      success: true,
      data: comparison
    });

  } catch (error) {
    console.error('Scenario comparison error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const income = parseFloat(searchParams.get('income') || '0');
    const expenses = parseFloat(searchParams.get('expenses') || '0');

    if (income <= 0 || expenses <= 0) {
      return NextResponse.json(
        { error: 'Valid income and expenses required' },
        { status: 400 }
      );
    }

    // Generate sample scenarios for comparison
    const generator = new ScenarioGenerator();
    
    const scenarios = [
      // 10% rule
      generator.generateScenario(
        'rule_10',
        '10% Rule',
        {
          roundUpEnabled: false,
          roundUpMultiplier: 1,
          percentageRule: 10,
          sweepThreshold: 0,
          sweepPercentage: 0
        },
        income,
        expenses
      ),
      // 20% rule
      generator.generateScenario(
        'rule_20',
        '20% Rule',
        {
          roundUpEnabled: false,
          roundUpMultiplier: 1,
          percentageRule: 20,
          sweepThreshold: 0,
          sweepPercentage: 0
        },
        income,
        expenses
      ),
      // Round-up + 15% rule
      generator.generateScenario(
        'roundup_15',
        'Round-up + 15%',
        {
          roundUpEnabled: true,
          roundUpMultiplier: 2,
          percentageRule: 15,
          sweepThreshold: 0,
          sweepPercentage: 0
        },
        income,
        expenses
      ),
      // Aggressive sweep strategy
      generator.generateScenario(
        'sweep_aggressive',
        'Sweep Strategy',
        {
          roundUpEnabled: true,
          roundUpMultiplier: 1,
          percentageRule: 10,
          sweepThreshold: 5000,
          sweepPercentage: 50
        },
        income,
        expenses
      )
    ];

    const calculator = new ComparisonCalculator();
    const summaryStats = calculator.calculateSummaryStats(scenarios);

    return NextResponse.json({
      success: true,
      data: {
        scenarios,
        summaryStats
      }
    });

  } catch (error) {
    console.error('Scenario generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}