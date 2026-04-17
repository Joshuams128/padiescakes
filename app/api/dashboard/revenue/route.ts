import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/lib/models/Order';

const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD || 'admin123';

function verifyAuth(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  return token === DASHBOARD_PASSWORD;
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export async function GET(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    const now = new Date();
    const startMonth = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const results = await Order.aggregate<{ _id: { y: number; m: number }; revenue: number }>([
      {
        $match: {
          createdAt: { $gte: startMonth },
          status: { $ne: 'cancelled' },
        },
      },
      {
        $group: {
          _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' } },
          revenue: { $sum: '$total' },
        },
      },
    ]);

    const bucket = new Map<string, number>();
    for (const r of results) {
      bucket.set(`${r._id.y}-${r._id.m}`, r.revenue);
    }

    const data: { month: string; revenue: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      data.push({
        month: `${MONTH_LABELS[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`,
        revenue: Math.round((bucket.get(key) ?? 0) * 100) / 100,
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch revenue:', error);
    return NextResponse.json({ error: 'Failed to fetch revenue' }, { status: 500 });
  }
}
