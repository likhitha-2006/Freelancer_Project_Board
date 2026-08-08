import React, { useState, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import VerificationBadge from '../components/VerificationBadge';
import { ShieldCheck, Upload, FileText, CheckCircle2, Clock } from 'lucide-react';

export default function IdentityVerification() {
  const { user, refreshProfile } = useContext(AuthContext);

  const [documentFile, setDocumentFile] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!documentFile) {
      setError('Please select an identity document file');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('verificationDocument', documentFile);
      formData.append('notes', notes);

      await API.post('/users/verify-identity', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccess('Identity document uploaded successfully! Admin verification pending.');
      await refreshProfile();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit verification document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="glass-panel p-8 sm:p-10 rounded-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              Identity <span className="gradient-text">Verification</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Verify your identity to earn a trusted Verified Badge on your profile.
            </p>
          </div>
          <VerificationBadge status={user?.verificationStatus} />
        </div>

        {user?.verificationStatus === 'verified' ? (
          <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Identity Verified!</h3>
            <p className="text-xs text-slate-300">Your account is fully verified and trusted across ProBoard marketplace.</p>
          </div>
        ) : user?.verificationStatus === 'pending' ? (
          <div className="p-6 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center space-y-2">
            <Clock className="w-10 h-10 text-amber-400 mx-auto animate-pulse" />
            <h3 className="text-lg font-bold text-white">Verification Pending Review</h3>
            <p className="text-xs text-slate-300">
              Your identity document has been submitted and is currently being audited by platform admins.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl">{error}</div>}
            {success && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl">{success}</div>}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Upload Official ID Document (Passport / National ID / Driver's License)
              </label>
              <div className="border-2 border-dashed border-slate-700 hover:border-blue-500 p-8 rounded-2xl text-center cursor-pointer transition-colors bg-slate-950">
                <input
                  type="file"
                  onChange={(e) => setDocumentFile(e.target.files[0])}
                  className="hidden"
                  id="id-upload"
                  accept="image/*,.pdf"
                />
                <label htmlFor="id-upload" className="cursor-pointer space-y-2">
                  <Upload className="w-10 h-10 text-blue-400 mx-auto" />
                  <span className="block text-xs font-semibold text-white">
                    {documentFile ? documentFile.name : 'Click to select ID image or PDF file'}
                  </span>
                  <span className="block text-[10px] text-slate-500">Supported formats: JPG, PNG, PDF (Max 10MB)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Additional Verification Notes (Optional)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Mention document type or issuance details..."
                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              {loading ? 'Submitting Verification...' : 'Submit Document for Verification'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
