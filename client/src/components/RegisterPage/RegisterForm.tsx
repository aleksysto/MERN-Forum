import React, { useEffect } from 'react'
import { FormikProps, useFormik } from 'formik';
import axios, { AxiosError, AxiosResponse } from 'axios'
import validationSchema from './validationSchema';
import { RegisterUserObject, RegisterFormValues } from '../interfaces/RegisterUserTypes';
import { RegisterHookValues } from '../interfaces/useRegisterSuccessTypes';
import * as uuid from 'uuid';
export default function RegisterForm({ setRegisterSuccess }: RegisterHookValues): JSX.Element {
    const formik: FormikProps<RegisterFormValues> = useFormik<RegisterFormValues>({
        initialValues: {
            image: null,
            login: '',
            email: '',
            password: '',
            confirmPassword: '',
            tos: false,
            profilePicture: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values: RegisterFormValues): Promise<void> => {
            const { login, email, password, profilePicture }: RegisterUserObject = values
            const { image }: { image: File | null } = values
            const reqBody: RegisterUserObject = {
                login: login,
                email: email,
                password: password,
                profilePicture
            }
            if (image) {
                const imageId: string = uuid.v4()
                const fileExt: string = image.name.split('.').slice(-1).join('')
                const fileName: string = `${imageId}.${fileExt}`
                const formData = new FormData()
                formData.append('image', image)
                axios.post(`http://localhost:4000/api/uploadImage/${imageId}`, formData).then((res) => {
                    console.log(res)
                })
                    .catch((err) => {
                        console.log(err)
                    })
                axios.post('http://localhost:4000/api/register', { ...reqBody, profilePicture: fileName })
                    .then((res: AxiosResponse): void => {
                        setRegisterSuccess(true)
                    })
                    .catch((err: AxiosError): void => {
                        setRegisterSuccess(false)
                    })
            } else {
                axios.post('http://localhost:4000/api/register', reqBody)
                    .then((res: AxiosResponse): void => {
                        setRegisterSuccess(true)
                    })
                    .catch((err: AxiosError): void => {
                        setRegisterSuccess(false)
                    })
            }
            formik.resetForm()
        }
    })
    const [imageUrl, setImageUrl] = React.useState<string | null | ArrayBuffer>('')
    useEffect(() => {
        if (formik.values.image) {
            const reader = new FileReader()
            reader.onload = (event: ProgressEvent<FileReader>) => {
                if (event.target) {
                    setImageUrl(event.target.result)
                }
            }
            reader.readAsDataURL(formik.values.image)
        }
    }, [formik.values.image])
    return (
        <>
            <div className="RegisterFormTitle">Create your account</div>
            <div className="RegisterFormContainer">
                <form onSubmit={formik.handleSubmit} className="RegisterFormElement">
                    <div className="RegisterPageUserPfp"><img src={typeof imageUrl === 'string' ? imageUrl : undefined} alt="" /></div>
                    <div className="UploadLabel">Upload your avatar: </div>
                    <label htmlFor="image">&uarr; upload &uarr; </label>
                    <input type="file" id="image" onChange={(event) => {
                        event.preventDefault()
                        const files: FileList | null = event.currentTarget.files
                        if (files && files.length > 0) {
                            formik.setFieldValue("image", files[0])
                        }
                    }} />
                    {(
                        <div className="RegisterError">{
                            String(formik.errors.image) === 'undefined' || String(formik.errors.image) === 'image cannot be null' ?
                                '' :
                                String(formik.errors.image)
                        }</div>
                    )}


                    <label htmlFor="login">Your login: </label>
                    <div className="RegisterInputAndErrors">
                        <input type="text" id="login" {...formik.getFieldProps('login')} />
                        {formik.touched.login && formik.errors.login ? (
                            <div className="RegisterError">{formik.errors.login}</div>
                        ) : <div> </div>}
                    </div>

                    <label htmlFor="email">Your email: </label>
                    <div className="RegisterInputAndErrors">
                        <input type="text" id="email" {...formik.getFieldProps('email')} />
                        {formik.touched.email && formik.errors.email ? (
                            <div className="RegisterError">{formik.errors.email}</div>
                        ) : <div> </div>}
                    </div>


                    <label htmlFor="password">Your password: </label>
                    <div className="RegisterInputAndErrors">
                        <input type="password" id="password" {...formik.getFieldProps('password')} />
                        {formik.touched.password && formik.errors.password ? (
                            <div className="RegisterError">{formik.errors.password}</div>
                        ) : <div> </div>}
                    </div>

                    <label htmlFor="confirmPassword">Confirm your password: </label>
                    <div className="RegisterInputAndErrors">
                        <input type="password" id="confirmPassword" {...formik.getFieldProps('confirmPassword')} />
                        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                            <div className="RegisterError">{formik.errors.confirmPassword}</div>
                        ) : <div> </div>}
                    </div>


                    <label htmlFor="tos">Agree to Terms and Conditions</label>
                    <input type="checkbox" id="tos" {...formik.getFieldProps('tos')} />
                    {formik.touched.tos && formik.errors.tos ? (
                        <div className="RegisterError">{formik.errors.tos}</div>
                    ) : <div> </div>}

                    <button type="submit">Submit</button>
                </form>
            </div>
        </>
    )
}