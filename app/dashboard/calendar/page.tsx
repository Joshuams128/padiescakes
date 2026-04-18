'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useDashboardToken } from '../useDashboardToken';

interface Order {
  _id: string;
  orderNumber: string;
  name: string;
  email: string;
  dateNeeded: string;
  total: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'unpaid' | 'deposit' | 'paid';
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const STATUS_STYLES: Record<Order['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-900 border-yellow-300',
  confirmed: 'bg-blue-100 text-blue-900 border-blue-300',
  completed: 'bg-green-100 text-green-900 border-green-300',
  cancelled: 'bg-gray-100 text-gray-600 border-gray-300 line-through',
};

function ymd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseOrderDate(s: string): Date | null {
  if (!s) return null;
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(s) ? `${s}T00:00:00` : s;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export default function CalendarPage() {
  const { token, authenticated, loading: sessionLoading } = useDashboardToken();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewDate, setViewDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingDate, setEditingDate] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authenticated || !token) return;
    const run = async () => {
      try {
        const res = await fetch('/api/orders/list', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch (e) {
        console.error('Failed to fetch orders:', e);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [authenticated, token]);

  const { days, ordersByDay } = useMemo(() => {
    const firstOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const gridStart = new Date(firstOfMonth);
    gridStart.setDate(gridStart.getDate() - gridStart.getDay());
    const d: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const cur = new Date(gridStart);
      cur.setDate(gridStart.getDate() + i);
      d.push(cur);
    }

    const byDay = new Map<string, Order[]>();
    for (const o of orders) {
      const parsed = parseOrderDate(o.dateNeeded);
      if (!parsed) continue;
      const key = ymd(parsed);
      const arr = byDay.get(key) ?? [];
      arr.push(o);
      byDay.set(key, arr);
    }
    for (const arr of byDay.values()) {
      arr.sort((a, b) => a.orderNumber.localeCompare(b.orderNumber));
    }
    return { days: d, ordersByDay: byDay };
  }, [viewDate, orders]);

  const todayKey = ymd(new Date());
  const monthLabel = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const goPrev = () => setViewDate((v) => new Date(v.getFullYear(), v.getMonth() - 1, 1));
  const goNext = () => setViewDate((v) => new Date(v.getFullYear(), v.getMonth() + 1, 1));
  const goToday = () => {
    const now = new Date();
    setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDay(ymd(now));
  };

  const startEdit = (order: Order) => {
    setEditingId(order._id);
    const parsed = parseOrderDate(order.dateNeeded);
    setEditingDate(parsed ? ymd(parsed) : '');
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingDate('');
    setError(null);
  };

  const saveReschedule = async (orderId: string) => {
    if (!editingDate) {
      setError('Pick a date.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ dateNeeded: editingDate }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to reschedule.');
        setSaving(false);
        return;
      }
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, dateNeeded: editingDate } : o)),
      );
      setEditingId(null);
      setSelectedDay(editingDate);
      const d = parseOrderDate(editingDate);
      if (d) setViewDate(new Date(d.getFullYear(), d.getMonth(), 1));
    } catch (e) {
      console.error('Reschedule failed:', e);
      setError('Failed to reschedule.');
    } finally {
      setSaving(false);
    }
  };

  if (sessionLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  const selectedOrders = selectedDay ? ordersByDay.get(selectedDay) ?? [] : [];

  return (
    <div className="min-h-screen bg-gray-100 py-8 sm:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">Order Calendar</h1>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="px-3 py-2 text-sm sm:text-base bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300"
            >
              Back
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-3 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={goPrev}
                className="px-3 py-1.5 text-sm bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200"
                aria-label="Previous month"
              >
                ←
              </button>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 min-w-[9rem] text-center">
                {monthLabel}
              </h2>
              <button
                onClick={goNext}
                className="px-3 py-1.5 text-sm bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200"
                aria-label="Next month"
              >
                →
              </button>
            </div>
            <button
              onClick={goToday}
              className="px-3 py-1.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-700"
            >
              Today
            </button>
          </div>

          <div className="grid grid-cols-7 border-b border-gray-200">
            {DAY_LABELS.map((d) => (
              <div
                key={d}
                className="text-center text-xs sm:text-sm font-semibold text-gray-600 py-2"
              >
                <span className="hidden sm:inline">{d}</span>
                <span className="sm:hidden">{d[0]}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {days.map((d) => {
              const key = ymd(d);
              const inMonth = d.getMonth() === viewDate.getMonth();
              const isToday = key === todayKey;
              const isSelected = key === selectedDay;
              const dayOrders = ordersByDay.get(key) ?? [];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedDay(isSelected ? null : key)}
                  className={`min-h-[60px] sm:min-h-[96px] p-1 sm:p-1.5 text-left bg-white hover:bg-gray-50 transition flex flex-col ${
                    inMonth ? '' : 'bg-gray-50 text-gray-400'
                  } ${isSelected ? 'ring-2 ring-gray-900 ring-inset' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs sm:text-sm font-semibold ${
                        isToday
                          ? 'bg-gray-900 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 inline-flex items-center justify-center'
                          : ''
                      }`}
                    >
                      {d.getDate()}
                    </span>
                    {dayOrders.length > 0 && (
                      <span className="text-[10px] sm:text-xs text-gray-500">
                        {dayOrders.length}
                      </span>
                    )}
                  </div>
                  <div className="space-y-0.5 overflow-hidden">
                    {dayOrders.slice(0, 2).map((o) => (
                      <div
                        key={o._id}
                        className={`hidden sm:block text-[10px] sm:text-xs px-1 py-0.5 rounded border truncate ${
                          STATUS_STYLES[o.status]
                        }`}
                      >
                        {o.orderNumber.replace(/^ORD-/, '')} · {o.name}
                      </div>
                    ))}
                    {dayOrders.length > 0 && (
                      <div className="sm:hidden flex gap-0.5 flex-wrap">
                        {dayOrders.slice(0, 3).map((o) => (
                          <span
                            key={o._id}
                            className={`w-1.5 h-1.5 rounded-full border ${STATUS_STYLES[o.status]}`}
                          />
                        ))}
                      </div>
                    )}
                    {dayOrders.length > 2 && (
                      <div className="hidden sm:block text-[10px] text-gray-500">
                        +{dayOrders.length - 2} more
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-600">
            {(['pending', 'confirmed', 'completed', 'cancelled'] as Order['status'][]).map((s) => (
              <div key={s} className="flex items-center gap-1.5">
                <span className={`inline-block w-3 h-3 rounded border ${STATUS_STYLES[s]}`} />
                <span className="capitalize">{s}</span>
              </div>
            ))}
          </div>
        </div>

        {selectedDay && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                {(() => {
                  const d = parseOrderDate(selectedDay);
                  return d
                    ? d.toLocaleDateString('default', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : selectedDay;
                })()}
              </h2>
              <button
                onClick={() => setSelectedDay(null)}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Close
              </button>
            </div>

            {selectedOrders.length === 0 ? (
              <p className="text-sm text-gray-600">No orders on this day.</p>
            ) : (
              <ul className="space-y-3">
                {selectedOrders.map((o) => (
                  <li
                    key={o._id}
                    className={`border rounded-lg p-3 sm:p-4 ${STATUS_STYLES[o.status]}`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-semibold">{o.orderNumber}</div>
                        <div className="text-sm">{o.name}</div>
                        <div className="text-xs opacity-80">{o.email}</div>
                        <div className="text-sm mt-1">${o.total.toFixed(2)} · {o.paymentStatus}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/orders/${o._id}`}
                          className="px-3 py-1.5 text-xs sm:text-sm bg-white text-gray-900 rounded-lg hover:bg-gray-100 border"
                        >
                          View
                        </Link>
                        {editingId !== o._id && (
                          <button
                            onClick={() => startEdit(o)}
                            className="px-3 py-1.5 text-xs sm:text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-700"
                          >
                            Reschedule
                          </button>
                        )}
                      </div>
                    </div>

                    {editingId === o._id && (
                      <div className="mt-3 flex flex-wrap items-center gap-2 pt-3 border-t border-current/20">
                        <input
                          type="date"
                          value={editingDate}
                          onChange={(e) => setEditingDate(e.target.value)}
                          className="px-3 py-1.5 text-sm border-2 border-gray-200 rounded-lg bg-white text-gray-900 focus:border-gray-400 focus:outline-none"
                        />
                        <button
                          onClick={() => saveReschedule(o._id)}
                          disabled={saving}
                          className="px-3 py-1.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-60"
                        >
                          {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-3 py-1.5 text-sm bg-white text-gray-900 rounded-lg hover:bg-gray-100 border"
                        >
                          Cancel
                        </button>
                        {error && <span className="text-xs text-red-700">{error}</span>}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
