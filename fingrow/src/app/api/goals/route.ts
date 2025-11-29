import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

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

    const goals = await prisma.goal.findMany({
      where: { userId: payload.userId }
    });

    return NextResponse.json(goals);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    
    const monthsToTarget = (body.targetYear - new Date().getFullYear()) * 12;
    const requiredMonthly = body.targetAmount / monthsToTarget;
    
    const goal = await prisma.goal.create({
      data: {
        userId: payload.userId,
        name: body.name,
        targetAmount: body.targetAmount,
        targetYear: body.targetYear,
        requiredMonthly,
        probability: 75
      }
    });

    return NextResponse.json(goal);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
