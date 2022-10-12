import React,{useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import axios from 'axios';

function AdminRegister() {
    const navigate = useNavigate();
    const [values,setValues] = useState({
        email:"",
        password:"",
    });

    const generateError = (error) => 
    toast.error(error,{
        position: "bottom-right"
    })

    const handleSubmit = async(e)=>{
        e.preventDefault();
        try {
            const {data} = await axios.post("http://localhost:4000/admin/adminRegister", {
                ...values
            },{
                withCredentials:true
            });
            if (data){
                if (data.errors) {
                    const {email,password} = data.errors;
                    if (email) {
                        generateError(email);
                    } else if (password) {
                        generateError(password);
                    }
                } else {
                    navigate("/");
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    }
    return (
        <div className='container'>
            <h2>Admin Register</h2>
            <form onSubmit={handleSubmit} >
                <div>
                    <label htmlFor="email">Email</label>
                    <input 
                    type="email" 
                    name="email" 
                    placeholder='Email' 
                    onChange={(e)=>{
                        setValues({...values,[e.target.name]:e.target.value})
                    }}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input 
                    type="password" 
                    name="password" 
                    placeholder='Password' 
                    onChange={(e)=>{
                        setValues({...values,[e.target.name]:e.target.value})
                    }}
                    />
                </div>
                <button type="submit">Submit</button>
                <span>
                    Already have an account? <Link to='/adminLogin' >Login</Link>
                </span>
            </form>
            <ToastContainer />
        </div>
    )
}

export default AdminRegister
