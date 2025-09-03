export interface LoginRequest {
    email: string;
    password: string;
}

export interface ResLoginDTO {
    accessToken: string;
    user: UserLogin;
}

export interface UserLogin {
    id: string;
    email: string;
    name: string;
    avatarUrl: string;
}

export interface UserGetAccount {
    user: UserLogin;
}