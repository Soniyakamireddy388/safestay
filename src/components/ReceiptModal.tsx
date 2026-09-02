import React from 'react';
import { Payment } from '../types';
import { SafeStayLogo } from './SafeStayLogo';
import { Printer, Download, CheckCircle, ShieldCheck, X } from 'lucide-react';

interface ReceiptModalProps {
  payment: Payment | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ payment, isOpen, onClose }) => {
  if (!isOpen || !payment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SafeStayLogo size="sm" className="brightness-125" />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Voucher Printable Canvas */}
        <div className="p-8 print:p-0" id="printable-receipt">
          <div className="border-b border-dashed border-slate-200 pb-6 mb-6 text-center">
            <span className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1 mb-2">
              <CheckCircle className="w-3.5 h-3.5" />
              Official Payment Voucher
            </span>
            <h3 className="text-xl font-bold text-slate-900 font-['Outfit',sans-serif]">
              SafeStay Hostel Dues Receipt
            </h3>
            <p className="text-xs font-mono text-slate-500 mt-1">Transaction Ref: {payment.transactionId}</p>
          </div>

          <div className="space-y-3.5 text-xs text-slate-700">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Student Name:</span>
              <span className="font-bold text-slate-900">{payment.studentName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Hostel Room Number:</span>
              <span className="font-semibold text-slate-900">{payment.roomNumber}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Billing Tenure:</span>
              <span className="font-semibold text-slate-900">{payment.feeMonth}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Payment Date:</span>
              <span className="font-semibold text-slate-900">{payment.paymentDate}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Payment Method:</span>
              <span className="font-semibold text-slate-900">{payment.paymentMethod}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Due Date:</span>
              <span className="font-semibold text-slate-900">{payment.dueDate}</span>
            </div>
            <div className="flex justify-between py-2 bg-slate-50 px-3 rounded-xl border border-slate-200/80 items-center">
              <span className="font-bold text-slate-800 text-sm">Total Fee Paid:</span>
              <span className="text-lg font-black text-slate-900 font-mono">
                ₹{payment.amount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Stamp & Security Verification */}
          <div className="mt-8 pt-4 border-t border-dashed border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Cryptographic Token • SafeStay Central Accounts</span>
            </div>
            <div className="border border-emerald-400/80 text-emerald-700 font-black text-[10px] uppercase tracking-widest px-2.5 py-1 rounded rotate-[-4deg] bg-emerald-50/70">
              Authorized Paid
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-200/60 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save Voucher
          </button>
        </div>
      </div>
    </div>
  );
};
