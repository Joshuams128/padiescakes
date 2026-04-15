'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

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

export default function OrderDetailPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [depositInput, setDepositInput] = useState<string>('');
  const [amountPaidInput, setAmountPaidInput] = useState<string>('');
  const [savingPayment, setSavingPayment] = useState(false);
  const [paymentSaved, setPaymentSaved] = useState(false);
  const params = useParams();
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const getPwd = () =>
    typeof window !== 'undefined' ? localStorage.getItem('dashboardPassword') || '' : '';

  const fetchOrder = async () => {
    const pwd = getPwd();
    if (!pwd) {
      setAuthenticated(false);
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`/api/orders/${params.id}`, {
        headers: { Authorization: `Bearer ${pwd}` },
      });
      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
        setAuthenticated(true);
        setDepositInput(data.order.depositAmount?.toString() ?? '');
        setAmountPaidInput(data.order.amountPaid?.toString() ?? '');
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
    const isAuth =
      typeof window !== 'undefined' && localStorage.getItem('dashboardAuth') === 'true';
    if (isAuth) {
      setAuthenticated(true);
      fetchOrder();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const patchOrder = async (update: Record<string, unknown>) => {
    const pwd = getPwd();
    const response = await fetch(`/api/orders/${params.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${pwd}`,
      },
      body: JSON.stringify(update),
    });
    if (response.ok) {
      const data = await response.json();
      setOrder(data.order);
      return true;
    }
    return false;
  };

  const handleStatusChange = async (newStatus: string) => {
    await patchOrder({ status: newStatus });
  };

  const handlePaymentStatusChange = async (newStatus: string) => {
    await patchOrder({ paymentStatus: newStatus });
  };

  const handleDelete = async () => {
    if (!order) return;
    const confirmed = window.confirm(
      `Permanently delete order ${order.orderNumber}? This cannot be undone.`
    );
    if (!confirmed) return;
    setDeleting(true);
    const pwd = getPwd();
    try {
      const response = await fetch(`/api/orders/${params.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${pwd}` },
      });
      if (response.ok) {
        router.push('/dashboard');
      } else {
        alert('Failed to delete order');
        setDeleting(false);
      }
    } catch (error) {
      console.error('Failed to delete order:', error);
      alert('Failed to delete order');
      setDeleting(false);
    }
  };

  const handleSavePayment = async () => {
    setSavingPayment(true);
    setPaymentSaved(false);
    const deposit = depositInput === '' ? null : Number(depositInput);
    const paid = amountPaidInput === '' ? null : Number(amountPaidInput);
    const ok = await patchOrder({ depositAmount: deposit, amountPaid: paid });
    setSavingPayment(false);
    if (ok) {
      setPaymentSaved(true);
      setTimeout(() => setPaymentSaved(false), 2000);
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

  const balance = Math.max(
    (order.total || 0) - (order.amountPaid ?? (order.paymentStatus === 'deposit' ? order.depositAmount ?? 0 : 0)),
    0
  );

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
                  <p className="text-gray-900 font-medium">{order.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <a href={`mailto:${order.email}`} className="text-gray-900 hover:text-gray-700">
                    {order.email}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="text-gray-900 font-medium">{order.phone}</p>
                </div>
                <div>
                  <Link
                    href={`/dashboard/customers/${encodeURIComponent(order.email)}`}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View customer history →
                  </Link>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="text-gray-900 font-medium">{order.address}</p>
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
                    {item.flavor && <p className="text-sm text-gray-600">Flavor: {item.flavor}</p>}
                    {item.size && <p className="text-sm text-gray-600">Size: {item.size}</p>}
                    {item.filling && <p className="text-sm text-gray-600">Filling: {item.filling}</p>}
                    {item.color && <p className="text-sm text-gray-600">Colour: {item.color}</p>}
                    {item.dietaryOptions && item.dietaryOptions.length > 0 && (
                      <p className="text-sm text-gray-600">
                        Dietary Options: {item.dietaryOptions.join(', ')}
                      </p>
                    )}
                    {item.notes && (
                      <p className="text-sm text-gray-600">Special Instructions: {item.notes}</p>
                    )}
                    <p className="text-sm text-gray-600 mt-2">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-gray-900 font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
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

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment</h2>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-2">Payment Status</label>
              <select
                value={order.paymentStatus}
                onChange={(e) => handlePaymentStatusChange(e.target.value)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border-0 cursor-pointer ${
                  order.paymentStatus === 'paid'
                    ? 'bg-green-100 text-green-800'
                    : order.paymentStatus === 'deposit'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                <option value="unpaid">Unpaid</option>
                <option value="deposit">Deposit</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Deposit Amount</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={depositInput}
                  onChange={(e) => setDepositInput(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Amount Paid</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={amountPaidInput}
                  onChange={(e) => setAmountPaidInput(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Outstanding balance: <span className="font-semibold">${balance.toFixed(2)}</span>
              </p>
              <div className="flex items-center gap-3">
                {paymentSaved && <span className="text-sm text-green-600">Saved</span>}
                <button
                  onClick={handleSavePayment}
                  disabled={savingPayment}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400"
                >
                  {savingPayment ? 'Saving...' : 'Save Payment'}
                </button>
              </div>
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
              href={`mailto:${order.email}?subject=Your Padie's Cakes Order ${order.orderNumber}`}
              className="block w-full btn-primary text-center py-2"
            >
              Email Customer
            </a>
            <a
              href={`tel:${order.phone}`}
              className="block w-full text-center py-2 border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-50"
            >
              Call Customer
            </a>
          </div>

          <div className="mt-8 pt-6 border-t border-red-200">
            <p className="text-sm text-gray-600 mb-3">
              Danger zone — use this to remove test orders. This cannot be undone.
            </p>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="w-full py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleting ? 'Deleting...' : 'Delete Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
