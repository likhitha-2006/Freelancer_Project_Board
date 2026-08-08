import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Edit, DollarSign, Calendar, ArrowRight } from 'lucide-react';

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [budget, setBudget] = useState('');
  const [budgetType, setBudgetType] = useState('fixed');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('open');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
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

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await API.get(`/projects/${id}`);
        setTitle(data.title);
        setDescription(data.description);
        setCategory(data.category);
        setRequiredSkills(data.requiredSkills?.join(', ') || '');
        setBudget(data.budget);
        setBudgetType(data.budgetType || 'fixed');
        setDeadline(data.deadline ? data.deadline.substring(0, 10) : '');
        setStatus(data.status);
      } catch (err) {
        setError('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');

    try {
      await API.put(`/projects/${id}`, {
        title,
        description,
        category,
        requiredSkills,
        budget: Number(budget),
        budgetType,
        deadline,
        status
      });

      navigate(`/projects/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update project');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="max-w-4xl mx-auto p-12 text-white">Loading project...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="glass-panel p-8 sm:p-10 rounded-2xl space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Edit className="w-7 h-7 text-blue-500" />
            Edit Project Details
          </h1>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Project Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm font-semibold capitalize"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Budget ($USD)
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm font-semibold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Description
            </label>
            <textarea
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => navigate(`/projects/${id}`)}
              className="px-4 py-2 text-slate-400 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow"
            >
              {updating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
