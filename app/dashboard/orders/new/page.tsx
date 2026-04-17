'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ItemDraft {
  name: string;
  flavor: string;
  quantity: number;
  price: number;
}

type Source = 'website' | 'instagram' | 'phone' | 'other';
type PaymentStatus = 'unpaid' | 'deposit' | 'paid';

const emptyItem = (): ItemDraft => ({ name: '', flavor: '', quantity: 1, price: 0 });

export default function NewOrderPage() {
  const router = useRouter();
  const [authReady, setAuthReady] = useState(false);
  const [password, setPassword] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [dateNeeded, setDateNeeded] = useState('');
  const [source, setSource] = useState<Source>('instagram');
  const [notes, setNotes] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('unpaid');
  const [items, setItems] = useState<ItemDraft[]>([emptyItem()]);
  const [totalOverride, setTotalOverride] = useState<string>('');
  const [totalTouched, setTotalTouched] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isAuth = localStorage.getItem('dashboardAuth') === 'true';
    const pwd = localStorage.getItem('dashboardPassword') || '';
    if (!isAuth || !pwd) {
      router.replace('/dashboard');
      return;
    }
    setPassword(pwd);
    setAuthReady(true);
  }, [router]);

  const computedTotal = items.reduce(
    (sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.price) || 0),
    0,
  );

  const displayedTotal = totalTouched ? totalOverride : computedTotal.toFixed(2);

  const updateItem = (index: number, patch: Partial<ItemDraft>) => {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  };

  const addItem = () => setItems((prev) => [...prev, emptyItem()]);
  const removeItem = (index: number) =>
    setItems((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !phone || !address || !dateNeeded) {
      setError('Please fill in all required fields.');
      return;
    }
    if (items.length === 0 || items.some((it) => !it.name)) {
      setError('Every order item needs a name.');
      return;
    }

    const totalNumber = totalTouched ? Number(totalOverride) : computedTotal;
    if (isNaN(totalNumber)) {
      setError('Total must be a number.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/orders/manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          address,
          dateNeeded,
          source,
          notes: notes || undefined,
          paymentStatus,
          items: items.map((it) => ({
            name: it.name,
            flavor: it.flavor || undefined,
            quantity: Number(it.quantity) || 1,
            price: Number(it.price) || 0,
          })),
          total: totalNumber,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error || 'Failed to create order.');
        setSubmitting(false);
        return;
      }

      router.push('/dashboard');
    } catch (err) {
      console.error('Submit failed:', err);
      setError('Failed to create order.');
      setSubmitting(false);
    }
  };

  if (!authReady) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  const inputClass =
    'w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none';
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1';

  return (
    <div className="min-h-screen bg-gray-100 py-8 sm:py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Add Order</h1>
          <Link
            href="/dashboard"
            className="px-3 py-2 text-sm bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-6">
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass} htmlFor="name">Customer Name *</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="email">Email *</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="phone">Phone *</label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="dateNeeded">Date Needed *</label>
              <input
                id="dateNeeded"
                type="date"
                value={dateNeeded}
                onChange={(e) => setDateNeeded(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="address">Address / Pickup *</label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="source">Source</label>
              <select
                id="source"
                value={source}
                onChange={(e) => setSource(e.target.value as Source)}
                className={inputClass}
              >
                <option value="website">Website</option>
                <option value="instagram">Instagram</option>
                <option value="phone">Phone</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="paymentStatus">Payment Status</label>
              <select
                id="paymentStatus"
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                className={inputClass}
              >
                <option value="unpaid">Unpaid</option>
                <option value="deposit">Deposit</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Order Items</h2>
              <button
                type="button"
                onClick={addItem}
                className="px-3 py-1.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-700"
              >
                + Add Item
              </button>
            </div>
            <div className="space-y-3">
              {items.map((item, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3 border border-gray-200 rounded-lg"
                >
                  <div className="sm:col-span-4">
                    <label className={labelClass}>Item Name</label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(i, { name: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className={labelClass}>Flavor</label>
                    <input
                      type="text"
                      value={item.flavor}
                      onChange={(e) => updateItem(i, { flavor: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Quantity</label>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateItem(i, { quantity: Number(e.target.value) })}
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Price</label>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={item.price}
                      onChange={(e) => updateItem(i, { price: Number(e.target.value) })}
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-1 flex sm:items-end">
                    <button
                      type="button"
                      onClick={() => removeItem(i)}
                      disabled={items.length === 1}
                      className="w-full px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <label className={labelClass} htmlFor="notes">Special Notes</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className={inputClass}
            />
          </section>

          <section className="flex flex-wrap items-end justify-between gap-4 pt-4 border-t">
            <div>
              <label className={labelClass} htmlFor="total">Total</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">$</span>
                <input
                  id="total"
                  type="number"
                  min={0}
                  step="0.01"
                  value={displayedTotal}
                  onChange={(e) => {
                    setTotalTouched(true);
                    setTotalOverride(e.target.value);
                  }}
                  className={`${inputClass} w-40`}
                />
                {totalTouched && (
                  <button
                    type="button"
                    onClick={() => {
                      setTotalTouched(false);
                      setTotalOverride('');
                    }}
                    className="text-xs text-gray-600 underline"
                  >
                    reset
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Auto: ${computedTotal.toFixed(2)}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-60"
              >
                {submitting ? 'Saving...' : 'Save Order'}
              </button>
            </div>
          </section>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>
      </div>
    </div>
  );
}
