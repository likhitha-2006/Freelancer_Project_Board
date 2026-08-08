import React, { useState, useEffect } from 'react';
import API from '../services/api';
import VerificationBadge from '../components/VerificationBadge';
import {
  ShieldCheck,
  Users,
  Briefcase,
  AlertTriangle,
  Lock,
  CheckCircle2,
  XCircle,
  FileText,
  DollarSign,
  Search
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('verifications');

  // Dispute arbitration modal state
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [refundClientPct, setRefundClientPct] = useState(50);
  const [payFreelancerPct, setPayFreelancerPct] = useState(50);
  const [adminNotes, setAdminNotes] = useState('');
  const [resolving, setResolving] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const { data: sData } = await API.get('/admin/stats');
      setStats(sData);

      const { data: uData } = await API.get('/admin/users');
      setUsers(uData);

      const { data: dData } = await API.get('/disputes');
      setDisputes(dData);
    } catch (err) {
      console.error('Failed to load admin metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVerifyUser = async (userId, status) => {
    try {
      await API.put(`/admin/users/${userId}/verify`, { status, notes: `Admin marked as ${status}` });
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user verification');
    }
  };

  const handleResolveDispute = async (e) => {
    e.preventDefault();
    if (!selectedDispute) return;

    if (Number(refundClientPct) + Number(payFreelancerPct) !== 100) {
      alert('Percentages must add up to exactly 100%');
      return;
    }

    setResolving(true);
    try {
      await API.put(`/admin/disputes/${selectedDispute._id}/resolve`, {
        refundClientPercentage: Number(refundClientPct),
        payFreelancerPercentage: Number(payFreelancerPct),
        adminNotes
      });

      alert('Dispute resolved successfully!');
      setSelectedDispute(null);
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to resolve dispute');
    } finally {
      setResolving(false);
    }
  };

  const pendingUsers = users.filter((u) => u.verificationStatus === 'pending');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-purple-400" />
            Admin <span className="gradient-text">Command Center</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Platform user management, identity verification queue, and dispute resolution center.
          </p>
        </div>
      </div>

      {/* Admin Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Total Users</span>
          <span className="text-3xl font-extrabold text-white mt-1 block">{stats?.totalUsers || 0}</span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {stats?.freelancersCount} Freelancers | {stats?.clientsCount} Clients
          </span>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Pending Verifications</span>
          <span className="text-3xl font-extrabold text-amber-400 mt-1 block">{stats?.pendingVerifications || 0}</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Requires admin review</span>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Active Disputes</span>
          <span className="text-3xl font-extrabold text-rose-400 mt-1 block">{stats?.openDisputes || 0}</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Needs arbitration</span>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Escrow Total Locked</span>
          <span className="text-3xl font-extrabold text-emerald-400 mt-1 block">${stats?.totalEscrowLocked?.toLocaleString() || 0}</span>
          <span className="text-[11px] text-slate-400 mt-1 block">In active contracts</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-800 flex items-center gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('verifications')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'verifications' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> Identity Queue ({pendingUsers.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'users' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" /> All Users ({users.length})
        </button>

        <button
          onClick={() => setActiveTab('disputes')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'disputes' ? 'border-rose-500 text-rose-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <AlertTriangle className="w-4 h-4" /> Dispute Arbitration Center ({disputes.length})
        </button>
      </div>

      {/* Verifications Queue Tab */}
      {activeTab === 'verifications' && (
        <div className="space-y-4">
          {pendingUsers.length === 0 ? (
            <div className="glass-card p-12 text-center rounded-2xl">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">Identity verification queue is clear!</h3>
              <p className="text-xs text-slate-400">All submitted user identity documents have been processed.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingUsers.map((u) => (
                <div key={u._id} className="glass-card p-6 rounded-2xl space-y-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={u.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}`}
                      alt={u.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                    />
                    <div>
                      <h4 className="font-bold text-white text-sm">{u.name}</h4>
                      <span className="text-xs text-slate-400 block">{u.email} ({u.role})</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                    <span className="text-slate-400 font-semibold block">Submitted Identity Proof Document:</span>
                    {u.verificationDocument ? (
                      <a
                        href={u.verificationDocument}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 font-medium hover:underline flex items-center gap-1.5"
                      >
                        <FileText className="w-4 h-4" /> View Uploaded Document File
                      </a>
                    ) : (
                      <span className="text-slate-500 italic">No document file attached</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => handleVerifyUser(u._id, 'verified')}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve & Verify
                    </button>
                    <button
                      onClick={() => handleVerifyUser(u._id, 'rejected')}
                      className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-1"
                    >
                      <XCircle className="w-4 h-4" /> Reject ID
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Users Directory Tab */}
      {activeTab === 'users' && (
        <div className="glass-card rounded-2xl overflow-x-auto border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 border-b border-slate-800 uppercase tracking-wider text-slate-400 font-bold">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Verification</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-800/40">
                  <td className="p-4 flex items-center gap-3 font-semibold text-white">
                    <img
                      src={u.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}`}
                      alt={u.name}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <div>
                      <div>{u.name}</div>
                      <div className="text-[10px] text-slate-500 font-normal">{u.email}</div>
                    </div>
                  </td>
                  <td className="p-4 capitalize font-semibold">{u.role}</td>
                  <td className="p-4"><VerificationBadge status={u.verificationStatus} /></td>
                  <td className="p-4 font-bold text-amber-400">⭐ {u.rating || 0}</td>
                  <td className="p-4 flex items-center gap-2">
                    {u.verificationStatus !== 'verified' && (
                      <button
                        onClick={() => handleVerifyUser(u._id, 'verified')}
                        className="px-2.5 py-1 bg-emerald-600/20 text-emerald-400 rounded-lg font-bold hover:bg-emerald-600/30"
                      >
                        Verify
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Dispute Resolution Center Tab */}
      {activeTab === 'disputes' && (
        <div className="space-y-4">
          {disputes.length === 0 ? (
            <div className="glass-card p-12 text-center rounded-2xl">
              <AlertTriangle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">No active disputes reported</h3>
            </div>
          ) : (
            <div className="space-y-4">
              {disputes.map((d) => (
                <div key={d._id} className="glass-card p-6 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                        d.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        Status: {d.status}
                      </span>
                      <h4 className="font-bold text-white text-base mt-2">
                        Project: {d.projectId?.title || 'Disputed Project'}
                      </h4>
                    </div>
                    <span className="text-xs text-slate-400">Raised by: {d.raisedBy?.name}</span>
                  </div>

                  <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    Reason: "{d.reason}"
                  </p>

                  {d.status === 'open' && (
                    <button
                      onClick={() => setSelectedDispute(d)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow"
                    >
                      Arbitrate & Resolve Dispute
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Dispute Arbitration Modal */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Dispute Arbitration Resolution</h3>
            <p className="text-xs text-slate-400">
              Split escrow total balance between Client and Freelancer.
            </p>

            <form onSubmit={handleResolveDispute} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Refund Client Percentage (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={refundClientPct}
                  onChange={(e) => {
                    setRefundClientPct(e.target.value);
                    setPayFreelancerPct(100 - Number(e.target.value));
                  }}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Release Freelancer Percentage (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={payFreelancerPct}
                  onChange={(e) => {
                    setPayFreelancerPct(e.target.value);
                    setRefundClientPct(100 - Number(e.target.value));
                  }}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Admin Resolution Summary Notes
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Record binding arbitration decision..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedDispute(null)}
                  className="px-3 py-2 text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resolving}
                  className="px-4 py-2 bg-purple-600 text-white font-bold text-xs rounded-xl shadow"
                >
                  {resolving ? 'Executing...' : 'Confirm Arbitrated Resolution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
