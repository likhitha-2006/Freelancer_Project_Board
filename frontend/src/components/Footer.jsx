import React from 'react';
import { Briefcase, ShieldCheck, Zap, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg gradient-btn flex items-center justify-center text-white">
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="text-lg font-extrabold text-white">
              Pro<span className="gradient-text">Board</span>
            </span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed mb-4">
            The next-generation marketplace connecting ambitious clients with world-class tech freelancers and designers.
          </p>
          <div className="flex items-center gap-3 text-xs text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" /> Escrow Protected Payments
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">For Clients</h4>
          <ul className="space-y-2.5 text-sm">
            <li><a href="/post-project" className="hover:text-white transition-colors">Post a Project</a></li>
            <li><a href="/projects" className="hover:text-white transition-colors">Browse Freelancers</a></li>
            <li><a href="/client-dashboard" className="hover:text-white transition-colors">Client Dashboard</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Escrow Guarantee</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">For Freelancers</h4>
          <ul className="space-y-2.5 text-sm">
            <li><a href="/projects" className="hover:text-white transition-colors">Find Remote Jobs</a></li>
            <li><a href="/freelancer-dashboard" className="hover:text-white transition-colors">Freelancer Workspace</a></li>
            <li><a href="/verify-identity" className="hover:text-white transition-colors">Identity Verification</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Earnings & Payouts</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Security & Support</h4>
          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Lock className="w-4 h-4 text-blue-400" />
              <span>JWT & Encrypted Auth</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Real-Time Socket.io Chat</span>
            </div>
            <p className="text-slate-500 pt-2">
              © {new Date().getFullYear()} Freelancer Project Board. Built for speed and reliability.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
