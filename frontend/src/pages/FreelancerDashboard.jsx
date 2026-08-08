import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import VerificationBadge from '../components/VerificationBadge';
import {
  DollarSign,
  Briefcase,
  Send,
  Star,
  CheckCircle2,
  Clock,
  Bookmark,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  XCircle
} from 'lucide-react';

export default function FreelancerDashboard() {
  const { user, refreshProfile } = useContext(AuthContext);

  const [activeProjects, setActiveProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('contracts');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (user?._id) {
        // Refresh the user profile so earnings/stats are always up-to-date from DB
        await refreshProfile();

        // Fetch all projects for this freelancer
        const { data: pData } = await API.get(`/projects?freelancerId=${user._id}`);

        // Split into active (not completed/cancelled) and completed
        setActiveProjects(pData.filter((p) => !['completed', 'cancelled'].includes(p.status)));
        setCompletedProjects(pData.filter((p) => p.status === 'completed'));

        // Fetch my proposals
        const { data: propData } = await API.get('/proposals/my-proposals');
        setProposals(propData);

        // Fetch my reviews
        const { data: rData } = await API.get(`/reviews/user/${user._id}`);
        setReviews(rData);
      }
    } catch (err) {
      console.error('Failed to load freelancer workspace:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Poll every 30 seconds so earnings/contracts update without page refresh
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [user?._id]);

  const handleWithdrawProposal = async (proposalId) => {
    if (window.confirm('Withdraw this proposal?')) {
      try {
        await API.delete(`/proposals/${proposalId}`);
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to withdraw proposal');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'F')}`}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-lg"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white">{user?.name}</h1>
              <VerificationBadge status={user?.verificationStatus} />
            </div>
            <p className="text-xs text-slate-400 mt-1">{user?.title || 'Freelance Specialist'}</p>
          </div>
        </div>

        <Link
          to="/projects"
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2"
        >
          <Briefcase className="w-4 h-4" /> Find New Projects
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Total Earnings</span>
            <span className="text-2xl font-extrabold text-white flex items-center gap-0.5 mt-1">
              <DollarSign className="w-5 h-5 text-emerald-400 -mr-1" />
              {user?.earnings?.toLocaleString() || 0}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Active Contracts</span>
            <span className="text-2xl font-extrabold text-white mt-1 block">{activeProjects.length}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Submitted Proposals</span>
            <span className="text-2xl font-extrabold text-white mt-1 block">{proposals.length}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
            <Send className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Rating score</span>
            <span className="text-2xl font-extrabold text-amber-400 mt-1 flex items-center gap-1">
              ⭐ {user?.rating || '5.0'} <span className="text-xs text-slate-400">({reviews.length})</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <Star className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-800 flex items-center gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('contracts')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'contracts'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Briefcase className="w-4 h-4" /> Active Work ({activeProjects.length})
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'completed'
              ? 'border-teal-500 text-teal-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" /> Completed Projects ({completedProjects.length})
        </button>

        <button
          onClick={() => setActiveTab('proposals')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'proposals'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Send className="w-4 h-4" /> My Proposals ({proposals.length})
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'reviews'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Star className="w-4 h-4" /> Client Reviews ({reviews.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'contracts' && (
        <div className="space-y-4">
          {activeProjects.length === 0 ? (
            <div className="glass-card p-12 text-center rounded-2xl">
              <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">No active contracts yet</h3>
              <p className="text-xs text-slate-400 mb-4">Submit proposals to get hired on client projects.</p>
              <Link to="/projects" className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl">
                Browse Projects
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeProjects.map((p) => (
                <div key={p._id} className="glass-card p-6 rounded-2xl space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-800">
                      {p.status.toUpperCase()}
                    </span>
                    <span className="text-sm font-extrabold text-white">${p.budget}</span>
                  </div>
                  <Link to={`/projects/${p._id}`}>
                    <h3 className="font-bold text-white hover:text-blue-400 text-base">{p.title}</h3>
                  </Link>
                  <p className="text-xs text-slate-400 line-clamp-2">{p.description}</p>
                  <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-400">Client: {p.clientId?.name}</span>
                    <Link to={`/projects/${p._id}`} className="text-blue-400 font-semibold hover:underline">
                      View Contract Roadmap →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Completed Projects Tab */}
      {activeTab === 'completed' && (
        <div className="space-y-4">
          {completedProjects.length === 0 ? (
            <div className="glass-card p-12 text-center rounded-2xl">
              <CheckCircle2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">No completed projects yet</h3>
              <p className="text-xs text-slate-400">Completed contracts will appear here once all milestones are released.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedProjects.map((p) => (
                <div key={p._id} className="glass-card p-6 rounded-2xl space-y-4 border border-teal-800/40">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-teal-400 bg-teal-950 px-2.5 py-1 rounded-lg border border-teal-800">
                      ✓ COMPLETED
                    </span>
                    <span className="text-sm font-extrabold text-white">${p.budget}</span>
                  </div>
                  <Link to={`/projects/${p._id}`}>
                    <h3 className="font-bold text-white hover:text-blue-400 text-base">{p.title}</h3>
                  </Link>
                  <p className="text-xs text-slate-400 line-clamp-2">{p.description}</p>
                  <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-400">Client: {p.clientId?.name}</span>
                    {p.completedAt && (
                      <span className="text-teal-400 font-semibold">
                        Completed {new Date(p.completedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'proposals' && (
        <div className="space-y-4">
          {proposals.length === 0 ? (
            <div className="glass-card p-12 text-center rounded-2xl">
              <Send className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">No submitted proposals</h3>
              <p className="text-xs text-slate-400">You haven't submitted any job proposals yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {proposals.map((prop) => (
                <div key={prop._id} className="glass-card p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Link to={`/projects/${prop.projectId?._id}`} className="font-bold text-white hover:text-blue-400 text-base">
                        {prop.projectId?.title || 'Project'}
                      </Link>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                        prop.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                        prop.status === 'rejected' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                        prop.status === 'withdrawn' ? 'bg-slate-800 text-slate-500' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {prop.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">"{prop.coverLetter}"</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-emerald-400 block">${prop.bidAmount}</span>
                      <span className="text-[11px] text-slate-500">{prop.estimatedDays} days delivery</span>
                    </div>

                    {prop.status === 'pending' && (
                      <button
                        onClick={() => handleWithdrawProposal(prop._id)}
                        className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs rounded-xl border border-rose-500/30 flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Withdraw
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="glass-card p-12 text-center rounded-2xl">
              <Star className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">No reviews yet</h3>
              <p className="text-xs text-slate-400">Complete project contracts to receive client reviews.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((r) => (
                <div key={r._id} className="glass-card p-6 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-400 text-sm font-bold">
                      {'⭐'.repeat(r.rating)} ({r.rating}.0)
                    </span>
                    <span className="text-xs text-slate-500">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-slate-300 italic">"{r.comment}"</p>
                  <div className="pt-2 border-t border-slate-800 text-xs text-slate-400">
                    By Client: <span className="text-white font-semibold">{r.reviewerId?.name}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
