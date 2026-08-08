import React, { useState } from 'react';
import API from '../services/api';
import { X, Send, DollarSign, Clock, FileText, Upload } from 'lucide-react';

export default function ProposalModal({ project, isOpen, onClose, onSuccess }) {
  const [coverLetter, setCoverLetter] = useState('');
  const [bidAmount, setBidAmount] = useState(project?.budget || '');
  const [estimatedDays, setEstimatedDays] = useState('7');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !project) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!coverLetter || !bidAmount || !estimatedDays) {
      setError('Please fill in all proposal fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('projectId', project._id);
      formData.append('coverLetter', coverLetter);
      formData.append('bidAmount', bidAmount);
      formData.append('estimatedDays', estimatedDays);

      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          formData.append('attachments', files[i]);
        }
      }

      await API.post('/proposals', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit proposal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-white mb-1">Submit Proposal</h3>
        <p className="text-sm text-slate-400 mb-6 truncate">
          For project: <span className="text-blue-400 font-medium">{project.title}</span>
        </p>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Your Bid Amount ($USD)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 text-sm font-semibold"
                  placeholder="e.g. 1500"
                  required
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Project Budget: ${project.budget}</span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Estimated Delivery (Days)
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="number"
                  value={estimatedDays}
                  onChange={(e) => setEstimatedDays(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 text-sm font-semibold"
                  placeholder="e.g. 7"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Cover Letter / Pitch
            </label>
            <textarea
              rows={5}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 text-sm"
              placeholder="Describe your relevant experience, proposed technical stack, and how you will execute this project..."
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Attach Portfolio/Sample Files (Optional)
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition-colors">
                <Upload className="w-4 h-4 text-blue-400" />
                Choose Files
                <input
                  type="file"
                  multiple
                  onChange={(e) => setFiles(Array.from(e.target.files))}
                  className="hidden"
                />
              </label>
              <span className="text-xs text-slate-400">
                {files.length > 0 ? `${files.length} file(s) selected` : 'No file selected'}
              </span>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-sm font-bold text-white gradient-btn rounded-xl flex items-center gap-2 shadow-lg disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Submitting...' : 'Send Proposal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
