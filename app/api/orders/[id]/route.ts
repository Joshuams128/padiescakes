import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/lib/models/Order';

const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD || 'admin123';

function verifyAuth(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  return token === DASHBOARD_PASSWORD;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid order id' }, { status: 400 });
  }

  try {
    await connectDB();
    const order = await Order.findById(id).lean();
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ order });
  } catch (error) {
    console.error('Failed to fetch order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid order id' }, { status: 400 });
  }

  try {
    await connectDB();
    const deleted = await Order.findByIdAndDelete(id).lean();
    if (!deleted) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete order:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid order id' }, { status: 400 });
  }

  const body = await req.json();
  const update: Record<string, unknown> = {};
  const allowedStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
  const allowedPaymentStatuses = ['unpaid', 'deposit', 'paid'];

  if (body.status !== undefined) {
    if (!allowedStatuses.includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    update.status = body.status;
  }
  if (body.paymentStatus !== undefined) {
    if (!allowedPaymentStatuses.includes(body.paymentStatus)) {
      return NextResponse.json({ error: 'Invalid payment status' }, { status: 400 });
    }
    update.paymentStatus = body.paymentStatus;
  }
  if (body.depositAmount !== undefined) {
    update.depositAmount = body.depositAmount === null ? null : Number(body.depositAmount);
  }
  if (body.amountPaid !== undefined) {
    update.amountPaid = body.amountPaid === null ? null : Number(body.amountPaid);
  }
  if (body.dateNeeded !== undefined) {
    if (typeof body.dateNeeded !== 'string' || !body.dateNeeded.trim()) {
      return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
    }
    update.dateNeeded = body.dateNeeded.trim();
  }

  try {
    await connectDB();
    const order = await Order.findByIdAndUpdate(id, update, { new: true }).lean();
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ order });
  } catch (error) {
    console.error('Failed to update order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
