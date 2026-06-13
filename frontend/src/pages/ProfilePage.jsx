import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { getAvatarUrl } from '../utils/imageUrl';
import toast from 'react-hot-toast';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar ? getAvatarUrl(user.avatar) : ''
  );
  const fileRef = useRef();

  const [form, setForm] = useState({
    name:    user?.name  || '',
    phone:   user?.phone || '',
    address: {
      street:  user?.address?.street  || '',
      city:    user?.address?.city    || '',
      state:   user?.address?.state   || '',
      pincode: user?.address?.pincode || '',
    },
  });

  const [pwForm, setPwForm] = useState({ password: '', confirm: '' });

  /* ── Avatar upload ── */
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show instant local preview
    const localUrl = URL.createObjectURL(file);
    setAvatarPreview(localUrl);

    setUploadingAvatar(true);
    try {
      const fd = new FormData();
      fd.append('avatar', file);
      const { data } = await API.post('/upload/avatar', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Update context so Navbar also reflects change immediately
      updateUser(data.user);
      setAvatarPreview(getAvatarUrl(data.avatarUrl));
      toast.success('Profile picture updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
      // Revert preview on error
      setAvatarPreview(user?.avatar ? getAvatarUrl(user.avatar) : '');
    } finally {
      setUploadingAvatar(false);
    }
  };

  /* ── Save profile ── */
  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await API.put('/auth/profile', form);
      updateUser(data.user);
      if (data.token) localStorage.setItem('token', data.token);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  /* ── Save password ── */
  const savePassword = async (e) => {
    e.preventDefault();
    if (pwForm.password !== pwForm.confirm) { toast.error('Passwords do not match'); return; }
    if (pwForm.password.length < 6)         { toast.error('Min 6 characters'); return; }
    setSaving(true);
    try {
      await API.put('/auth/profile', { password: pwForm.password });
      toast.success('Password updated!');
      setPwForm({ password: '', confirm: '' });
    } catch {
      toast.error('Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  const initials = user?.name?.[0]?.toUpperCase() || '?';

  return (
    <div className="profile-page page-enter">
      <div className="container">

        {/* ── Profile header with avatar ── */}
        <div className="profile-header">
          <div className="avatar-upload-wrap">
            {/* Circle avatar */}
            <div className="profile-avatar-ring">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt={user?.name}
                  className="profile-avatar-img"
                  onError={e => { e.target.onerror = null; setAvatarPreview(''); }}
                />
              ) : (
                <div className="profile-avatar-initials">{initials}</div>
              )}

              {/* Overlay button */}
              <button
                className="avatar-edit-btn"
                onClick={() => fileRef.current?.click()}
                disabled={uploadingAvatar}
                title="Change profile picture"
              >
                {uploadingAvatar ? (
                  <div className="spinner" style={{ width: 14, height: 14, borderColor: '#fff3', borderTopColor: '#fff' }} />
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                )}
              </button>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleAvatarChange}
              style={{ display: 'none' }}
            />

            <p className="avatar-hint">Click camera icon to change photo<br/><span>JPG, PNG, WebP · max 3 MB</span></p>
          </div>

          <div className="profile-user-info">
            <h1>{user?.name}</h1>
            <p className="profile-email">{user?.email}</p>
            {user?.isAdmin && <span className="badge badge-red" style={{ marginTop: 6, display: 'inline-block' }}>Admin</span>}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="profile-tabs">
          {['profile', 'password'].map(t => (
            <button
              key={t}
              className={`tab-btn ${tab === t ? 'active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t === 'profile' ? 'Profile & Address' : 'Change Password'}
            </button>
          ))}
        </div>

        {/* ── Profile & Address form ── */}
        {tab === 'profile' && (
          <form className="card profile-form" onSubmit={saveProfile}>
            <h3>Personal Information</h3>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Your full name"
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="10-digit mobile"
                  maxLength={10}
                />
              </div>
            </div>

            <h3>Default Address</h3>
            <div className="form-group">
              <label>Street</label>
              <input
                value={form.address.street}
                onChange={e => setForm(f => ({ ...f, address: { ...f.address, street: e.target.value } }))}
                placeholder="House No., Street, Area"
              />
            </div>
            <div className="form-grid-3">
              <div className="form-group">
                <label>City</label>
                <input
                  value={form.address.city}
                  onChange={e => setForm(f => ({ ...f, address: { ...f.address, city: e.target.value } }))}
                  placeholder="City"
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  value={form.address.state}
                  onChange={e => setForm(f => ({ ...f, address: { ...f.address, state: e.target.value } }))}
                  placeholder="State"
                />
              </div>
              <div className="form-group">
                <label>Pincode</label>
                <input
                  value={form.address.pincode}
                  onChange={e => setForm(f => ({ ...f, address: { ...f.address, pincode: e.target.value } }))}
                  placeholder="6-digit pincode"
                  maxLength={6}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        )}

        {/* ── Change Password form ── */}
        {tab === 'password' && (
          <form className="card profile-form" onSubmit={savePassword}>
            <h3>Change Password</h3>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={pwForm.password}
                onChange={e => setPwForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Min 6 characters"
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={pwForm.confirm}
                onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}
                placeholder="Re-enter password"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
