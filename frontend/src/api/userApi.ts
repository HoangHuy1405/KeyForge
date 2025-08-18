// src/api/user.ts
export type Role = 'USER' | 'ADMIN' | string;

import ApiEnvelope from './ApiEnvelope';

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

const BASE = 'http://localhost:8080/api/users';
const token = localStorage.getItem('accessToken');

export async function getUserProfile(
  userId: string,
): Promise<UserProfileResponseDto> {
  const r = await fetch(`${BASE}/${userId}/profile`, {
    credentials: 'include',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // backend must expect "Bearer <token>"
    },
  });
  if (!r.ok) throw new Error((await r.text()) || 'Failed to load profile');
  return r.json();
}

export async function updateUserProfile(
  userId: string,
  payload: UserProfileUpdateRequest,
): Promise<UserProfileResponseDto> {
  const res = await fetch(`${BASE}/${userId}/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let error;
    try {
      error = await res.json(); // try structured error
    } catch {
      error = { message: await res.text() }; // fallback to raw string
    }
    throw error;
  }
  return res.json();
}

export async function uploadUserAvatar(
  userId: string,
  file: File,
): Promise<UserProfileResponseDto> {
  const body = new FormData();
  body.append('file', file); // must match @RequestPart("file")

  const res = await fetch(`${BASE}/${userId}/avatar`, {
    method: 'PUT',
    body,
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`, // backend must expect "Bearer <token>"
    },
  });
  if (!res.ok) {
    let error;
    try {
      error = await res.json(); // try structured error
      console.log(error);
    } catch {
      error = { message: await res.text() }; // fallback to raw string
    }
    throw error;
  }
  const json = (await res.json()) as ApiEnvelope<UserProfileResponseDto>;
  console.log(json.data);
  return json.data;
}
