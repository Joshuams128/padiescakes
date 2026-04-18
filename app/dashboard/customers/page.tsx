'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDashboardToken } from '../useDashboardToken';

interface Customer {
  email: string;
  name: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
}

export default function CustomersPage() {
  const { token, authenticated, loading: sessionLoading } = useDashboardToken();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authenticated || !token) return;
    const run = async () => {
      try {
        const response = await fetch('/api/customers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setCustomers(data.customers || []);
        }
      } catch (error) {
        console.error('Failed to fetch customers:', error);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [authenticated, token]);

  if (sessionLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 flex items-center justify-center">
        <p className="text-gray-600">Loading customers...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 sm:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/dashboard" className="text-gray-900 mb-6 inline-block hover:text-gray-700">
          ← Back to Dashboard
        </Link>

        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">Customers</h1>

        {customers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">No customers yet</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Name</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Email</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Phone</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Total Orders</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Total Spent</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Last Order</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {customers.map((c) => (
                    <tr key={c.email} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-4 text-sm">
                        <Link
                          href={`/dashboard/customers/${encodeURIComponent(c.email)}`}
                          className="text-gray-900 font-semibold hover:text-gray-700"
                        >
                          {c.name}
                        </Link>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-600">{c.email}</td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-600">{c.phone}</td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 font-semibold">{c.totalOrders}</td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 font-semibold">
                        ${c.totalSpent.toFixed(2)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-600">
                        {new Date(c.lastOrderDate).toLocaleDateString()}
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
