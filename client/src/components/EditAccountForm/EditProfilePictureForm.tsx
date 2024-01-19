import React from 'react'
import { FormikProps, useFormik } from 'formik';
import axios, { AxiosError, AxiosResponse } from 'axios'
import * as Yup from 'yup'
import * as uuid from 'uuid';
import { checkImageSize, checkImageFormat } from '../RegisterPage/validationSchema';
import { EditFormProps } from '../interfaces/RegisterUserTypes';
import { useUserContext } from '../contexts/UserContext';
import { UserObject } from '../interfaces/UserObjectContext';
import { NavigateFunction, useNavigate } from 'react-router-dom';
export default function EditProfilePictureForm({ setForm }: EditFormProps): JSX.Element {
    const { userInfo }: { userInfo: UserObject } = useUserContext()
    const navigate: NavigateFunction = useNavigate()
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
                const fileType: string = image.type.split("/")[1]
                const fileExt: string = image.name.split('.').slice(-1).join('')
                const fileName: string = `${imageId}.${fileExt}`
                const formData = new FormData()
                formData.append('image', image)
                axios.post(`http://localhost:4000/api/uploadImage/${imageId}`, formData, {
                    headers: {
                        'Content-Type': 'image/png'
                    }
                }).then((res) => {
                    console.log(res)
                })
                    .catch((err) => {
                        console.log(err)
                    })

                axios.patch(`http://localhost:4000/api/users/id/${userInfo._id}`, {
                    profilePicture: fileName
                }, { headers: { 'Authorization': localStorage.getItem('token') } })
                    .then((res: AxiosResponse): void => {
                        axios.post('http://localhost:4000/api/generateToken', { id: userInfo._id }).then((tokenRes: AxiosResponse<{ token: string }>): void => {
                            const token: string = tokenRes.data.token
                            localStorage.setItem("token", token)
                            setForm(null)
                            navigate(0)
                        }
                        ).catch((err: AxiosError<{ message: string }>): void => {
                            console.log(err.response?.data.message)
                        })
                    })
                    .catch((err: AxiosError<{ message: string }>): void => {
                        console.log(err.response?.data.message)
                    })
            }
            formik.resetForm()
        }
    })
    return (
        <>
            <div>Change your profile picture</div>
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