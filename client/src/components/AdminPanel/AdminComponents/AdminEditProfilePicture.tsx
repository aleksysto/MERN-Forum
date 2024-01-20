import React, { useState } from 'react'
import { FormikProps, useFormik } from 'formik';
import axios, { AxiosError, AxiosResponse } from 'axios'
import * as Yup from 'yup'
import * as uuid from 'uuid';
import { checkImageSize, checkImageFormat } from '../../RegisterPage/validationSchema';
import { AdminEditFormProps } from '../../interfaces/RegisterUserTypes';
import { useAdminContext } from '../../contexts/AdminContext';
import { AppAction, AppState } from '../../interfaces/AdminReducerTypes';
export default function AdminEditProfilePicture({ user, setForm, setEdited }: AdminEditFormProps): JSX.Element {
    const [state, dispatch]: [AppState, React.Dispatch<AppAction>] = useAdminContext()
    const [message, setMessage] = useState<string>('')
    const formik: FormikProps<{ image: any }> = useFormik<{ image: any }>({
        initialValues: {
            image: null,
        },
        validationSchema: Yup.object({
            image: Yup.mixed()
                .nullable()
                .test("fileSize", "File size is too large", checkImageSize)
                .test("fileType", "Unsupported file format", checkImageFormat),
        }),
        validateOnChange: false,
        onSubmit: async (values: { image: any }): Promise<void> => {
            const { image }: { image: File | null } = values
            if (image) {
                const imageId: string = uuid.v4()
                const fileExt: string = image.name.split('.').slice(-1).join('')
                const fileName: string = `${imageId}.${fileExt}`
                const formData = new FormData()
                formData.append('image', image)
                axios.post(`http://localhost:4000/api/uploadImage/${imageId}`, formData, {
                    headers: {
                        'Content-Type': 'image/png'
                    }
                })
                    .then((res) => {
                        setMessage('Image uploaded')
                    })
                    .catch((err) => {
                        setMessage('Could not upload image to server')
                    })

                axios.patch(`http://localhost:4000/api/users/id/${user._id}`, {
                    profilePicture: fileName
                }, { headers: { 'Authorization': localStorage.getItem('token') } })
                    .then((res: AxiosResponse): void => {
                        setMessage('Profile picture changed')
                        dispatch({ type: 'setMessage', payload: { message: 'Profile picture changed' } })
                        setEdited(true)
                    })
                    .catch((err: AxiosError<{ message: string }>): void => {
                        setMessage(err.response?.data.message || 'Server error')
                        dispatch({ type: 'setMessage', payload: { message: err.response?.data.message || 'Server error' } })
                    })
            }
            formik.resetForm()
        }
    })
    return (
        <>
            <div>Change your profile picture</div>
            <div>{message}</div>
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

                    <button type="submit" onClick={() => console.log(formik.errors)}>Submit</button>
                </form>
            </div>
            <div><button onClick={() => setForm(null)}>Cancel</button></div>
        </>
    )
}