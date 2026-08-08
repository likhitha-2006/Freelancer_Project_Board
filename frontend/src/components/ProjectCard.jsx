import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Bookmark, DollarSign, Tag, CheckCircle2, Clock } from 'lucide-react';

export default function ProjectCard({ project, onSaveToggle, isSaved }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Open</span>;
      case 'in_progress':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">In Progress</span>;
      case 'completed':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">Completed</span>;
      case 'disputed':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">Disputed</span>;
      default:
        return null;
    }
  };

  const formattedDeadline = project.deadline
    ? new Date(project.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : 'No deadline';

  return (
    <div className="glass-card rounded-2xl p-6 relative flex flex-col justify-between group">
      <div>
        {/* Top Header: Category & Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 bg-blue-950/60 px-3 py-1 rounded-lg border border-blue-800/40">
            <Tag className="w-3 h-3" />
            {project.category}
          </span>
          <div className="flex items-center gap-2">
            {getStatusBadge(project.status)}
            {onSaveToggle && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onSaveToggle(project._id);
                }}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isSaved
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-white'
                }`}
                title="Save Project"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <Link to={`/projects/${project._id}`}>
          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
            {project.title}
          </h3>
        </Link>

        {/* Description Snippet */}
        <p className="text-sm text-slate-300 line-clamp-3 mb-4 leading-relaxed font-light">
          {project.description}
        </p>

        {/* Required Skills */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.requiredSkills?.map((skill, idx) => (
            <span
              key={idx}
              className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-medium border border-slate-700/60"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">Budget</span>
          <span className="text-lg font-extrabold text-white flex items-center gap-0.5">
            <DollarSign className="w-4 h-4 text-emerald-400 -mr-1" />
            {project.budget?.toLocaleString()}
            <span className="text-xs text-slate-400 font-normal ml-1">({project.budgetType || 'fixed'})</span>
          </span>
        </div>

        <div className="text-right">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">Deadline</span>
          <span className="text-xs text-slate-300 font-medium flex items-center justify-end gap-1">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            {formattedDeadline}
          </span>
        </div>
      </div>
    </div>
  );
}
