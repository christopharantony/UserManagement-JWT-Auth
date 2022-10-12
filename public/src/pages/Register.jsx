import React from 'react'
import { ToastContainer} from 'react-toastify'
import Form from '../Components/Form/Form'

function Register() {
    return (
        <div className='container'>
            <h2>Register Account</h2>
            <Form />
            <ToastContainer />
        </div>
    )
}

export default Register
