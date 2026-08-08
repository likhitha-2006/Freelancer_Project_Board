import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import VerificationBadge from './VerificationBadge';
import {
  Briefcase,
  PlusCircle,
  MessageSquare,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  AlertCircle
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated, isClient, isFreelancer, isAdmin } = useContext(AuthContext);
  const { unreadCount } = useContext(SocketContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl gradient-btn flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-white tracking-tight">
                  Pro<span className="gradient-text">Board</span>
                </span>
                <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                  Freelancer Marketplace
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 font-medium text-sm">
            <Link
              to="/projects"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/projects')
                  ? 'bg-blue-600/20 text-blue-400 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Browse Projects
            </Link>

            {isClient && (
              <>
                <Link
                  to="/post-project"
                  className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                    isActive('/post-project')
                      ? 'bg-blue-600/20 text-blue-400 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <PlusCircle className="w-4 h-4 text-blue-400" />
                  Post Project
                </Link>
                <Link
                  to="/client-dashboard"
                  className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                    isActive('/client-dashboard')
                      ? 'bg-blue-600/20 text-blue-400 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-purple-400" />
                  Client Dashboard
                </Link>
              </>
            )}

            {isFreelancer && (
              <Link
                to="/freelancer-dashboard"
                className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                  isActive('/freelancer-dashboard')
                    ? 'bg-blue-600/20 text-blue-400 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                Freelancer Workspace
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin-dashboard"
                className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                  isActive('/admin-dashboard')
                    ? 'bg-purple-600/20 text-purple-400 font-semibold'
                    : 'text-purple-300 hover:text-white hover:bg-purple-900/40'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                Admin Panel
              </Link>
            )}

            {isAuthenticated && (
              <Link
                to="/chat"
                className={`relative px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                  isActive('/chat')
                    ? 'bg-blue-600/20 text-blue-400 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-amber-400" />
                Chat
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )}
          </div>

          {/* User Section / Login & Register */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-slate-600 transition-all"
                >
                  <img
                    src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2563eb&color=fff`}
                    alt={user.name}
                    className="w-8 h-8 rounded-lg object-cover border border-slate-600"
                  />
                  <div className="text-left hidden lg:block">
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-slate-400 capitalize font-medium">
                      {user.role}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2.5 border-b border-slate-800">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-white truncate">{user.email}</p>
                      <div className="mt-1.5">
                        <VerificationBadge status={user.verificationStatus} />
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-blue-400" />
                      View Profile
                    </Link>

                    <Link
                      to="/verify-identity"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Identity Verification
                    </Link>

                    <Link
                      to="/disputes"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                      Disputes Center
                    </Link>

                    <div className="border-t border-slate-800 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white gradient-btn rounded-lg shadow-md hover:shadow-blue-500/25"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/projects"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 py-2 font-medium"
          >
            Browse Projects
          </Link>
          {isClient && (
            <>
              <Link
                to="/post-project"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-300 py-2 font-medium"
              >
                Post Project
              </Link>
              <Link
                to="/client-dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-300 py-2 font-medium"
              >
                Client Dashboard
              </Link>
            </>
          )}
          {isFreelancer && (
            <Link
              to="/freelancer-dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-300 py-2 font-medium"
            >
              Freelancer Workspace
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin-dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-purple-400 py-2 font-medium"
            >
              Admin Panel
            </Link>
          )}
          {isAuthenticated ? (
            <>
              <Link
                to="/chat"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-300 py-2 font-medium"
              >
                Messages ({unreadCount})
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-300 py-2 font-medium"
              >
                My Profile
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left text-rose-400 py-2 font-semibold"
              >
                Log Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-slate-300 border border-slate-700 rounded-lg"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-white gradient-btn rounded-lg"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
