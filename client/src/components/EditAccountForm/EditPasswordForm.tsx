import React from 'react'
import { FormikProps, useFormik } from 'formik';
import axios, { AxiosError, AxiosResponse } from 'axios'
import * as Yup from 'yup'
import { EditFormProps } from '../interfaces/RegisterUserTypes';
import { useUserContext } from '../contexts/UserContext';
import { UserObject } from '../interfaces/UserObjectContext';
import { NavigateFunction, useNavigate } from 'react-router-dom';
export default function EditPasswordForm({ setForm }: EditFormProps): JSX.Element {
    const navigate: NavigateFunction = useNavigate()
    const { userInfo }: { userInfo: UserObject } = useUserContext()
    const formik: FormikProps<{ password: string, confirmPassword: string }> = useFormik<{ password: string, confirmPassword: string }>({
        initialValues: {
            password: '',
            confirmPassword: ''
        },
        validationSchema: Yup.object({
            password: Yup.string()
                .required("Please provide an input to change your password")
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
                ),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("password")], "Passwords must match")
                .required("* Required"),
        }),
        validateOnChange: false,
        onSubmit: async (values: { password: string, confirmPassword: string }): Promise<void> => {
            const password: string = values.password
            axios.patch(`http://localhost:4000/api/users/id/${userInfo._id}`, {
                password: password
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
            formik.resetForm()
        }
    })
    return (
        <>
            <div>Change your password</div>
            <div>
                <form onSubmit={formik.handleSubmit}>
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

                    <button type="submit" onClick={() => console.log(formik.errors)}>Submit</button>
                </form>
            </div>
            <div><button onClick={() => setForm(null)}>Cancel</button></div>
        </>
    )
}