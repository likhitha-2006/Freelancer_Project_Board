import React, { useState } from 'react';
import API from '../services/api';
import { X, ShieldCheck, DollarSign, Lock, CheckCircle2 } from 'lucide-react';

export default function EscrowModal({ milestone, action, isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !milestone) return null;

  const isFundAction = action === 'fund';

  const handleConfirm = async () => {
    setLoading(true);
    setError('');

    try {
      if (isFundAction) {
        await API.post(`/milestones/${milestone._id}/fund`);
      } else {
        await API.post(`/milestones/${milestone._id}/release`);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${action} milestone payment`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4 ${
          isFundAction ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
        }`}>
          {isFundAction ? <Lock className="w-7 h-7" /> : <ShieldCheck className="w-7 h-7" />}
        </div>

        <h3 className="text-xl font-bold text-white mb-1">
          {isFundAction ? 'Fund Milestone in Escrow' : 'Release Milestone Payment'}
        </h3>
        <p className="text-sm text-slate-400 mb-6">
          Milestone: <span className="text-slate-200 font-semibold">{milestone.title}</span>
        </p>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl mb-6 text-left space-y-2">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Milestone Amount</span>
            <span className="text-white font-bold text-sm">${milestone.amount?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-400">
            <span>Payment Gateway</span>
            <span className="text-emerald-400 font-semibold">ProBoard Escrow Engine (Simulated)</span>
          </div>
          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            {isFundAction
              ? 'Funds will be securely held in Escrow until you review and approve the submitted deliverables.'
              : 'Funds will be immediately credited to the freelancer’s available balance.'}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-1/2 py-2.5 text-sm font-semibold text-slate-400 hover:bg-slate-800 rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`w-1/2 py-2.5 text-sm font-bold text-white rounded-xl shadow-lg flex items-center justify-center gap-1.5 ${
              isFundAction ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'
            }`}
          >
            {loading ? 'Processing...' : isFundAction ? 'Deposit $ ' + milestone.amount : 'Release $ ' + milestone.amount}
          </button>
        </div>
      </div>
    </div>
  );
}
