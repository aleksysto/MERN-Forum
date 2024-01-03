import * as Yup from 'yup'
import { userRegisterValidation } from '../Types/RegisterUserTypes'

const validationSchema: userRegisterValidation = Yup.object({
    login: Yup.string().required('* Required').min(3, 'Must be 3 characters or more').max(20, 'Must be 20 characters or less'),
    email: Yup.string().required('* Required').matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, 'Invalid email address'),
    password: Yup.string().required('* Required').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"),
    confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match').required('* Required'),
    tos: Yup.boolean().oneOf([true], 'You need to accept our Terms & Conditions')
})

export default validationSchema