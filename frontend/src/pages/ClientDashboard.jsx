import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import VerificationBadge from '../components/VerificationBadge';
import {
  PlusCircle,
  Briefcase,
  Lock,
  DollarSign,
  Users,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Star,
  ExternalLink
} from 'lucide-react';

export default function ClientDashboard() {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review Modal State
  const [reviewModal, setReviewModal] = useState({ open: false, project: null });
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchClientProjects = async () => {
    setLoading(true);
    try {
      if (user?._id) {
        const { data } = await API.get(`/projects?clientId=${user._id}`);
        setProjects(data);
      }
    } catch (err) {
      console.error('Error fetching client dashboard projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientProjects();
  }, [user]);

  const handleLeaveReview = async (e) => {
    e.preventDefault();
    if (!reviewModal.project || !comment) return;

    setSubmittingReview(true);
    try {
      await API.post('/reviews', {
        reviewedUserId: reviewModal.project.hiredFreelancerId?._id,
        projectId: reviewModal.project._id,
        rating: Number(rating),
        comment
      });
      alert('Review submitted successfully!');
      setReviewModal({ open: false, project: null });
      setComment('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const totalSpent = user?.spent || 0;
  const escrowBalance = user?.escrowBalance || 0;
  const activeContracts = projects.filter((p) => p.status === 'in_progress').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Client Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'C')}`}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-500/40 shadow-lg"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white">{user?.name}</h1>
              <VerificationBadge status={user?.verificationStatus} />
            </div>
            <p className="text-xs text-slate-400 mt-1">{user?.companyName || 'Client Employer'}</p>
          </div>
        </div>

        <Link
          to="/post-project"
          className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/20 flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" /> Post New Project
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Total Invested</span>
            <span className="text-2xl font-extrabold text-white flex items-center gap-0.5 mt-1">
              <DollarSign className="w-5 h-5 text-emerald-400 -mr-1" />
              {totalSpent.toLocaleString()}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Escrow Funds Locked</span>
            <span className="text-2xl font-extrabold text-amber-400 mt-1 flex items-center gap-0.5">
              <Lock className="w-4 h-4" /> ${escrowBalance.toLocaleString()}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Active Projects</span>
            <span className="text-2xl font-extrabold text-white mt-1 block">{activeContracts}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Posted Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Your Managed Projects ({projects.length})</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((n) => (
              <div key={n} className="glass-card h-56 rounded-2xl animate-pulse bg-slate-800/40"></div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-2xl">
            <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No projects posted yet</h3>
            <p className="text-xs text-slate-400 mb-4">Post a job project to start receiving proposal bids.</p>
            <Link to="/post-project" className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl">
              Post Project Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p) => (
              <div key={p._id} className="glass-card p-6 rounded-2xl space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                      p.status === 'open' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                      p.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                      p.status === 'completed' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30' :
                      'bg-rose-500/10 text-rose-400'
                    }`}>
                      {p.status}
                    </span>
                    <span className="text-base font-extrabold text-white">${p.budget}</span>
                  </div>

                  <Link to={`/projects/${p._id}`}>
                    <h3 className="font-bold text-white text-lg hover:text-blue-400 transition-colors line-clamp-1">
                      {p.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 font-light">{p.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Deadline: {new Date(p.deadline).toLocaleDateString()}</span>
                    <span>Escrow Locked: ${p.escrowTotal || 0}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <Link
                      to={`/projects/${p._id}`}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1"
                    >
                      Inspect & Hire <ExternalLink className="w-3 h-3" />
                    </Link>

                    {p.status === 'completed' && p.hiredFreelancerId && (
                      <button
                        onClick={() => setReviewModal({ open: true, project: p })}
                        className="px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold text-xs rounded-xl border border-amber-500/30 flex items-center gap-1"
                      >
                        <Star className="w-3.5 h-3.5" /> Rate Freelancer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Freelancer Modal */}
      {reviewModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Rate Freelancer Performance</h3>
            <p className="text-xs text-slate-400">
              Project: <span className="text-blue-400 font-semibold">{reviewModal.project?.title}</span>
            </p>

            <form onSubmit={handleLeaveReview} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Rating Star (1 to 5)
                </label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-amber-400 font-bold text-sm"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 - Exceptional Work)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 - Great Job)</option>
                  <option value={3}>⭐⭐⭐ (3 - Average)</option>
                  <option value={2}>⭐⭐ (2 - Below Expectations)</option>
                  <option value={1}>⭐ (1 - Poor)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Feedback Review Comment
                </label>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Describe your feedback regarding code quality, communication, and speed..."
                  className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModal({ open: false, project: null })}
                  className="px-3 py-2 text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-5 py-2 bg-amber-600 text-white font-bold text-xs rounded-xl shadow"
                >
                  {submittingReview ? 'Submitting...' : 'Post Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
