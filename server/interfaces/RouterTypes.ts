import { Request } from 'express';

export interface RegisterUserObject {
    login: string
    email: string
    password: string
}
export interface RegisterUserRequest extends Request {
    body: RegisterUserObject
}
export interface CheckAvailabilityRequest extends Request {
    query: {
      type: string;
      value: string;
    };
  }

export interface LoginRequest extends Request {
    body: {
      login: string;
      password: string;
    };
  }