import React, { useState } from 'react'
import { FormikProps, useFormik } from 'formik';
import axios, { AxiosError, AxiosResponse } from 'axios'
import { AdminEditFormProps } from '../../interfaces/RegisterUserTypes';
import * as Yup from 'yup'
import { testLoginAvailability } from '../../RegisterPage/validationSchema';
import { AppAction, AppState } from '../../interfaces/AdminReducerTypes';
import { useAdminContext } from '../../contexts/AdminContext';

export default function EditLoginForm({ user, setForm, setEdited }: AdminEditFormProps): JSX.Element {
    const [state, dispatch]: [AppState, React.Dispatch<AppAction>] = useAdminContext()
    const [message, setMessage] = useState<string>('')
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
            axios.patch(`http://localhost:4000/api/users/id/${user._id}`, {
                login: login
            }, { headers: { 'Authorization': localStorage.getItem('token') } })
                .then((res: AxiosResponse): void => {
                    setMessage('Login changed')
                    dispatch({ type: 'setMessage', payload: { message: 'Login updated' } })
                    setEdited(true)
                })
                .catch((err: AxiosError<{ message: string }>): void => {
                    setMessage(err.response?.data.message || 'Server error')
                    dispatch({ type: 'setMessage', payload: { message: err.response?.data.message || 'Server error' } })
                })
            formik.resetForm()
        }
    })
    return (
        <>
            <div className="AdminEditLogin flex flex-col">
                <div>Change user login</div>
                <div>{message}</div>
                <div>
                    <form onSubmit={formik.handleSubmit}>
                        <label htmlFor="login">New login: </label>
                        <input type="text" id="login" {...formik.getFieldProps('login')} />
                        {formik.touched.login && formik.errors.login ? (
                            <div>{formik.errors.login}</div>
                        ) : null}

                        <button type="submit">Submit</button>
                    </form>
                </div>
                <div><button onClick={() => setForm(null)}>Cancel</button></div>
            </div>
        </>
    )
}