'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import RevenueChart, { type RevenuePoint } from './RevenueChart';

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
  const [revenueData, setRevenueData] = useState<RevenuePoint[]>([]);
  const router = useRouter();

  const fetchRevenue = async (pwd: string) => {
    try {
      const response = await fetch('/api/dashboard/revenue', {
        headers: { Authorization: `Bearer ${pwd}` },
      });
      if (response.ok) {
        const data = (await response.json()) as RevenuePoint[];
        setRevenueData(data);
      }
    } catch (error) {
      console.error('Failed to fetch revenue:', error);
    }
  };

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
        fetchRevenue(password);
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
      fetchRevenue(pwd);
    } else {
      setLoading(false);
    }
  }, []);

  const upcomingDue = (() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const cutoff = new Date(today);
    cutoff.setDate(cutoff.getDate() + 3);
    return orders
      .filter((o) => {
        if (o.status === 'completed' || o.status === 'cancelled') return false;
        const d = new Date(o.dateNeeded);
        if (isNaN(d.getTime())) return false;
        const dOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        return dOnly >= today && dOnly <= cutoff;
      })
      .sort((a, b) => new Date(a.dateNeeded).getTime() - new Date(b.dateNeeded).getTime());
  })();

  const escapeCsv = (val: string | number | undefined | null) => {
    const s = val === undefined || val === null ? '' : String(val);
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };

  const handleExportCsv = () => {
    const headers = [
      'Order #',
      'Customer Name',
      'Email',
      'Phone',
      'Date Needed',
      'Total',
      'Payment Status',
      'Order Status',
      'Created At',
    ];
    const rows = orders.map((o) =>
      [
        o.orderNumber,
        o.name,
        o.email,
        o.phone,
        o.dateNeeded,
        o.total.toFixed(2),
        o.paymentStatus,
        o.status,
        o.createdAt,
      ]
        .map(escapeCsv)
        .join(','),
    );
    const csv = [headers.map(escapeCsv).join(','), ...rows].join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const stamp = new Date().toISOString().slice(0, 10);
    link.download = `orders-${stamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
    <div className="min-h-screen bg-gray-100 py-8 sm:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">Order Dashboard</h1>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/dashboard/orders/new"
              className="px-3 py-2 text-sm sm:text-base bg-gray-900 text-white rounded-lg hover:bg-gray-700"
            >
              Add Order
            </Link>
            <Link
              href="/dashboard/customers"
              className="px-3 py-2 text-sm sm:text-base bg-gray-900 text-white rounded-lg hover:bg-gray-700"
            >
              Customers
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-2 text-sm sm:text-base bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        {upcomingDue.length > 0 && (
          <div className="mb-6 sm:mb-8 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg shadow-md p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 text-yellow-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
              <h2 className="text-base sm:text-lg font-semibold text-yellow-900">
                Orders Due in the Next 3 Days
              </h2>
            </div>
            <ul className="space-y-1.5">
              {upcomingDue.map((o) => (
                <li key={o._id} className="text-sm text-yellow-900 flex flex-wrap gap-x-3">
                  <span className="font-semibold">{o.orderNumber}</span>
                  <span>{o.name}</span>
                  <span className="text-yellow-800">Needed: {o.dateNeeded}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <p className="text-sm text-gray-600">Orders This Month</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{stats.ordersThisMonth}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <p className="text-sm text-gray-600">Revenue This Month</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              ${stats.revenueThisMonth.toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <p className="text-sm text-gray-600">Unpaid Balance</p>
            <p className="text-2xl sm:text-3xl font-bold text-red-600 mt-1">
              ${stats.unpaidBalance.toFixed(2)}
            </p>
          </div>
        </div>

        {revenueData.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
              Revenue (Last 6 Months)
            </h2>
            <RevenueChart data={revenueData} />
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">No orders yet</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex justify-between items-center px-4 sm:px-6 py-3 border-b bg-gray-50">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Orders</h2>
              <button
                onClick={handleExportCsv}
                className="px-3 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-700"
              >
                Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Order #</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Customer</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Date Needed</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Total</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Payment</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Status</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 font-semibold">{order.orderNumber}</td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-600">
                        <div>{order.name}</div>
                        <div className="text-xs text-gray-500">{order.email}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-600">{order.dateNeeded}</td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 font-semibold">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm">
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
                      <td className="px-4 sm:px-6 py-4 text-sm">
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
                      <td className="px-4 sm:px-6 py-4 text-sm">
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
