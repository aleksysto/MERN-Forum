import React from 'react'
import { FormikProps, useFormik } from 'formik';
import axios, { AxiosError, AxiosResponse } from 'axios'
import { EditFormProps } from '../interfaces/RegisterUserTypes';
import * as Yup from 'yup'
import { testEmailAvailability } from '../RegisterPage/validationSchema';
import { useUserContext } from '../contexts/UserContext';
import { UserObject } from '../interfaces/UserObjectContext';
export default function EditEmailForm({ setForm, setEdited }: EditFormProps): JSX.Element {
    const { userInfo }: { userInfo: UserObject } = useUserContext()
    const formik: FormikProps<{ email: string }> = useFormik<{ email: string }>({
        initialValues: {
            email: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .required("* Required")
                .matches(
                    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    "Invalid email address"
                )
                .test("Unique email", "Email is already taken", testEmailAvailability),
        }),
        validateOnChange: false,
        onSubmit: async (values: { email: string }): Promise<void> => {
            const email: string = values.email
            axios.patch(`http://localhost:4000/api/users/id/${userInfo._id}`, {
                email: email
            }, { headers: { 'Authorization': localStorage.getItem('token') } })
                .then((res: AxiosResponse): void => {
                    axios.post('http://localhost:4000/api/generateToken', { id: userInfo._id }).then((tokenRes: AxiosResponse<{ token: string }>): void => {
                        const token: string = tokenRes.data.token
                        localStorage.setItem("token", token)
                        setEdited(true)
                        setForm(null)
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
            <div>Change your Email</div>
            <div className="AccountPageEditFormContainer">
                <form onSubmit={formik.handleSubmit}>
                    <label htmlFor="email">Your new email: </label>
                    <div className="AccountPageEditInputAndErrors">
                        <input type="text" id="email" {...formik.getFieldProps('email')} />
                        {formik.touched.email && formik.errors.email ? (
                            <div>{formik.errors.email}</div>
                        ) : null}
                    </div>
                    <button type="submit" onClick={() => console.log(formik.errors)}>Submit</button>
                </form>
            </div>
            <div><button onClick={() => setForm(null)}>Cancel</button></div>
        </>
    )
}