'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  name: string;
  email: string;
  phone: string;
  dateNeeded: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'unpaid' | 'deposit' | 'paid';
  createdAt: string;
}

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const emailParam = decodeURIComponent((params?.email as string) || '');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const getPwd = () =>
    typeof window !== 'undefined' ? localStorage.getItem('dashboardPassword') || '' : '';

  const fetchOrders = async () => {
    const pwd = getPwd();
    if (!pwd) {
      setAuthenticated(false);
      setLoading(false);
      return;
    }
    try {
      const response = await fetch('/api/orders/list', {
        headers: { Authorization: `Bearer ${pwd}` },
      });
      if (response.ok) {
        const data = await response.json();
        const all: Order[] = data.orders || [];
        setOrders(all.filter((o) => o.email.toLowerCase() === emailParam.toLowerCase()));
        setAuthenticated(true);
      } else if (response.status === 401) {
        setAuthenticated(false);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isAuth =
      typeof window !== 'undefined' && localStorage.getItem('dashboardAuth') === 'true';
    if (isAuth) {
      fetchOrders();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailParam]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Permanently delete customer ${emailParam} and ALL ${orders.length} of their order${orders.length === 1 ? '' : 's'}? This cannot be undone.`
    );
    if (!confirmed) return;
    setDeleting(true);
    const pwd = getPwd();
    try {
      const response = await fetch(
        `/api/customers/${encodeURIComponent(emailParam)}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${pwd}` },
        }
      );
      if (response.ok) {
        router.push('/dashboard/customers');
      } else {
        alert('Failed to delete customer');
        setDeleting(false);
      }
    } catch (error) {
      console.error('Failed to delete customer:', error);
      alert('Failed to delete customer');
      setDeleting(false);
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
        <p className="text-gray-600">Loading customer...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/dashboard/customers" className="text-gray-900 mb-6 inline-block">
            ← Back to Customers
          </Link>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">No orders found for {emailParam}</p>
          </div>
        </div>
      </div>
    );
  }

  const customer = orders[0];
  const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <Link href="/dashboard/customers" className="text-gray-900 mb-6 inline-block hover:text-gray-700">
          ← Back to Customers
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{customer.name}</h1>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="text-gray-600">Email</p>
              <a href={`mailto:${customer.email}`} className="text-gray-900 font-medium hover:text-gray-700">
                {customer.email}
              </a>
            </div>
            <div>
              <p className="text-gray-600">Phone</p>
              <a href={`tel:${customer.phone}`} className="text-gray-900 font-medium hover:text-gray-700">
                {customer.phone}
              </a>
            </div>
            <div>
              <p className="text-gray-600">Lifetime Value</p>
              <p className="text-gray-900 font-semibold">
                ${totalSpent.toFixed(2)} ({orders.length} order{orders.length === 1 ? '' : 's'})
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Order #</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Placed</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Items</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Total</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Payment</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">
                      <Link
                        href={`/dashboard/orders/${order._id}`}
                        className="text-gray-900 font-semibold hover:text-gray-700"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.items.reduce((sum, i) => sum + (i.quantity || 0), 0)}
                    </td>
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
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.status === 'confirmed'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-md p-6 border-t-4 border-red-200">
          <p className="text-sm text-gray-600 mb-3">
            Danger zone — deletes this customer and all {orders.length} of their order{orders.length === 1 ? '' : 's'}. Cannot be undone.
          </p>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? 'Deleting...' : 'Delete Customer & All Orders'}
          </button>
        </div>
      </div>
    </div>
  );
}
