// src/routes/profile/Page.jsx
import React, { useMemo, useRef, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  Alert,
  Avatar,
  Badge,
  Button,
  Divider,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Snackbar,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import LoadingButton from '../../components/LoadingButton';
import {
  updateUserProfile,
  uploadUserAvatar,
} from '../../services/UserProfileService';
import { useDispatch } from 'react-redux';
import { updateAvatar } from '../../redux/slice/accountSlice';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function ProfilePage() {
  const loaderData = useLoaderData();
  const initial = useMemo(
    () => loaderData?.profile ?? loaderData ?? {},
    [loaderData],
  );
  const [user, setUser] = useState(initial);
  // const [uploading, setUploading] = useState(false);
  // const [saving, setSaving] = useState(false);
  const [error, setErr] = useState('');

  const dispatch = useDispatch();
  const qc = useQueryClient();
  const fileRef = useRef(null);

  const emailOk = useMemo(() => {
    const re = /^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$/;
    return re.test(user?.email || '');
  }, [user?.email]);

  // --- handlers (wire these to your real services) ---
  // const onUpload = async (file) => {
  //   if (!file) return;
  //   setUploading(true);
  //   try {
  //     const updatedProfile = await uploadUserAvatar(user.id, file);
  //     setUser(updatedProfile);
  //     dispatch(updateAvatar(updatedProfile.avatarUrl));
  //     toast.success('Update avatar successfully!');
  //   } catch (e) {
  //     toast.error(`${e.message}`);
  //   } finally {
  //     setUploading(false);
  //   }
  // };
  const { mutate: uploadAvatar, isLoading: uploading } = useMutation({
    mutationFn: ({ id, file }) => uploadUserAvatar(id, file),
    onSuccess: (updatedProfile) => {
      setUser(updatedProfile);
      dispatch(updateAvatar(updatedProfile.avatarUrl));
      // optional: keep cache in sync
      qc.setQueryData(['me'], (old) => ({ ...(old || {}), ...updatedProfile }));
      toast.success('Update avatar successfully!');
    },
    onError: (e) => {
      toast.error(e?.message || 'Upload failed');
    },
  });

  const onUpload = (file) => {
    if (!file) return;
    uploadAvatar({ id: user.id, file });
  };

  // const onSave = async () => {
  //   setSaving(true);
  //   setErr('');
  //   try {
  //     const { id, username, fullname, email, phoneNum, description } = user;
  //     const payload = {
  //       username,
  //       fullname,
  //       email,
  //       phoneNum,
  //       description,
  //     };
  //     const data = await updateUserProfile(id, payload);
  //     setUser(data);
  //     toast.success('Update profile successfully!');
  //   } catch (e) {
  //     toast.error(`${e.message}`);
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  const { mutate: saveProfile, isLoading: saving } = useMutation({
    mutationFn: ({ id, payload }) => updateUserProfile(id, payload),
    onMutate: () => setErr(''),
    onSuccess: (data) => {
      setUser(data);
      qc.setQueryData(['me'], (old) => ({ ...(old || {}), ...data }));
      toast.success('Update profile successfully!');
    },
    onError: (e) => {
      const msg = e?.message || 'Save failed';
      setErr(msg);
      toast.error(msg);
    },
  });

  const onSave = () => {
    const { id, username, fullname, email, phoneNum, description } = user;
    const payload = { username, fullname, email, phoneNum, description };
    saveProfile({ id, payload });
  };

  const onReset = () => {
    setUser(initial);
    setErr('');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* header */}
      <header className="sticky top-0 z-10 border-b border-primary/70 bg-background backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-secondary">
              Your Profile
            </h1>
            <p className="text-sm text-text-secondary">
              Manage your information and avatar
            </p>
          </div>
        </div>
      </header>

      {/* main */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          {/* LEFT: form */}
          <Paper
            elevation={0}
            sx={{ borderRadius: '12px' }}
            className="h-full rounded-2xl border border-primary bg-background-paper p-6 shadow-sm md:col-span-2"
          >
            {/* fields */}
            <div className="grid gap-4 md:grid-cols-2">
              <TWField label="Username">
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={user?.username || ''}
                  onChange={(e) =>
                    setUser({ ...user, username: e.target.value })
                  }
                  InputProps={{ className: 'rounded-xl bg-white' }}
                />
              </TWField>

              <TWField label="Full name">
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={user?.fullName || user?.fullname || ''}
                  onChange={(e) =>
                    setUser({ ...user, fullName: e.target.value })
                  }
                  InputProps={{ className: 'rounded-xl bg-white' }}
                />
              </TWField>

              <TWField
                label="Email"
                hint={!emailOk && user?.email ? 'Invalid email' : ''}
                error={!emailOk && !!user?.email}
              >
                <TextField
                  variant="outlined"
                  type="email"
                  size="small"
                  fullWidth
                  error={!!user?.email && !emailOk}
                  value={user?.email || ''}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  InputProps={{ className: 'rounded-xl bg-white' }}
                  disabled
                />
              </TWField>

              <TWField label="Phone">
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={user?.phone || user?.phoneNum || ''}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      phone: e.target.value,
                      phoneNum: e.target.value,
                    })
                  }
                  InputProps={{ className: 'rounded-xl bg-white' }}
                />
              </TWField>

              <div className="md:col-span-2">
                <TWField label="About you">
                  <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    multiline
                    minRows={3}
                    value={user?.bio || user?.description || ''}
                    onChange={(e) =>
                      setUser({
                        ...user,
                        bio: e.target.value,
                        description: e.target.value,
                      })
                    }
                    InputProps={{ className: 'rounded-xl bg-white' }}
                  />
                </TWField>
              </div>
            </div>

            {/* actions */}
            <Divider className="my-6 border-secondary" />

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <LoadingButton
                loading={saving}
                loadingPosition="start"
                startIcon={<SaveIcon />}
                variant="contained"
                color="primary"
                onClick={onSave}
                className="rounded-xl px-5 py-2.5"
              >
                Save changes
              </LoadingButton>

              <Button
                variant="outlined"
                color="secondary"
                startIcon={<RestartAltIcon />}
                onClick={onReset}
                className="rounded-xl bg-white px-5 py-2.5"
              >
                Reset
              </Button>
            </div>

            {/* inline alerts */}
            {error ? (
              <Alert severity="error" className="mt-4">
                {error}
              </Alert>
            ) : null}
            {/* {message ? (
              <Alert severity="success" className="mt-4">
                {message}
              </Alert>
            ) : null} */}
          </Paper>

          {/* RIGHT: avatar + account */}
          <div className="space-y-6">
            {/* avatar card (moved here) */}
            <Paper
              elevation={0}
              sx={{ borderRadius: '12px' }}
              className="h-full rounded-2xl border border-primary bg-background-paper p-6 shadow-sm"
            >
              <div className="mb-8 flex items-center gap-5">
                <div className="relative">
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <Tooltip title="Change avatar">
                        <span>
                          <IconButton
                            size="medium"
                            onClick={() => fileRef.current?.click()}
                            className="h-11 w-11 bg-primary shadow hover:bg-primary/90"
                          >
                            <PhotoCameraIcon
                              className="text-white"
                              fontSize="medium"
                            />
                          </IconButton>
                        </span>
                      </Tooltip>
                    }
                  >
                    <Avatar
                      src={user?.avatarUrl || ''}
                      alt={user?.fullName || user?.username || 'avatar'}
                      sx={{ width: 70, height: 70 }} // 11rem ≈ large avatar
                      className="rounded-2xl ring-4 ring-primary"
                    />
                  </Badge>

                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/30">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-sm text-text-secondary">
                    Click the camera to upload • Drag & drop supported
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
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      onUpload(e.dataTransfer.files?.[0]);
                    }}
                  />
                </div>
              </div>

              <dl className="grid grid-cols-3 gap-3 text-sm">
                <dt className="text-text-secondary">User ID</dt>
                <dd className="col-span-2 truncate font-medium text-text-primary">
                  {user?.id || '—'}
                </dd>

                <dt className="text-text-secondary">Role</dt>
                <dd className="col-span-2 font-medium text-text-primary">
                  {user?.role ?? '—'}
                </dd>
              </dl>
              <p className="mt-3 text-xs text-text-secondary">
                Role is admin-managed. Sensitive tokens should never be exposed
                here.
              </p>
            </Paper>
          </div>
        </div>
      </main>

      {/* snackbars */}
      {/* <Snackbar
        open={!!message}
        autoHideDuration={3000}
        onClose={() => setMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setMessage('')}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setErr('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setErr('')}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar> */}
    </div>
  );
}

function TWField({ label, hint, error, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-text-primary">{label}</span>
      <div
        className={`mt-1 rounded-xl ring-1 ring-primary focus-within:ring-2 focus-within:ring-primary ${
          error ? 'ring-red-300 focus-within:ring-red-400' : ''
        }`}
      >
        <div className="rounded-xl">{children}</div>
      </div>
      {hint ? <p className="mt-1 text-xs text-red-600">{hint}</p> : null}
    </label>
  );
}
