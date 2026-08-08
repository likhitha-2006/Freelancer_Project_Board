import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

export default function DisputesPage() {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const { data } = await API.get('/disputes');
        setDisputes(data);
      } catch (err) {
        console.error('Failed to load disputes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDisputes();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <AlertTriangle className="w-7 h-7 text-amber-500" />
          Disputes & <span className="gradient-text">Arbitration Center</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Track raised project disputes and view binding admin resolution decisions.
        </p>
      </div>

      {loading ? (
        <div className="glass-card h-64 rounded-2xl animate-pulse"></div>
      ) : disputes.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-2xl">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No active or past disputes</h3>
          <p className="text-xs text-slate-400">All your project contracts are in good standing.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {disputes.map((d) => (
            <div key={d._id} className="glass-card p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                    d.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}>
                    {d.status}
                  </span>
                  <h3 className="font-bold text-white text-base mt-2">
                    Project: {d.projectId?.title || 'Disputed Project'}
                  </h3>
                </div>
                <span className="text-xs text-slate-500">{new Date(d.createdAt).toLocaleDateString()}</span>
              </div>

              <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
                Reason: "{d.reason}"
              </p>

              {d.resolution?.resolvedAt && (
                <div className="p-4 bg-purple-950/40 border border-purple-800/40 rounded-xl space-y-2 text-xs">
                  <h4 className="font-bold text-purple-300">Admin Resolution Summary</h4>
                  <p className="text-slate-300">{d.resolution.adminNotes}</p>
                  <div className="flex gap-4 text-emerald-400 font-semibold pt-1">
                    <span>Client Refund: {d.resolution.refundClientPercentage}%</span>
                    <span>Freelancer Payment: {d.resolution.payFreelancerPercentage}%</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
