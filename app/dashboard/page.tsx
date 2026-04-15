'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface OrderItem {
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

interface Order {
  _id: string;
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
  createdAt: string;
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/orders/list', {
        headers: { Authorization: `Bearer ${password}` },
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
        setAuthenticated(true);
        setAuthError('');
        localStorage.setItem('dashboardAuth', 'true');
        localStorage.setItem('dashboardPassword', password);
      } else {
        setAuthError('Invalid password');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setAuthError('Login failed');
    }
  };

  const fetchOrders = async (pwd: string) => {
    try {
      const response = await fetch('/api/orders/list', {
        headers: { Authorization: `Bearer ${pwd}` },
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      } else if (response.status === 401) {
        setAuthenticated(false);
        localStorage.removeItem('dashboardAuth');
        localStorage.removeItem('dashboardPassword');
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const pwd = localStorage.getItem('dashboardPassword') || password;
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${pwd}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus as Order['status'] } : o))
        );
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setPassword('');
    setOrders([]);
    localStorage.removeItem('dashboardAuth');
    localStorage.removeItem('dashboardPassword');
  };

  useEffect(() => {
    const isAuth = localStorage.getItem('dashboardAuth') === 'true';
    const pwd = localStorage.getItem('dashboardPassword') || '';
    if (isAuth && pwd) {
      setAuthenticated(true);
      fetchOrders(pwd);
    } else {
      setLoading(false);
    }
  }, []);

  const stats = (() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    let ordersThisMonth = 0;
    let revenueThisMonth = 0;
    let unpaidBalance = 0;
    for (const o of orders) {
      const created = new Date(o.createdAt);
      if (created >= monthStart) {
        ordersThisMonth += 1;
        revenueThisMonth += o.total || 0;
      }
      if (o.paymentStatus !== 'paid' && o.status !== 'cancelled') {
        const paid = o.amountPaid ?? (o.paymentStatus === 'deposit' ? (o.depositAmount ?? 0) : 0);
        unpaidBalance += Math.max((o.total || 0) - paid, 0);
      }
    }
    return { ordersThisMonth, revenueThisMonth, unpaidBalance };
  })();

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Admin Dashboard</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Enter Dashboard Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none"
                placeholder="••••••••"
              />
              {authError && <p className="text-red-500 text-sm mt-2">{authError}</p>}
            </div>
            <button type="submit" className="w-full btn-primary py-2 font-semibold">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 flex items-center justify-center">
        <p className="text-gray-600">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Order Dashboard</h1>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/customers"
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700"
            >
              Customers
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600">Orders This Month</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.ordersThisMonth}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600">Revenue This Month</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              ${stats.revenueThisMonth.toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600">Unpaid Balance</p>
            <p className="text-3xl font-bold text-red-600 mt-1">
              ${stats.unpaidBalance.toFixed(2)}
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">No orders yet</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Order #</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Customer</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date Needed</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Total</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Payment</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{order.orderNumber}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div>{order.name}</div>
                        <div className="text-xs text-gray-500">{order.email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.dateNeeded}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.paymentStatus === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : order.paymentStatus === 'deposit'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-sm font-semibold border-0 cursor-pointer ${
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
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => router.push(`/dashboard/orders/${order._id}`)}
                          className="text-gray-900 hover:text-gray-700 font-semibold"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
