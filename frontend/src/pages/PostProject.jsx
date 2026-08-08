import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { PlusCircle, DollarSign, Calendar, Tag, Upload, ArrowRight } from 'lucide-react';

export default function PostProject() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [budget, setBudget] = useState('');
  const [budgetType, setBudgetType] = useState('fixed');
  const [deadline, setDeadline] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Web Development',
    'Mobile Development',
    'UI/UX Design',
    'Data Science & AI',
    'Writing & Translation',
    'Digital Marketing',
    'Graphics & Design',
    'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !budget || !deadline) {
      setError('Please fill in all required project fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('requiredSkills', requiredSkills);
      formData.append('budget', budget);
      formData.append('budgetType', budgetType);
      formData.append('deadline', deadline);

      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          formData.append('attachments', files[i]);
        }
      }

      const { data } = await API.post('/projects', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      navigate(`/projects/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="glass-panel p-8 sm:p-10 rounded-2xl space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <PlusCircle className="w-7 h-7 text-blue-500" />
            Post a New <span className="gradient-text">Project</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Specify job requirements, budget range, and deadline to start receiving proposals.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Project Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 text-sm font-semibold"
              placeholder="e.g. Build a Full-Stack React & Node SaaS Analytics Dashboard"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Required Skills (Comma-separated) *
              </label>
              <input
                type="text"
                value={requiredSkills}
                onChange={(e) => setRequiredSkills(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none"
                placeholder="e.g. React, Node.js, MongoDB, Tailwind CSS"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Budget Type
              </label>
              <select
                value={budgetType}
                onChange={(e) => setBudgetType(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
              >
                <option value="fixed">Fixed Price</option>
                <option value="hourly">Hourly Rate</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Budget ($USD) *
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm font-semibold focus:outline-none"
                  placeholder="e.g. 2500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Project Deadline *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Detailed Project Specification *
            </label>
            <textarea
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm leading-relaxed focus:outline-none focus:border-blue-500"
              placeholder="Outline project scope, deliverables, technical stack requirements, and expectations..."
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Project Attachments (Wireframes, Specifications, PDFs)
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition-colors">
                <Upload className="w-4 h-4 text-blue-400" />
                Upload Documents
                <input
                  type="file"
                  multiple
                  onChange={(e) => setFiles(Array.from(e.target.files))}
                  className="hidden"
                />
              </label>
              <span className="text-xs text-slate-400">
                {files.length > 0 ? `${files.length} file(s) attached` : 'No file selected'}
              </span>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="px-5 py-3 text-sm font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 text-sm font-bold text-white gradient-btn rounded-xl shadow-lg flex items-center gap-2"
            >
              {loading ? 'Publishing...' : 'Publish Project Listing'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
