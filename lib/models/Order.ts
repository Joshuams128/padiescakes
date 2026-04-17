import mongoose, { Schema, Document, Model } from 'mongoose';

export interface OrderItem {
  name: string;
  flavor?: string;
  size?: string;
  filling?: string;
  color?: string;
  dietaryOptions?: string[];
  notes?: string;
  quantity: number;
  price: number;
}

export interface OrderDoc extends Document {
  orderNumber: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateNeeded: string;
  notes?: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'unpaid' | 'deposit' | 'paid';
  depositAmount?: number;
  amountPaid?: number;
  source?: 'website' | 'instagram' | 'phone' | 'other';
  createdAt: Date;
}

const OrderItemSchema = new Schema<OrderItem>(
  {
    name: { type: String, required: true },
    flavor: { type: String },
    size: { type: String },
    filling: { type: String },
    color: { type: String },
    dietaryOptions: { type: [String], default: [] },
    notes: { type: String },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<OrderDoc>({
  orderNumber: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, index: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  dateNeeded: { type: String, required: true },
  notes: { type: String },
  items: { type: [OrderItemSchema], default: [] },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'deposit', 'paid'],
    default: 'unpaid',
  },
  depositAmount: { type: Number },
  amountPaid: { type: Number },
  source: {
    type: String,
    enum: ['website', 'instagram', 'phone', 'other'],
    default: 'website',
  },
  createdAt: { type: Date, default: Date.now },
});

export const Order: Model<OrderDoc> =
  (mongoose.models.Order as Model<OrderDoc>) ||
  mongoose.model<OrderDoc>('Order', OrderSchema);
