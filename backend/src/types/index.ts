export interface JwtPayload {
  userId: string;
  email: string;
}

export interface ICreateUserProperties {
  username: string;
  email: string;
  password: string;
}

export interface ILoginUserProperties {
  email: string;
  password: string;
}

export interface IToken {
  access_token: string;
  refresh_token: string;
}

export interface IUser {
  id: string;
  username: string;
  email: string;
}

export interface ILoginUserResponse {
  token: IToken;
  user: IUser;
}

export type WebSocket_IUser = IUser[];

export type WEBSOCKET_EVENTS = 'all_users';
