import { Request } from 'express';

export interface RegisterUserObject {
    login: string
    email: string
    password: string
}
export interface RegisterUserRequest extends Request {
    body: RegisterUserObject
}