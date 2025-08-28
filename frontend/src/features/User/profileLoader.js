import { getUserId } from '../../redux/slice/accountSlice';
import { getUserProfile } from '../../services/UserProfileService';
import store from '../../redux/store';

export async function loader() {
  const userId = await getUserId(store.getState());
  if (!userId) throw new Error('userId is null');
  const userProfile = await getUserProfile(userId);

  return userProfile;
}
