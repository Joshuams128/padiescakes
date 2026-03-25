'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface OrderItem {
  name: string;
  flavor: string;
  dietaryOptions: string[];
  notes?: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  dateNeeded: string;
  notes: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export default function OrderDetailPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState(localStorage.getItem('dashboardAuth') ? '' : '');
  const [authenticated, setAuthenticated] = useState(localStorage.getItem('dashboardAuth') === 'true');
  const params = useParams();
  const router = useRouter();

  const fetchOrder = async (pwd: string) => {
    try {
      const response = await fetch(`/api/orders/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${pwd}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
      } else if (response.status === 401) {
        setAuthenticated(false);
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const pwd = localStorage.getItem('dashboardPassword') || password;
    if (authenticated) {
      fetchOrder(pwd);
    } else {
      setLoading(false);
    }
  }, [authenticated]);

  const handleStatusChange = async (newStatus: string) => {
    const pwd = localStorage.getItem('dashboardPassword') || password;
    try {
      const response = await fetch(`/api/orders/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${pwd}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="max-w-xl mx-auto">
          <Link href="/dashboard" className="text-gray-900 mb-6 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Required</h1>
            <p className="text-gray-600 mb-4">You need to log in to view this order.</p>
            <Link href="/dashboard" className="btn-primary inline-block">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 flex items-center justify-center">
        <p className="text-gray-600">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="max-w-xl mx-auto">
          <Link href="/dashboard" className="text-gray-900 mb-6 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">Order not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard" className="text-gray-900 mb-6 inline-block hover:text-gray-700">
          ← Back to Dashboard
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{order.orderNumber}</h1>
              <p className="text-sm text-gray-600 mt-1">
                {new Date(order.createdAt).toLocaleDateString()} at{' '}
                {new Date(order.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border-0 cursor-pointer ${
                order.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : order.status === 'confirmed'
                  ? 'bg-blue-100 text-blue-800'
                  : order.status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="text-gray-900 font-medium">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <a href={`mailto:${order.customerEmail}`} className="text-gray-900 hover:text-gray-700">
                    {order.customerEmail}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="text-gray-900 font-medium">{order.customerPhone}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="text-gray-900 font-medium">{order.deliveryAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date Needed</p>
                  <p className="text-gray-900 font-medium">{order.dateNeeded}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Flavor: {item.flavor}</p>
                    {item.dietaryOptions && item.dietaryOptions.length > 0 && (
                      <p className="text-sm text-gray-600">Dietary Options: {item.dietaryOptions.join(', ')}</p>
                    )}
                    {item.notes && (
                      <p className="text-sm text-gray-600">Special Instructions: {item.notes}</p>
                    )}
                    <p className="text-sm text-gray-600 mt-2">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-gray-900 font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-6 mb-6">
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold text-gray-900">Total</p>
              <p className="text-2xl font-bold text-gray-900">${order.total.toFixed(2)}</p>
            </div>
          </div>

          {order.notes && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-sm font-semibold text-blue-900 mb-2">Special Notes</p>
              <p className="text-blue-800">{order.notes}</p>
            </div>
          )}

          <div className="space-y-3">
            <a
              href={`mailto:${order.customerEmail}?subject=Your Padie's Cakes Order ${order.orderNumber}`}
              className="block w-full btn-primary text-center py-2"
            >
              Email Customer
            </a>
            <a
              href={`tel:${order.customerPhone}`}
              className="block w-full text-center py-2 border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-50"
            >
              Call Customer
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
