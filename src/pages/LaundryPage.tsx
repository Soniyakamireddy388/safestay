import React, { useState, useEffect } from 'react';
import { laundryService } from '../services/apiServices';
import { LaundryOrder } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { Shirt, Plus, Clock, CheckCircle2, PackageCheck, AlertCircle, X } from 'lucide-react';

export const LaundryPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [orders, setOrders] = useState<LaundryOrder[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [itemCount, setItemCount] = useState<number>(8);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const loadOrders = async () => {
    try {
      const data = await laundryService.getOrders();
      setOrders(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newOrder = await laundryService.createOrder({
        studentId: user?.studentId || 'STU-2024-089',
        studentName: user?.name || 'Rahul Sharma',
        itemCount,
      });

      showToast('Laundry Batch Registered', `Token #${newOrder.tokenNumber} created.`, 'success');
      setIsModalOpen(false);
      loadOrders();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = ['Submitted', 'Washing', 'Ready', 'Collected'];

  const getStepProgress = (status: string) => {
    switch (status) {
      case 'Submitted':
        return 'w-1/4 bg-amber-500';
      case 'Washing':
        return 'w-2/4 bg-indigo-600';
      case 'Ready':
        return 'w-3/4 bg-teal-500';
      case 'Collected':
        return 'w-full bg-emerald-600';
      default:
        return 'w-1/4 bg-slate-300';
    }
  };

  return (
    <div className="space-y-6 pb-12 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-['Outfit',sans-serif]">
            Hostel Laundry Service
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Automated garment tracking: Submitted → Washing → Ready for Pickup → Collected.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-teal-400" />
          <span>New Laundry Drop-Off</span>
        </button>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-extrabold text-slate-900">{order.tokenNumber}</span>
              <StatusBadge status={order.status} />
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Resident:</span>
                <span className="font-bold text-slate-900">{order.studentName}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Garment Quantity:</span>
                <span className="font-semibold text-slate-900">{order.itemCount} items</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Drop-off Date:</span>
                <span className="text-slate-700">{order.submittedAt}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Est. Pickup:</span>
                <span className="font-bold text-teal-700">{order.estimatedReady}</span>
              </div>
            </div>

            {/* Pipeline Step Progress */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1.5">
                <span>Submitted</span>
                <span>Washing</span>
                <span>Ready</span>
                <span>Collected</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-500 rounded-full ${getStepProgress(order.status)}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Laundry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
              <h3 className="text-lg font-bold font-['Outfit',sans-serif]">Register Laundry Bag</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Student Name:</label>
                <input
                  type="text"
                  disabled
                  value={user?.name || 'Rahul Sharma'}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 font-semibold text-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Number of Garments / Clothes:</label>
                <input
                  type="number"
                  min="1"
                  max="25"
                  required
                  value={itemCount}
                  onChange={(e) => setItemCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-sm"
                />
              </div>

              <div className="p-3 rounded-xl bg-indigo-50 text-indigo-950 text-[11px] leading-relaxed">
                Cleaned and ironed garments will be ready for pickup at Hostel Laundry Desk within 48 hours.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-md transition-all"
                >
                  {isSubmitting ? 'Generating Token...' : 'Generate Laundry Token'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
