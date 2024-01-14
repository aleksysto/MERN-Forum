import React from 'react'
import { FormikProps, useFormik } from 'formik';
import axios, { AxiosError, AxiosResponse } from 'axios'
import validationSchema from './validationSchema';
import { RegisterUserObject, RegisterFormValues } from '../interfaces/RegisterUserTypes';
import { RegisterHookValues } from '../interfaces/useRegisterSuccessTypes';
export default function RegisterForm({ setRegisterSuccess }: RegisterHookValues): JSX.Element {
    const formik: FormikProps<RegisterFormValues> = useFormik<RegisterFormValues>({
        initialValues: {
            image: null,
            login: '',
            email: '',
            password: '',
            confirmPassword: '',
            tos: false
        },
        validationSchema: validationSchema,
        validateOnChange: false,
        onSubmit: async (values: RegisterFormValues): Promise<void> => {
            const { login, email, password }: RegisterUserObject = values
            const { image }: { image: File | null } = values
            const reqBody: RegisterUserObject = {
                login: login,
                email: email,
                password: password
            }
            if (image) {
                const formData = new FormData()
                formData.append('image', image)
                axios.post('http://localhost:4000/api/uploadImage/2137paporRapist', formData, {
                    headers: {
                        'Content-Type': 'image/png'
                    }
                }).then((res) => {
                    console.log(res)
                })
                    .catch((err) => {
                        console.log(err)
                    })
            }
            axios.post('http://localhost:4000/api/register', reqBody)
                .then((res: AxiosResponse): void => {
                    setRegisterSuccess(true)
                })
                .catch((err: AxiosError): void => {
                    setRegisterSuccess(false)
                })
            formik.resetForm()
        }
    })
    return (
        <>
            <div>Create your account</div>
            <div>
                <form onSubmit={formik.handleSubmit}>

                    <label htmlFor="image">Your avatar: </label>
                    <input type="file" id="image" onChange={(event) => {
                        event.preventDefault()
                        const files: FileList | null = event.currentTarget.files
                        if (files && files.length > 0) {
                            formik.setFieldValue("image", files[0])
                        }
                    }} />
                    {(
                        <div>{
                            String(formik.errors.image) === 'undefined' || String(formik.errors.image) === 'image cannot be null' ?
                                '' :
                                String(formik.errors.image)
                        }</div>
                    )}

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