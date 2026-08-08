import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import ProposalModal from '../components/ProposalModal';
import MilestoneModal from '../components/MilestoneModal';
import EscrowModal from '../components/EscrowModal';
import VerificationBadge from '../components/VerificationBadge';
import {
  DollarSign,
  Calendar,
  Clock,
  Tag,
  User,
  CheckCircle2,
  FileText,
  Send,
  Plus,
  Lock,
  MessageSquare,
  AlertTriangle,
  Award,
  Download,
  Trash2,
  Edit
} from 'lucide-react';

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isFreelancer, isClient, isAdmin } = useContext(AuthContext);

  const [project, setProject] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals state
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const [milestoneModalOpen, setMilestoneModalOpen] = useState(false);
  const [escrowModal, setEscrowModal] = useState({ open: false, milestone: null, action: 'fund' });

  // Work Submission State
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [submissionFile, setSubmissionFile] = useState(null);
  const [submittingWorkFor, setSubmittingWorkFor] = useState(null);

  // Dispute Form
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeOpen, setDisputeOpen] = useState(false);

  const fetchProjectDetails = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/projects/${id}`);
      setProject(data);

      // Fetch Milestones
      const mRes = await API.get(`/milestones/project/${id}`);
      setMilestones(mRes.data);

      // If user is client owner or admin, fetch proposals
      if (user && (data.clientId?._id === user._id || isAdmin)) {
        const pRes = await API.get(`/proposals/project/${id}`);
        setProposals(pRes.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id, user]);

  const handleHireFreelancer = async (proposalId) => {
    try {
      await API.put(`/proposals/${proposalId}/status`, { status: 'accepted' });
      fetchProjectDetails();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept proposal');
    }
  };

  const handleSubmitMilestoneWork = async (milestoneId) => {
    try {
      const formData = new FormData();
      formData.append('submissionNotes', submissionNotes);
      if (submissionFile) formData.append('submissionFile', submissionFile);

      await API.put(`/milestones/${milestoneId}/submit`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSubmittingWorkFor(null);
      setSubmissionNotes('');
      setSubmissionFile(null);
      fetchProjectDetails();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit milestone work');
    }
  };

  const handleRaiseDispute = async (e) => {
    e.preventDefault();
    try {
      await API.post('/disputes', {
        projectId: id,
        reason: disputeReason
      });
      setDisputeOpen(false);
      setDisputeReason('');
      fetchProjectDetails();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to raise dispute');
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await API.delete(`/projects/${id}`);
        navigate('/projects');
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete project');
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="glass-card h-96 rounded-2xl animate-pulse bg-slate-800/40"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Project Not Found</h2>
        <p className="text-sm text-slate-400">{error || 'The requested project could not be found.'}</p>
        <Link to="/projects" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold">
          Back to Projects
        </Link>
      </div>
    );
  }

  const isOwner = user && project.clientId?._id === user._id;
  const isHiredFreelancer = user && project.hiredFreelancerId?._id === user._id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-blue-950 text-blue-400 text-xs font-bold rounded-lg border border-blue-800">
                {project.category}
              </span>
              <span className={`px-3 py-1 text-xs font-bold rounded-lg border ${
                project.status === 'open' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                project.status === 'in_progress' ? 'bg-blue-950 text-blue-400 border-blue-800' :
                project.status === 'completed' ? 'bg-purple-950 text-purple-400 border-purple-800' :
                'bg-rose-950 text-rose-400 border-rose-800'
              }`}>
                Status: {project.status.toUpperCase()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {project.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300 pt-2">
              <span className="flex items-center gap-1.5 font-bold text-base text-white">
                <DollarSign className="w-5 h-5 text-emerald-400 -mr-1" />
                {project.budget?.toLocaleString()} USD
                <span className="text-xs font-normal text-slate-400">({project.budgetType})</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <Clock className="w-4 h-4 text-blue-400" />
                Deadline: {new Date(project.deadline).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <Lock className="w-4 h-4 text-amber-400" />
                Escrow Total: ${project.escrowTotal || 0}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            {isFreelancer && project.status === 'open' && (
              <button
                onClick={() => setProposalModalOpen(true)}
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Submit Proposal
              </button>
            )}

            {isOwner && (
              <div className="flex items-center gap-2">
                <Link
                  to={`/edit-project/${project._id}`}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5"
                >
                  <Edit className="w-4 h-4 text-blue-400" /> Edit
                </Link>
                <button
                  onClick={handleDeleteProject}
                  className="px-4 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold text-xs rounded-xl border border-rose-500/30 flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            )}

            {(isOwner || isHiredFreelancer) && project.status === 'in_progress' && (
              <button
                onClick={() => setDisputeOpen(true)}
                className="px-4 py-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-semibold text-xs rounded-xl border border-amber-500/30 flex items-center gap-1.5"
              >
                <AlertTriangle className="w-4 h-4" /> Raise Dispute
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (2 Columns) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description Card */}
          <div className="glass-card p-6 sm:p-8 rounded-2xl space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
              Project Description
            </h3>
            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line font-light">
              {project.description}
            </div>

            {/* Required Skills Tags */}
            <div className="pt-4 border-t border-slate-800">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-2">
                Required Skills
              </span>
              <div className="flex flex-wrap gap-2">
                {project.requiredSkills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-slate-800 text-blue-300 text-xs font-semibold border border-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Attachments */}
            {project.attachments?.length > 0 && (
              <div className="pt-4 border-t border-slate-800">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-2">
                  Project Files & Documentation
                </span>
                <div className="space-y-2">
                  {project.attachments.map((file, idx) => (
                    <a
                      key={idx}
                      href={file.path}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl hover:border-blue-500 text-xs text-blue-400 font-medium"
                    >
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4" /> {file.filename}
                      </span>
                      <Download className="w-4 h-4 text-slate-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Milestones & Escrow Breakdown */}
          <div className="glass-card p-6 sm:p-8 rounded-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Milestone Payment Roadmap</h3>
                <p className="text-xs text-slate-400">Escrow protected work breakdown & payments</p>
              </div>

              {(isOwner || isHiredFreelancer) && (
                <button
                  onClick={() => setMilestoneModalOpen(true)}
                  className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 font-bold text-xs rounded-xl border border-blue-500/30 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Milestone
                </button>
              )}
            </div>

            {milestones.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No milestones defined for this project yet.</p>
            ) : (
              <div className="space-y-4">
                {milestones.map((m, idx) => (
                  <div key={m._id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-white text-sm flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-slate-800 text-blue-400 text-xs flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          {m.title}
                        </h4>
                        {m.description && <p className="text-xs text-slate-400 mt-1 pl-8">{m.description}</p>}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-extrabold text-white">${m.amount}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                          m.status === 'funded' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                          m.status === 'submitted' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                          m.status === 'released' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {m.status}
                        </span>
                      </div>
                    </div>

                    {/* Controls based on status and role */}
                    <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-slate-400 border-t border-slate-800/80">
                      <span>Due: {new Date(m.dueDate).toLocaleDateString()}</span>

                      <div className="flex items-center gap-2">
                        {/* Client Fund Button */}
                        {isOwner && m.status === 'pending' && (
                          <button
                            onClick={() => setEscrowModal({ open: true, milestone: m, action: 'fund' })}
                            className="px-3 py-1 bg-amber-600 text-white font-bold text-xs rounded-lg shadow"
                          >
                            Fund in Escrow (${m.amount})
                          </button>
                        )}

                        {/* Freelancer Submit Work Button */}
                        {isHiredFreelancer && (m.status === 'funded' || m.status === 'pending') && (
                          <button
                            onClick={() => setSubmittingWorkFor(submittingWorkFor === m._id ? null : m._id)}
                            className="px-3 py-1 bg-blue-600 text-white font-bold text-xs rounded-lg"
                          >
                            Submit Milestone Work
                          </button>
                        )}

                        {/* Client Release Payment Button */}
                        {isOwner && (m.status === 'funded' || m.status === 'submitted') && (
                          <button
                            onClick={() => setEscrowModal({ open: true, milestone: m, action: 'release' })}
                            className="px-3 py-1 bg-emerald-600 text-white font-bold text-xs rounded-lg shadow"
                          >
                            Release ${m.amount} Payment
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Freelancer Work Submission Drawer */}
                    {submittingWorkFor === m._id && (
                      <div className="p-4 bg-slate-950 border border-blue-900/50 rounded-xl space-y-3 mt-3 animate-in fade-in">
                        <h5 className="text-xs font-bold text-blue-400">Submit Work for Review</h5>
                        <textarea
                          rows={2}
                          value={submissionNotes}
                          onChange={(e) => setSubmissionNotes(e.target.value)}
                          placeholder="Add submission notes or instructions for client..."
                          className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs"
                        />
                        <div className="flex items-center justify-between">
                          <input
                            type="file"
                            onChange={(e) => setSubmissionFile(e.target.files[0])}
                            className="text-xs text-slate-400"
                          />
                          <button
                            onClick={() => handleSubmitMilestoneWork(m._id)}
                            className="px-4 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-lg"
                          >
                            Confirm Submission
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Proposals List (Visible to Client Owner & Admin) */}
          {(isOwner || isAdmin) && (
            <div className="glass-card p-6 sm:p-8 rounded-2xl space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
                Received Proposals ({proposals.length})
              </h3>

              {proposals.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No proposals submitted for this project yet.</p>
              ) : (
                <div className="space-y-4">
                  {proposals.map((prop) => (
                    <div key={prop._id} className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={prop.freelancerId?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(prop.freelancerId?.name || 'F')}`}
                            alt="Freelancer"
                            className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                          />
                          <div>
                            <Link to={`/profile/${prop.freelancerId?._id}`} className="font-bold text-white text-sm hover:text-blue-400">
                              {prop.freelancerId?.name}
                            </Link>
                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                              <span>⭐ {prop.freelancerId?.rating || 'New'}</span>
                              <span>•</span>
                              <VerificationBadge status={prop.freelancerId?.verificationStatus} />
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-base font-extrabold text-emerald-400 block">${prop.bidAmount}</span>
                          <span className="text-xs text-slate-400">in {prop.estimatedDays} days</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed font-light bg-slate-950 p-3 rounded-lg border border-slate-850">
                        "{prop.coverLetter}"
                      </p>

                      <div className="flex items-center justify-between pt-2">
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full capitalize ${
                          prop.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400' :
                          prop.status === 'rejected' ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-800 text-slate-400'
                        }`}>
                          Proposal Status: {prop.status}
                        </span>

                        {prop.status === 'pending' && project.status === 'open' && (
                          <button
                            onClick={() => handleHireFreelancer(prop._id)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow"
                          >
                            Accept & Hire Freelancer
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Info (1 Column) */}
        <div className="space-y-6">
          {/* Client Details Card */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-800 pb-2">
              About the Client
            </h4>
            <div className="flex items-center gap-3">
              <img
                src={project.clientId?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(project.clientId?.name || 'C')}`}
                alt="Client"
                className="w-12 h-12 rounded-xl object-cover border border-slate-700"
              />
              <div>
                <h5 className="font-bold text-white text-sm">{project.clientId?.name}</h5>
                <span className="text-xs text-slate-400 block">{project.clientId?.companyName || 'Individual Client'}</span>
                <div className="mt-1">
                  <VerificationBadge status={project.clientId?.verificationStatus} />
                </div>
              </div>
            </div>

            {user && user._id !== project.clientId?._id && (
              <Link
                to={`/chat?user=${project.clientId?._id}&project=${project._id}`}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-bold rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4" /> Message Client
              </Link>
            )}
          </div>

          {/* Hired Freelancer Card (If any) */}
          {project.hiredFreelancerId && (
            <div className="glass-card p-6 rounded-2xl space-y-4 border border-emerald-500/30">
              <h4 className="text-xs uppercase tracking-wider text-emerald-400 font-bold border-b border-slate-800 pb-2 flex items-center gap-1.5">
                <Award className="w-4 h-4" /> Hired Freelancer
              </h4>
              <div className="flex items-center gap-3">
                <img
                  src={project.hiredFreelancerId?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(project.hiredFreelancerId?.name || 'F')}`}
                  alt="Hired Freelancer"
                  className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                />
                <div>
                  <h5 className="font-bold text-white text-sm">{project.hiredFreelancerId?.name}</h5>
                  <span className="text-xs text-slate-400 block">{project.hiredFreelancerId?.title || 'Freelance Specialist'}</span>
                </div>
              </div>
              {user && user._id !== project.hiredFreelancerId?._id && (
                <Link
                  to={`/chat?user=${project.hiredFreelancerId?._id}&project=${project._id}`}
                  className="w-full py-2.5 px-4 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-bold rounded-xl border border-emerald-500/30 flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" /> Chat with Freelancer
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ProposalModal
        project={project}
        isOpen={proposalModalOpen}
        onClose={() => setProposalModalOpen(false)}
        onSuccess={fetchProjectDetails}
      />

      <MilestoneModal
        projectId={id}
        isOpen={milestoneModalOpen}
        onClose={() => setMilestoneModalOpen(false)}
        onSuccess={fetchProjectDetails}
      />

      <EscrowModal
        milestone={escrowModal.milestone}
        action={escrowModal.action}
        isOpen={escrowModal.open}
        onClose={() => setEscrowModal({ open: false, milestone: null, action: 'fund' })}
        onSuccess={fetchProjectDetails}
      />

      {/* Dispute Modal */}
      {disputeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Raise Project Dispute</h3>
            <p className="text-xs text-slate-400">
              Submit a formal request for Admin arbitration. Project state will be flagged as disputed.
            </p>
            <form onSubmit={handleRaiseDispute} className="space-y-3">
              <textarea
                rows={4}
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                placeholder="Explain the conflict, unfulfilled milestone contracts, or quality issues..."
                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDisputeOpen(false)}
                  className="px-3 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white text-xs font-bold rounded-xl"
                >
                  Submit Dispute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
