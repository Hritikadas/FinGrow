import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { SpendingAnalyzer } from '@/lib/ai/SpendingAnalyzer';
import { LiquidityPredictor } from '@/lib/ai/LiquidityPredictor';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId }
    });

    const transactions = await prisma.transaction.findMany({
      where: { userId: payload.userId }
    });

    const analyzer = new SpendingAnalyzer(transactions);
    const analysis = analyzer.analyze();
    const heatmap = analyzer.getSpendingHeatmap();

    const predictor = new LiquidityPredictor(
      user?.monthlyIncome || 0,
      transactions
    );
    const predictions = predictor.predict(3);
    const currentSurplus = predictor.getCurrentSurplus();

    return NextResponse.json({
      analysis,
      heatmap,
      predictions,
      currentSurplus
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
