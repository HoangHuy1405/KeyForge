import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Paper,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  getUserProfile,
  updateUserProfile,
  uploadUserAvatar,
  UserProfileResponseDto,
} from '../../services/UserProfileService';

// Minimal JWT decoder (no external libs)
function decodeJwt<T = any>(token: string): T {
  const [, payload = ''] = token.split('.');
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  const json = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join(''),
  );
  return JSON.parse(json);
}

const unwrap = <T,>(resp: any): T =>
  resp && typeof resp === 'object' && 'data' in resp
    ? (resp.data as T)
    : (resp as T);

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [userId, setUserId] = useState<string>('');

  const [user, setUser] = useState<UserProfileResponseDto>({
    id: '',
    username: '',
    fullname: '',
    email: '',
    phoneNum: '',
    description: '',
    role: 'USER',
    avatarUrl: '',
    profilePhotoPublicId: '',
    accountId: '',
  });

  const fileRef = useRef<HTMLInputElement | null>(null);
  const emailOk = /^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$/.test(
    user.email || '',
  );
  const canSave = !!user.fullname && emailOk && !saving;

  useEffect(() => {
    (async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const user = storedUser ? JSON.parse(storedUser) : null;

        console.log('new user: ', user);
        setUserId(user.id);

        const raw = await getUserProfile(user.id);
        const profile = unwrap<UserProfileResponseDto>(raw);
        const avatar =
          (profile as any).avatarUrl ?? (profile as any).profilePhotoUrl ?? '';

        setUser({ ...profile, avatarUrl: avatar });
      } catch (e: any) {
        setErr(e.message || 'Load error');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ---- upload avatar ----
  async function onUpload(file?: File) {
    if (!file || !userId) return;
    setUploading(true);
    setErr('');
    try {
      const updatedProfile = await uploadUserAvatar(userId, file);
      setUser(updatedProfile);
      // localStorage.setItem('user', JSON.stringify(updatedProfile));
      setMsg('Avatar updated');
      setTimeout(() => setMsg(''), 1500);
    } catch (e: any) {
      setErr(e.message || 'Upload error');
    } finally {
      setUploading(false);
    }
  }

  // ---- save profile ----
  async function onSave() {
    if (!canSave || !userId) return;
    setSaving(true);
    setMsg('');
    setErr('');
    try {
      const rawUpdated = await updateUserProfile(userId, {
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        phoneNum: user.phoneNum || null,
        description: user.description || '',
      });

      const avatar =
        (rawUpdated as any).avatarUrl ??
        (rawUpdated as any).profilePhotoUrl ??
        user.avatarUrl;

      const profile = unwrap<UserProfileResponseDto>(rawUpdated);
      setUser({ ...profile, avatarUrl: avatar });
      setMsg('Saved');
      setTimeout(() => setMsg(''), 1500);
    } catch (e: any) {
      console.log(e);
      setErr(e.message || 'Save error');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
      <header className="sticky top-0 z-10 border-b border-slate-200/60 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Your Profile
            </h1>
            <p className="text-sm text-slate-500">
              Manage your information and avatar
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          <Paper
            elevation={0}
            className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm md:col-span-2"
          >
            {/* Avatar */}
            <div className="mb-6 flex items-center gap-4">
              <button
                type="button"
                className="group relative h-24 w-24 overflow-hidden rounded-2xl ring-1 ring-slate-200"
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  onUpload(e.dataTransfer.files?.[0] || undefined);
                }}
                title="Click to upload avatar"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt="avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="h-8 w-8"
                      fill="currentColor"
                    >
                      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.866 0-7 2.239-7 5v1h14v-1c0-2.761-3.134-5-7-5Z" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 hidden items-center justify-center bg-black/40 text-xs font-medium text-white group-hover:flex">
                  Change
                </div>
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
                  </div>
                )}
              </button>
              <div>
                <p className="text-sm text-slate-600">
                  Click the avatar to upload • Drag & drop supported
                </p>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    onUpload(f);
                    e.currentTarget.value = '';
                  }}
                />
              </div>
            </div>

            {/* Fields */}
            <div className="grid gap-4 md:grid-cols-2">
              <TWField label="Username">
                <TextField
                  size="small"
                  fullWidth
                  value={user.username || ''}
                  onChange={(e) =>
                    setUser({ ...user, username: e.target.value })
                  }
                  InputProps={{ className: 'rounded-xl bg-white' }}
                />
              </TWField>

              <TWField label="Full name">
                <TextField
                  size="small"
                  fullWidth
                  value={user.fullname || ''}
                  onChange={(e) =>
                    setUser({ ...user, fullname: e.target.value })
                  }
                  InputProps={{ className: 'rounded-xl bg-white' }}
                />
              </TWField>

              <TWField
                label="Email"
                hint={!emailOk && user.email ? 'Invalid email' : ''}
                error={!emailOk && !!user.email}
              >
                <TextField
                  type="email"
                  size="small"
                  fullWidth
                  error={!!user.email && !emailOk}
                  value={user.email || ''}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  InputProps={{ className: 'rounded-xl bg-white' }}
                />
              </TWField>

              <TWField label="Phone">
                <TextField
                  size="small"
                  fullWidth
                  value={user.phoneNum || ''}
                  onChange={(e) =>
                    setUser({ ...user, phoneNum: e.target.value })
                  }
                  InputProps={{ className: 'rounded-xl bg-white' }}
                />
              </TWField>

              <div className="md:col-span-2">
                <TWField label="About you">
                  <TextField
                    size="small"
                    fullWidth
                    multiline
                    minRows={3}
                    value={user.description || ''}
                    onChange={(e) =>
                      setUser({ ...user, description: e.target.value })
                    }
                    InputProps={{ className: 'rounded-xl bg-white' }}
                  />
                </TWField>
              </div>
            </div>

            {err && (
              <Alert severity="error" className="mt-4">
                {err}
              </Alert>
            )}
            {msg && (
              <Alert severity="success" className="mt-4">
                {msg}
              </Alert>
            )}

            <div className="mt-6 flex items-center gap-3">
              <Button
                variant="contained"
                onClick={onSave}
                disabled={!canSave}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-white shadow-sm hover:bg-slate-800 disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save changes'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => window.location.reload()}
                className="rounded-xl border-slate-300 bg-white px-5 py-2.5 text-slate-800 hover:bg-slate-50"
              >
                Reset
              </Button>
            </div>
          </Paper>

          {/* Right column */}
          <Paper
            elevation={0}
            className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm"
          >
            <h2 className="mb-2 text-lg font-semibold text-slate-900">
              Account
            </h2>
            <dl className="grid grid-cols-3 gap-3 text-sm">
              <dt className="text-slate-500">User ID</dt>
              <dd className="col-span-2 truncate font-medium text-slate-900">
                {user.id || '—'}
              </dd>
              <dt className="text-slate-500">Role</dt>
              <dd className="col-span-2 font-medium text-slate-900">
                {user.role}
              </dd>
            </dl>
            <p className="mt-3 text-xs text-slate-500">
              Role is admin-managed. Sensitive tokens should never be exposed
              here.
            </p>
          </Paper>
        </div>
      </main>
    </div>
  );
}

function TWField({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-900">{label}</span>
      <div
        className={`mt-1 rounded-xl ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-slate-400 ${error ? 'ring-red-300 focus-within:ring-red-400' : ''}`}
      >
        <div className="rounded-xl">{children}</div>
      </div>
      {hint ? <p className="mt-1 text-xs text-red-600">{hint}</p> : null}
    </label>
  );
}
