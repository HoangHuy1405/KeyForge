// src/api/user.ts
export type Role = 'USER' | 'ADMIN' | string;

import api from './api';

export interface UserProfileResponseDto {
  id: string;
  username: string;
  fullname: string;
  email: string;
  phoneNum?: string | null;
  dob?: string | null;
  gender?: string | null;
  address?: string | null;
  description?: string | null;
  role: Role; // Primary role
  roles?: string[]; // All roles
  avatarUrl?: string | null;
  profilePhotoPublicId?: string | null;
  accountId?: string | null;
}

export interface UserProfileUpdateRequest {
  username?: string | null;
  fullname?: string | null;
  email?: string | null;
  phoneNum?: string | null;
  dob?: string | null;
  gender?: string | null;
  address?: string | null;
  description?: string | null;
}

const BASE = 'users/me';

export async function getUserProfile(): Promise<UserProfileResponseDto> {
  const data = await api.get<UserProfileResponseDto>(
    `${BASE}/profile`,
  );
  return data;
}

export async function updateUserProfile(
  payload: UserProfileUpdateRequest,
): Promise<UserProfileResponseDto> {
  const data = await api.put<UserProfileResponseDto>(
    `${BASE}/profile`,
    payload,
  );
  console.log(data);
  return data;
}

export async function uploadUserAvatar(
  file: File,
): Promise<UserProfileResponseDto> {
  const body = new FormData();
  body.append('file', file); // must match @RequestPart("file")

  const data = await api.put<UserProfileResponseDto>(
    `${BASE}/avatar`,
    body,
    {
      headers: {
        /* 'Content-Type': undefined */
      },
    },
  );
  return data;
}
