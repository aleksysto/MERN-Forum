import React from 'react'
import {
    FormikErrors,
    FormikFormProps,
    FormikProps,
    FormikTouched,
    useFormik,
} from 'formik';
import axios from 'axios'
import * as Yup from 'yup'
import validationSchema from './validationSchema';
import { RegisterUserObject, registerFormValues } from '../Types/RegisterUserTypes';
export default function RegisterPage(): JSX.Element {
    const formik: FormikProps<registerFormValues> = useFormik<registerFormValues>({
        initialValues: {
            login: '',
            email: '',
            password: '',
            confirmPassword: '',
            tos: false
        },
        validationSchema: validationSchema,
        onSubmit: async (values: registerFormValues): Promise<void> => {
            const {login, email, password}: RegisterUserObject = values
            const reqBody: RegisterUserObject = {
                login: login,
                email: email,
                password: password
            }
            axios.post('http://localhost:4000/api/register', reqBody)
                .then((res) => {
                    console.log(res)
                })
                .catch((err): void => {
                    console.log(err)
                })
        }
    })
    return (
        <>
            <div>Create your account</div>
            <div>
                <form onSubmit={formik.handleSubmit}>
                    <label htmlFor="login">Your login: </label>
                    <input type="text" id="login" {...formik.getFieldProps('login')} />
                    {formik.touched.login && formik.errors.login ? (
                        <div>{formik.errors.login}</div>
                    ) : null}

                    <label htmlFor="email">Your email: </label>
                    <input type="text" id="email" {...formik.getFieldProps('email')} />
                    {formik.touched.email && formik.errors.email ? (
                        <div>{formik.errors.email}</div>
                    ) : null}

                    <label htmlFor="password">Your password: </label>
                    <input type="password" id="password" {...formik.getFieldProps('password')} />
                    {formik.touched.password && formik.errors.password ? (
                        <div>{formik.errors.password}</div>
                    ) : null}   

                    <label htmlFor="confirmPassword">Confirm your password: </label>
                    <input type="password" id="confirmPassword" {...formik.getFieldProps('confirmPassword')} />
                    {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                        <div>{formik.errors.confirmPassword}</div>
                    ) : null}

                    <label htmlFor="tos">Agree to Terms and Conditions</label>
                    <input type="checkbox" id="tos" {...formik.getFieldProps('tos')} />
                    {formik.touched.tos && formik.errors.tos ? (
                        <div>{formik.errors.tos}</div>
                    ) : null}

                    <button type="submit">Submit</button>
                </form>
            </div>
        </>
    )
}