import React from 'react'
import { FormikProps, useFormik } from 'formik';
import axios, { AxiosError, AxiosResponse } from 'axios'
import { EditUserObject, EditFormValues, EditFormProps } from '../interfaces/RegisterUserTypes';
import * as Yup from 'yup'
import { testLoginAvailability } from '../RegisterPage/validationSchema';
import { useUserContext } from '../contexts/UserContext';
import { UserObject } from '../interfaces/UserObjectContext';
import { NavigateFunction, useNavigate } from 'react-router-dom';
export default function EditLoginForm({ setForm, setEdited }: EditFormProps): JSX.Element {
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
                        setEdited(true)
                        setForm(null)
                    }
                    ).catch((err: AxiosError<{ message: string }>): void => {
                        console.log(err)
                        console.log(err.response?.data.message)
                    })
                })
                .catch((err: AxiosError<{ message: string }>): void => {
                    console.log(err)
                    console.log(err.response?.data.message)
                })
            formik.resetForm()
        }
    })
    return (
        <>
            <div>Change your login</div>
            <div className="AccountPageEditFormContainer">
                <form onSubmit={formik.handleSubmit}>
                    <label htmlFor="login">Your new login: </label>

                    <div className="AccountPageEditInputAndErrors">
                        <input type="text" id="login" {...formik.getFieldProps('login')} />
                        {formik.touched.login && formik.errors.login ? (
                            <div>{formik.errors.login}</div>
                        ) : null}
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
            <div><button onClick={() => setForm(null)}>Cancel</button></div>
        </>
    )
}