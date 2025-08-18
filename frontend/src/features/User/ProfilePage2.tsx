import React, { useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material'; // ✅ No Grid import needed

// Compact profile page using Material UI
// - Two-column layout
// - Click avatar to upload (multipart POST /api/uploads/avatar -> { url })
// - Load: GET /api/users/me
// - Save: PUT /api/users/me

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [uploading, setUploading] = useState(false);

  const [user, setUser] = useState({
    id: '',
    username: '',
    fullname: '',
    email: '',
    phoneNum: '',
    description: '',
    role: 'USER',
    profilePhotoUrl: '',
  });

  const fileRef = useRef<HTMLInputElement | null>(null);
  const emailOk = /^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$/.test(
    user.email || '',
  );
  const canSave = user.username && user.fullname && emailOk && !saving;

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/api/users/me', { credentials: 'include' });
        if (!r.ok) throw new Error('Failed to load');
        const d = await r.json();
        setUser((u) => ({ ...u, ...d }));
      } catch (e: any) {
        setErr(e.message || 'Load error');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function onUpload(file?: File) {
    if (!file) return;
    setUploading(true);
    setErr('');
    try {
      const body = new FormData();
      body.append('file', file);
      const r = await fetch('/api/uploads/avatar', {
        method: 'POST',
        body,
        credentials: 'include',
      });
      if (!r.ok) throw new Error('Upload failed');
      const { url } = await r.json();
      setUser((u) => ({ ...u, profilePhotoUrl: url }));
      setMsg('Avatar updated');
      setTimeout(() => setMsg(''), 1500);
    } catch (e: any) {
      setErr(e.message || 'Upload error');
    } finally {
      setUploading(false);
    }
  }

  async function onSave() {
    if (!canSave) return;
    setSaving(true);
    setMsg('');
    setErr('');
    try {
      const r = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username: user.username,
          fullname: user.fullname,
          email: user.email,
          phoneNum: user.phoneNum || null,
          description: user.description || '',
          profilePhotoUrl: user.profilePhotoUrl || null,
        }),
      });
      if (!r.ok) throw new Error('Save failed');
      setMsg('Saved');
      setTimeout(() => setMsg(''), 1500);
    } catch (e: any) {
      setErr(e.message || 'Save error');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Box
        minHeight="60vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Your Profile
      </Typography>

      {/* Responsive two-column layout using CSS grid via Box (no Grid component) */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          gap: 3,
        }}
      >
        {/* Left column */}
        <Paper variant="outlined" sx={{ p: 3 }}>
          {/* Avatar clickable */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Box position="relative">
              <Avatar
                src={user.profilePhotoUrl || undefined}
                sx={{ width: 96, height: 96, cursor: 'pointer' }}
                onClick={() => fileRef.current?.click()}
              />
              {uploading && (
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(0,0,0,0.35)',
                    borderRadius: '50%',
                  }}
                >
                  <CircularProgress size={28} color="inherit" />
                </Box>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  onUpload(f);
                  e.currentTarget.value = '';
                }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Click the avatar to upload (drag & drop can be added if needed)
            </Typography>
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 2,
            }}
          >
            <TextField
              label="Username"
              fullWidth
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              required
            />
            <TextField
              label="Full name"
              fullWidth
              value={user.fullname}
              onChange={(e) => setUser({ ...user, fullname: e.target.value })}
              required
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={user.email}
              error={!!user.email && !emailOk}
              helperText={!!user.email && !emailOk ? 'Invalid email' : ''}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
            />
            <TextField
              label="Phone"
              fullWidth
              value={user.phoneNum || ''}
              onChange={(e) => setUser({ ...user, phoneNum: e.target.value })}
            />
            <TextField
              label="About you"
              fullWidth
              multiline
              minRows={3}
              value={user.description || ''}
              onChange={(e) =>
                setUser({ ...user, description: e.target.value })
              }
              sx={{ gridColumn: { xs: '1 / -1', md: '1 / -1' } }}
            />
          </Box>

          {err && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {err}
            </Alert>
          )}
          {msg && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {msg}
            </Alert>
          )}

          <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
            <Button variant="contained" onClick={onSave} disabled={!canSave}>
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
            <Button variant="outlined" onClick={() => window.location.reload()}>
              Reset
            </Button>
          </Stack>
        </Paper>

        {/* Right column */}
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Account
          </Typography>
          <Stack spacing={1}>
            <Row label="User ID" value={user.id || '—'} />
            <Divider flexItem sx={{ my: 0.5 }} />
            <Row label="Role" value={user.role} />
          </Stack>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ mt: 2 }}
          >
            Role is assigned by admins. Sensitive tokens should never be exposed
            here.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Stack direction="row" spacing={2} justifyContent="space-between">
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant="body2"
        fontWeight={600}
        sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        {value}
      </Typography>
    </Stack>
  );
}
