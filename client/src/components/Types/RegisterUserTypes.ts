import * as Yup from 'yup'
export type  userRegisterValidation = Yup.ObjectSchema<{
    login: string;
    email: string;
    password: string;
    confirmPassword: string | undefined;
    tos: boolean | undefined;
}>
export interface registerFormValues {
    login: string
    email: string
    password: string
    confirmPassword: string
    tos: boolean
}