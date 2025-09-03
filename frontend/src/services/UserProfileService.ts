// src/api/user.ts
export type Role = 'USER' | 'ADMIN' | string;

import api from './api';

export interface UserProfileResponseDto {
  id: string;
  username: string;
  fullname: string;
  email: string;
  phoneNum?: string | null;
  description?: string | null;
  role: Role;
  avatarUrl?: string | null; // transformed URL from backend
  profilePhotoPublicId?: string | null;
  accountId?: string | null;
}

export interface UserProfileUpdateRequest {
  username?: string | null;
  fullname?: string | null;
  email?: string | null;
  phoneNum?: string | null;
  description?: string | null;
}

const BASE = 'api/users';

export async function getUserProfile(
  userId: string,
): Promise<UserProfileResponseDto> {
  const data = await api.get<UserProfileResponseDto>(
    `${BASE}/${userId}/profile`,
  );
  return data;
}

export async function updateUserProfile(
  userId: string,
  payload: UserProfileUpdateRequest,
): Promise<UserProfileResponseDto> {
  const data = await api.put<UserProfileResponseDto>(
    `${BASE}/${userId}/profile`,
    payload,
  );
  console.log(data);
  return data;
}

export async function uploadUserAvatar(
  userId: string,
  file: File,
): Promise<UserProfileResponseDto> {
  const body = new FormData();
  body.append('file', file); // must match @RequestPart("file")

  const data = await api.put<UserProfileResponseDto>(
    `${BASE}/${userId}/avatar`,
    body,
    {
      headers: {
        /* 'Content-Type': undefined */
      },
    },
  );
  return data;
}
