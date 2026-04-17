import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/lib/models/Order';

const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD || 'admin123';

const VALID_SOURCES = ['website', 'instagram', 'phone', 'other'] as const;
const VALID_PAYMENT = ['unpaid', 'deposit', 'paid'] as const;

function verifyAuth(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  return token === DASHBOARD_PASSWORD;
}

export async function POST(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const address = typeof body.address === 'string' ? body.address.trim() : '';
    const dateNeeded = typeof body.dateNeeded === 'string' ? body.dateNeeded.trim() : '';

    if (!name || !email || !phone || !address || !dateNeeded) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: 'At least one item is required' }, { status: 400 });
    }

    const items = body.items.map((raw: Record<string, unknown>) => ({
      name: typeof raw.name === 'string' ? raw.name : '',
      flavor: typeof raw.flavor === 'string' ? raw.flavor : undefined,
      quantity: Number(raw.quantity) || 1,
      price: Number(raw.price) || 0,
    }));

    const source = VALID_SOURCES.includes(body.source) ? body.source : 'instagram';
    const paymentStatus = VALID_PAYMENT.includes(body.paymentStatus) ? body.paymentStatus : 'unpaid';

    const computed = items.reduce(
      (sum: number, it: { quantity: number; price: number }) => sum + it.quantity * it.price,
      0,
    );
    const total = typeof body.total === 'number' && !isNaN(body.total) ? body.total : computed;

    await connectDB();
    const orderNumber = `ORD-${Date.now()}`;
    const created = await Order.create({
      orderNumber,
      name,
      email,
      phone,
      address,
      dateNeeded,
      notes: typeof body.notes === 'string' ? body.notes : undefined,
      items,
      total,
      paymentStatus,
      source,
    });

    return NextResponse.json({ success: true, orderNumber, _id: created._id });
  } catch (error) {
    console.error('Manual order creation failed:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to create order', details: msg }, { status: 500 });
  }
}
