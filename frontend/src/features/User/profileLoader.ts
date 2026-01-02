import { getUserProfile } from '../../services/UserProfileService.ts';

export async function loader() {
  const userProfile = await getUserProfile();

  return userProfile;
}
