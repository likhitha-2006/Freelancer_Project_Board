import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import VerificationBadge from '../components/VerificationBadge';
import { User, Mail, Briefcase, Star, Edit, Save, Upload, ShieldCheck, DollarSign } from 'lucide-react';

export default function Profile() {
  const { id } = useParams();
  const { user, updateUser } = useContext(AuthContext);

  const isOwnProfile = !id || id === user?._id;

  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);

  // Edit fields
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      if (isOwnProfile) {
        const { data } = await API.get('/users/profile');
        setProfile(data);
        populateFields(data);
      } else {
        const { data } = await API.get(`/users/${id}`);
        setProfile(data);
        populateFields(data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const populateFields = (data) => {
    setName(data.name || '');
    setTitle(data.title || '');
    setBio(data.bio || '');
    setSkills(data.skills ? data.skills.join(', ') : '');
    setExperience(data.experience || '');
    setHourlyRate(data.hourlyRate || '');
    setCompanyName(data.companyName || '');
  };

  useEffect(() => {
    fetchProfile();
  }, [id, user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('title', title);
      formData.append('bio', bio);
      formData.append('skills', skills);
      formData.append('experience', experience);
      formData.append('hourlyRate', hourlyRate);
      formData.append('companyName', companyName);

      if (imageFile) {
        formData.append('profileImage', imageFile);
      }

      const { data } = await API.put('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setProfile(data);
      updateUser(data);
      setEditing(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="max-w-4xl mx-auto p-12 text-white">Loading profile...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="glass-panel p-8 sm:p-10 rounded-2xl relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-5">
            <img
              src={profile?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || 'U')}`}
              alt={profile?.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-500/40 shadow-xl"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white">{profile?.name}</h1>
                <VerificationBadge status={profile?.verificationStatus} />
              </div>
              <p className="text-sm text-slate-400 font-medium mt-1">
                {profile?.title || (profile?.role === 'client' ? 'Client Employer' : 'Freelancer Specialist')}
              </p>
              <span className="text-xs text-slate-500 capitalize font-medium block mt-0.5">
                Role: {profile?.role}
              </span>
            </div>
          </div>

          {isOwnProfile && (
            <button
              onClick={() => setEditing(!editing)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5"
            >
              <Edit className="w-4 h-4" /> {editing ? 'Cancel Editing' : 'Edit Profile'}
            </button>
          )}
        </div>

        {/* Profile Content or Edit Form */}
        {editing ? (
          <form onSubmit={handleSaveProfile} className="pt-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Professional Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
                  placeholder="e.g. Senior React Developer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Hourly Rate ($USD)</label>
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm font-semibold"
                  placeholder="e.g. 60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
                  placeholder="Acme Corp"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Experience Years</label>
                <input
                  type="text"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
                  placeholder="5 Years"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Skills (Comma-separated)</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
                placeholder="React, Node.js, Tailwind CSS"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Bio / Overview</label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
                placeholder="Describe your background..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Update Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="text-xs text-slate-400"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-4 py-2 text-xs text-slate-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        ) : (
          <div className="pt-6 space-y-6">
            <div>
              <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">Biography</h3>
              <p className="text-sm text-slate-300 leading-relaxed font-light">
                {profile?.bio || 'No biography provided.'}
              </p>
            </div>

            {profile?.skills?.length > 0 && (
              <div>
                <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">Technical Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-slate-800 text-blue-300 text-xs font-semibold border border-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-850">
                <span className="text-xs text-slate-400 block">Hourly Rate</span>
                <span className="text-lg font-bold text-white">${profile?.hourlyRate || 0} / hr</span>
              </div>
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-850">
                <span className="text-xs text-slate-400 block">Experience</span>
                <span className="text-sm font-bold text-white">{profile?.experience || 'N/A'}</span>
              </div>
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-850">
                <span className="text-xs text-slate-400 block">Rating Score</span>
                <span className="text-sm font-bold text-amber-400 flex items-center gap-1">
                  ⭐ {profile?.rating || '5.0'} ({profile?.reviewsCount || 0} reviews)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
