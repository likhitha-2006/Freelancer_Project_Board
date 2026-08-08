import React, { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import ProjectCard from '../components/ProjectCard';
import { AuthContext } from '../context/AuthContext';
import { Search, Filter, RefreshCw, X, SlidersHorizontal } from 'lucide-react';

export default function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [skill, setSkill] = useState('');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [status, setStatus] = useState('open');
  const [savedProjects, setSavedProjects] = useState([]);

  const { user } = useContext(AuthContext);

  const categories = [
    'All',
    'Web Development',
    'Mobile Development',
    'UI/UX Design',
    'Data Science & AI',
    'Writing & Translation',
    'Digital Marketing',
    'Graphics & Design',
    'Other'
  ];

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category && category !== 'All') params.append('category', category);
      if (skill) params.append('skill', skill);
      if (minBudget) params.append('minBudget', minBudget);
      if (maxBudget) params.append('maxBudget', maxBudget);
      if (status && status !== 'All') params.append('status', status);

      const { data } = await API.get(`/projects?${params.toString()}`);
      setProjects(data);

      if (user) {
        const profileRes = await API.get('/users/profile');
        setSavedProjects(profileRes.data.savedProjects?.map((p) => p._id || p) || []);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [category, status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  const handleToggleSave = async (projectId) => {
    if (!user) return;
    try {
      const { data } = await API.post(`/users/save-project/${projectId}`);
      setSavedProjects(data.savedProjects || []);
    } catch (err) {
      console.error('Error saving project:', err);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setSkill('');
    setMinBudget('');
    setMaxBudget('');
    setStatus('open');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Browse <span className="gradient-text">Project Board</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Discover active client job listings, filter by budget, skills, and submit proposals.
          </p>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1.5 rounded-xl text-xs font-semibold">
          {['open', 'in_progress', 'completed', 'All'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatus(tab)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                status === tab
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'in_progress' ? 'In Progress' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Search & Filter Control Bar */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by job title, skills, keywords (e.g. React, E-Commerce, Figma)..."
              className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            Search Jobs
          </button>
        </form>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Skill Tag Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Skill Keyword</label>
            <input
              type="text"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              placeholder="e.g. Node.js"
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Budget Range */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Budget Range ($)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={minBudget}
                onChange={(e) => setMinBudget(e.target.value)}
                placeholder="Min"
                className="w-1/2 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none"
              />
              <span className="text-slate-600 text-xs">-</span>
              <input
                type="number"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                placeholder="Max"
                className="w-1/2 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-end gap-2">
            <button
              onClick={fetchProjects}
              className="flex-1 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Filter className="w-3.5 h-3.5 text-blue-400" /> Apply Filters
            </button>
            <button
              onClick={handleResetFilters}
              className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-800"
              title="Reset Filters"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Display Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-slate-400">
            Showing <span className="text-white font-bold">{projects.length}</span> project(s)
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="glass-card h-72 rounded-2xl animate-pulse bg-slate-800/40"></div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-2xl max-w-lg mx-auto my-12 space-y-4">
            <SlidersHorizontal className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No projects found matching your criteria</h3>
            <p className="text-sm text-slate-400">
              Try adjusting your search terms, resetting skill filters, or broadening the budget range.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-blue-600 text-white font-semibold text-xs rounded-xl"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onSaveToggle={user ? handleToggleSave : null}
                isSaved={savedProjects.includes(project._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
