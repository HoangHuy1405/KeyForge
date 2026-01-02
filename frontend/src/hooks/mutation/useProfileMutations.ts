import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile, uploadUserAvatar, UserProfileResponseDto, UserProfileUpdateRequest } from "../../services/UserProfileService";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUserLoginInfo, updateAvatar } from "../../redux/slice/accountSlice";

// Options type for customizing hooks
interface ProfileMutationCallbacks {
    onSuccess?: (data: UserProfileResponseDto) => void;
    onError?: (error: Error) => void;
}

interface AvatarMutationCallbacks {
    onSuccess?: (data: UserProfileResponseDto) => void;
    onError?: (error: Error) => void;
}

// Update Profile Hook
export const useUpdateProfile = (callbacks?: ProfileMutationCallbacks) => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation<UserProfileResponseDto, Error, UserProfileUpdateRequest>({
        mutationFn: (payload: UserProfileUpdateRequest) => updateUserProfile(payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['me'] });
            dispatch(setUserLoginInfo(data));
            toast.success('Profile saved successfully!');
            // Call custom onSuccess if provided
            callbacks?.onSuccess?.(data);
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to save profile');
            // Call custom onError if provided
            callbacks?.onError?.(error);
        },
    });
};

// Upload Avatar Hook
export const useUploadAvatar = (callbacks?: AvatarMutationCallbacks) => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation<UserProfileResponseDto, Error, File>({
        mutationFn: (file: File) => uploadUserAvatar(file),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['me'] });
            dispatch(updateAvatar(data.avatarUrl));
            toast.success('Avatar updated successfully!');
            // Call custom onSuccess if provided
            callbacks?.onSuccess?.(data);
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to upload avatar');
            // Call custom onError if provided
            callbacks?.onError?.(error);
        },
    });
};