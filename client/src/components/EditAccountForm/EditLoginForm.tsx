import React from 'react'
import { FormikProps, useFormik } from 'formik';
import axios, { AxiosError, AxiosResponse } from 'axios'
import { EditUserObject, EditFormValues, EditFormProps } from '../interfaces/RegisterUserTypes';
import * as Yup from 'yup'
import { testLoginAvailability } from '../RegisterPage/validationSchema';
import { useUserContext } from '../contexts/UserContext';
import { UserObject } from '../interfaces/UserObjectContext';
import { NavigateFunction, useNavigate } from 'react-router-dom';
export default function EditLoginForm({ setForm }: EditFormProps): JSX.Element {
    const navigate: NavigateFunction = useNavigate()
    const { userInfo }: { userInfo: UserObject } = useUserContext()
    const formik: FormikProps<{ login: string }> = useFormik<{ login: string }>({
        initialValues: {
            login: '',
        },
        validationSchema: Yup.object({
            login: Yup.string()
                .required('Please provide an input to change your login')
                .min(3, "Must be 3 characters or more")
                .max(20, "Must be 20 characters or less")
                .test("Unique login", "Login is already taken", testLoginAvailability)
        }),
        validateOnChange: false,
        onSubmit: async (values: { login: string }): Promise<void> => {
            const login: string = values.login
            axios.patch(`http://localhost:4000/api/users/id/${userInfo._id}`, {
                login: login
            }, { headers: { 'Authorization': localStorage.getItem('token') } })
                .then((res: AxiosResponse): void => {
                    axios.post('http://localhost:4000/api/generateToken', { id: userInfo._id }).then((tokenRes: AxiosResponse<{ token: string }>): void => {
                        const token: string = tokenRes.data.token
                        localStorage.removeItem("token")
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
                    <label htmlFor="login">Your login: </label>
                    <input type="text" id="login" {...formik.getFieldProps('login')} />
                    {formik.touched.login && formik.errors.login ? (
                        <div>{formik.errors.login}</div>
                    ) : null}

                    <button type="submit" onClick={() => console.log(formik.errors)}>Submit</button>
                </form>
            </div>
            <div><button onClick={() => setForm(null)}>Cancel</button></div>
        </>
    )
}