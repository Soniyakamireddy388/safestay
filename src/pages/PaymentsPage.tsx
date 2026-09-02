import React, { useState, useEffect } from 'react';
import { paymentService } from '../services/apiServices';
import { Payment } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { ReceiptModal } from '../components/ReceiptModal';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import {
  CreditCard,
  Download,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Receipt,
  Plus,
  QrCode,
  DollarSign,
  Building,
} from 'lucide-react';

export const PaymentsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState<boolean>(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Credit Card' | 'NetBanking'>('UPI');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const loadPayments = async () => {
    try {
      const data = await paymentService.getPayments();
      setPayments(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const handleOpenReceipt = (payment: Payment) => {
    setSelectedReceipt(payment);
    setIsReceiptOpen(true);
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newPay = await paymentService.createPayment({
        studentId: user?.studentId || 'STU-2024-089',
        studentName: user?.name || 'Rahul Sharma',
        roomNumber: user?.roomNumber || 'A-204',
        amount: 8500,
        feeMonth: 'April 2026',
        paymentMethod,
        dueDate: '05 Apr 2026',
      });

      showToast('Payment Successful', `Transaction Ref: ${newPay.transactionId}`, 'success');
      setIsPayModalOpen(false);
      loadPayments();
      handleOpenReceipt(newPay);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const userPayments =
    user?.role === 'STUDENT'
      ? payments.filter((p) => p.studentId === (user?.studentId || 'STU-2024-089'))
      : payments;

  const totalCollected = payments.reduce((acc, curr) => acc + (curr.status === 'Paid' ? curr.amount : 0), 0);

  return (
    <div className="space-y-8 pb-12 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-['Outfit',sans-serif]">
            Hostel Fee & Payment Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Automated billing, cryptographic receipt vouchers, and transparent ledger history.
          </p>
        </div>

        <button
          onClick={() => setIsPayModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <CreditCard className="w-4 h-4 text-teal-400" />
          <span>Pay Hostel Dues</span>
        </button>
      </div>

      {/* Fee Status Card for Student/Parent (Section 15) */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-teal-400">
            Current Billing Cycle: March 2026
          </span>
          <div className="flex items-baseline gap-3">
            <h2 className="text-3xl sm:text-4xl font-black font-['Outfit',sans-serif]">₹8,500</h2>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              Paid & Cleared
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Assigned to: <strong className="text-white">{user?.name || 'Rahul Sharma'}</strong> • Room {user?.roomNumber || 'A-204'} • Due Date: 05 Mar 2026
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs space-y-1">
            <div className="flex justify-between gap-4 text-slate-300">
              <span>Next Upcoming Due:</span>
              <strong className="text-white">05 Apr 2026</strong>
            </div>
            <div className="flex justify-between gap-4 text-slate-300">
              <span>Late Fee Penalty:</span>
              <strong className="text-emerald-400">₹0 (Zero dues)</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History Table (Section 15) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif]">
              Transaction Ledger & Receipts
            </h3>
            <p className="text-xs text-slate-500">Official university-compliant hostel payment log</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
            {userPayments.length} Transactions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">Transaction ID</th>
                <th className="py-3.5 px-6">Student & Room</th>
                <th className="py-3.5 px-6">Fee Month</th>
                <th className="py-3.5 px-6">Amount</th>
                <th className="py-3.5 px-6">Payment Method</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Receipt Voucher</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {userPayments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-6 font-mono font-bold text-indigo-700">{p.transactionId}</td>
                  <td className="py-3.5 px-6">
                    <div className="font-bold text-slate-900">{p.studentName}</div>
                    <div className="text-[11px] text-slate-400">Room {p.roomNumber}</div>
                  </td>
                  <td className="py-3.5 px-6 font-medium text-slate-800">{p.feeMonth}</td>
                  <td className="py-3.5 px-6 font-bold text-slate-900 font-mono">
                    ₹{p.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-6">{p.paymentMethod}</td>
                  <td className="py-3.5 px-6 text-slate-500">{p.paymentDate}</td>
                  <td className="py-3.5 px-6">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() => handleOpenReceipt(p)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold transition-colors text-xs shadow-2xs"
                    >
                      <Receipt className="w-3.5 h-3.5 text-teal-600" />
                      <span>Download Receipt</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pay Fees Modal */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                SafeStay Instant Payment Gateway
              </span>
              <h3 className="text-xl font-bold font-['Outfit',sans-serif]">Pay Hostel Monthly Fee</h3>
              <p className="text-xs text-slate-400 mt-1">Direct settlement into University Hostel Escrow</p>
            </div>

            <form onSubmit={handleProcessPayment} className="p-6 space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student:</span>
                  <span className="font-bold text-slate-900">{user?.name || 'Rahul Sharma'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Room:</span>
                  <span className="font-semibold text-slate-900">{user?.roomNumber || 'A-204'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Billing Tenure:</span>
                  <span className="font-semibold text-slate-900">April 2026</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-sm">
                  <span className="text-slate-900">Total Payable:</span>
                  <span className="text-teal-700 font-mono">₹8,500</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-2">Select Payment Mode:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['UPI', 'Credit Card', 'NetBanking'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPaymentMethod(mode)}
                      className={`p-2.5 rounded-xl border font-bold text-center transition-all ${
                        paymentMethod === mode
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {paymentMethod === 'UPI' && (
                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-indigo-950 block">UPI ID / VPA:</span>
                    <span className="text-indigo-700 font-mono text-[11px]">safestay.hostel@icici</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl shadow-2xs border border-indigo-200">
                    <QrCode className="w-8 h-8 text-indigo-900" />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md transition-all flex items-center gap-2"
                >
                  {isSubmitting ? 'Verifying Gateway...' : 'Authorize ₹8,500 Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable / Downloadable Receipt Modal (Section 15) */}
      <ReceiptModal
        payment={selectedReceipt}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
      />
    </div>
  );
};
