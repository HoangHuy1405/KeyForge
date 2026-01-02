import { useMemo, useRef, useState, useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CakeIcon from '@mui/icons-material/Cake';
import HomeIcon from '@mui/icons-material/Home';
import LoadingButton from '../../components/LoadingButton';
import {
  type UserProfileResponseDto,
  type UserProfileUpdateRequest,
} from '../../services/UserProfileService';
import { useUpdateProfile, useUploadAvatar } from '../../hooks/mutation/useProfileMutations';

// Gender options
const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
];

export default function ProfilePage() {
  const theme = useTheme();
  const loaderData = useLoaderData() as UserProfileResponseDto;
  const initial = useMemo(() => loaderData, [loaderData]);
  
  const [user, setUser] = useState<UserProfileResponseDto>(initial);
  const [error, setErr] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  // Update local state when loader data changes
  useEffect(() => {
    if (loaderData) setUser(loaderData);
  }, [loaderData]);

  // Avatar Mutation - using extracted hook
  const { mutate: uploadAvatarMutation, isPending: uploading } = useUploadAvatar({
    onSuccess: (updatedProfile) => {
      setUser((prev) => ({ ...prev, avatarUrl: updatedProfile.avatarUrl }));
    },
  });

  const onUpload = (file?: File) => {
    if (!file) return;
    uploadAvatarMutation(file);
  };

  // Profile Save Mutation - using extracted hook
  const { mutate: saveProfile, isPending: saving } = useUpdateProfile({
    onSuccess: (data) => {
      setUser(data);
      setErr('');
    },
    onError: (e) => {
      setErr(e?.message || 'Save failed');
    },
  });

  const onSave = () => {
    const payload: UserProfileUpdateRequest = {
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      phoneNum: user.phoneNum,
      dob: user.dob,
      gender: user.gender,
      address: user.address,
      description: user.description,
    };
    saveProfile(payload);
  };

  const onReset = () => {
    setUser(initial);
    setErr('');
  };

  // Format Roles
  const displayRoles = useMemo(() => {
    if (user.roles && user.roles.length > 0) {
      return user.roles.map(r => r.replace('ROLE_', '')).join(', ');
    }
    return user.role ? String(user.role).replace('ROLE_', '') : 'User';
  }, [user.roles, user.role]);

  return (
    <Box sx={{ maxWidth: '100%', mx: 'auto' }}>
      <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mb: 1 }}>
        My Profile
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage your personal information and account settings
      </Typography>

      <Grid container spacing={3}>
        {/* Left Column: Form */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              height: '100%',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <PersonIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                Personal Information
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Username"
                  variant="outlined"
                  value={user.username || ''}
                  onChange={(e) => setUser({ ...user, username: e.target.value })}
                  disabled // Username usually immutable
                  helperText="Username cannot be changed"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  variant="outlined"
                  value={user.fullname || ''}
                  onChange={(e) => setUser({ ...user, fullname: e.target.value })}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  variant="outlined"
                  value={user.email || ''}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  disabled // Email usually immutable
                  InputProps={{
                    startAdornment: <EmailIcon color="action" sx={{ mr: 1, fontSize: 20 }} />,
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  variant="outlined"
                  value={user.phoneNum || ''}
                  onChange={(e) => setUser({ ...user, phoneNum: e.target.value })}
                  InputProps={{
                    startAdornment: <PhoneIcon color="action" sx={{ mr: 1, fontSize: 20 }} />,
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  variant="outlined"
                  value={user.dob || ''}
                  onChange={(e) => setUser({ ...user, dob: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <CakeIcon color="action" sx={{ mr: 1, fontSize: 20 }} />,
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  select
                  label="Gender"
                  variant="outlined"
                  value={user.gender || ''}
                  onChange={(e) => setUser({ ...user, gender: e.target.value })}
                >
                  {GENDER_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Address"
                  variant="outlined"
                  multiline
                  minRows={2}
                  value={user.address || ''}
                  onChange={(e) => setUser({ ...user, address: e.target.value })}
                  InputProps={{
                    startAdornment: <HomeIcon color="action" sx={{ mr: 1, mt: 0.5, fontSize: 20, alignSelf: 'flex-start' }} />,
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Bio / Description"
                  variant="outlined"
                  multiline
                  minRows={3}
                  value={user.description || ''}
                  onChange={(e) => setUser({ ...user, description: e.target.value })}
                  placeholder="Tell us a bit about yourself..."
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                startIcon={<RestartAltIcon />}
                onClick={onReset}
              >
                Reset
              </Button>
              <LoadingButton
                loading={saving}
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={onSave}
              >
                Save Changes
              </LoadingButton>
            </Stack>

            {error && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {error}
              </Alert>
            )}
          </Paper>
        </Grid>

        {/* Right Column: Avatar & Account Info */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <Box sx={{ position: 'relative', mb: 3 }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <Tooltip title="Upload new photo">
                    <IconButton
                      onClick={() => fileRef.current?.click()}
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'primary.dark' },
                        boxShadow: 2,
                        width: 40,
                        height: 40,
                      }}
                    >
                      <PhotoCameraIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                }
              >
                <Avatar
                  src={user.avatarUrl || ''}
                  alt={user.fullname || user.username}
                  sx={{
                    width: 120,
                    height: 120,
                    border: `4px solid ${theme.palette.background.paper}`,
                    boxShadow: theme.shadows[3],
                  }}
                />
              </Badge>
              {uploading && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    bgcolor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="caption" color="white">Uploading...</Typography>
                </Box>
              )}
            </Box>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                onUpload(f);
                e.target.value = '';
              }}
            />

            <Typography variant="h6" fontWeight={700}>
              {user.fullname || user.username}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {user.email}
            </Typography>

            <Chip 
              label={displayRoles} 
              color="primary" 
              variant="outlined" 
              size="small" 
              sx={{ mt: 1, fontWeight: 600, textTransform: 'uppercase' }} 
            />

            <Divider flexItem sx={{ my: 3 }} />

            <Box sx={{ width: '100%', textAlign: 'left' }}>
              <Typography variant="subtitle2" gutterBottom>
                Account Details
              </Typography>
              <Stack spacing={1}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">ID</Typography>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                    {user.id}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">Status</Typography>
                  <Typography variant="caption" color="success.main" fontWeight={600}>
                    Active
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
