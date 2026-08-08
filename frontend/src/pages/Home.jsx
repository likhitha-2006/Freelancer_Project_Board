import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import ProjectCard from '../components/ProjectCard';
import {
  Briefcase,
  Search,
  ShieldCheck,
  Zap,
  Users,
  DollarSign,
  ArrowRight,
  Sparkles,
  Code,
  Smartphone,
  Palette,
  Bot
} from 'lucide-react';

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await API.get('/projects?status=open');
        setFeaturedProjects(data.slice(0, 6));
      } catch (err) {
        console.error('Failed to load home projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const categories = [
    { name: 'Web Development', icon: Code, count: '120+ Jobs', color: 'from-blue-500 to-indigo-600' },
    { name: 'Mobile Development', icon: Smartphone, count: '85+ Jobs', color: 'from-purple-500 to-pink-600' },
    { name: 'UI/UX Design', icon: Palette, count: '90+ Jobs', color: 'from-amber-500 to-orange-600' },
    { name: 'Data Science & AI', icon: Bot, count: '60+ Jobs', color: 'from-emerald-500 to-teal-600' },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
            <Sparkles className="w-4 h-4" /> Next-Gen Freelance Marketplace
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Hire Top Tech Talent or Discover <span className="gradient-text">High-Paying Projects</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            Connect clients and freelancers seamlessly. Complete with real-time Socket.io chat, mock escrow milestone payments, and identity verification.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/projects"
              className="px-8 py-4 text-base font-bold text-white gradient-btn rounded-xl shadow-xl hover:shadow-blue-500/30 flex items-center gap-2"
            >
              Explore Job Board <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/post-project"
              className="px-8 py-4 text-base font-bold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition-all"
            >
              Post a Project
            </Link>
          </div>

          {/* Key Metric Pills */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="glass-card p-6 rounded-2xl text-center">
              <span className="text-3xl font-extrabold text-white block">$1.2M+</span>
              <span className="text-xs text-slate-400 font-medium">Escrow Protected</span>
            </div>
            <div className="glass-card p-6 rounded-2xl text-center">
              <span className="text-3xl font-extrabold text-white block">98.4%</span>
              <span className="text-xs text-slate-400 font-medium">Project Success</span>
            </div>
            <div className="glass-card p-6 rounded-2xl text-center">
              <span className="text-3xl font-extrabold text-white block">5,000+</span>
              <span className="text-xs text-slate-400 font-medium">Verified Freelancers</span>
            </div>
            <div className="glass-card p-6 rounded-2xl text-center">
              <span className="text-3xl font-extrabold text-white block">&lt; 15 min</span>
              <span className="text-xs text-slate-400 font-medium">Avg First Proposal</span>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Popular Skill Categories</h2>
            <p className="text-sm text-slate-400">Explore in-demand skills and high-budget opportunities</p>
          </div>
          <Link to="/projects" className="text-sm font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link
                key={idx}
                to={`/projects?category=${encodeURIComponent(cat.name)}`}
                className="glass-card p-6 rounded-2xl flex items-center gap-4 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">{cat.name}</h3>
                  <span className="text-xs text-slate-400">{cat.count}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Projects Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Latest Project Openings</h2>
            <p className="text-sm text-slate-400">Browse newly posted freelance opportunities ready for proposals</p>
          </div>
          <Link to="/projects" className="text-sm font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
            Browse All Projects <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="glass-card h-64 rounded-2xl animate-pulse bg-slate-800/40"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </section>

      {/* Platform Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Engineered for Safe & Fast Freelancing</h2>
          <p className="text-slate-400 text-sm">Everything you need to manage proposals, work contracts, identity proof, and funds.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-8 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Mock Escrow Milestone System</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Clients deposit funds into Escrow before work begins. Payments are safely released to freelancers upon milestone delivery and approval.
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Real-Time Socket.io Chat</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Instant messaging between clients and freelancers with attachment file sharing, online status indicators, and live project notifications.
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Admin Identity Verification</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Upload passport or official identity proof. Admins review and grant Verified badges to build trust across the platform.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
