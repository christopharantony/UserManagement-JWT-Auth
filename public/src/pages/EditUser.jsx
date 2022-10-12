import React,{ useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { useNavigate, useLocation } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import axios from 'axios';

function EditUser() {
    const location = useLocation();
    const navigate = useNavigate();
    const [cookies] = useCookies([]);
    const [values,setValues] = useState({
        name:"",
        mobile:"",
        email:"",
    });

    useEffect(() => {
        const id = location.state.id;
        const verifyAdmin = async () => {
            if (!cookies.adminjwt) {
                navigate("/adminLogin");
            } else {
                try {
                    // console.log("********************",id);
                    const user = await axios.get(
                        `http://localhost:4000/admin/edit/${id}`,
                        { withCredentials: true }
                    );
                    // console.log('Effect User =>',user.data);
                    setValues(user.data.user);
                } catch (error) {
                    console.log(error);
                }
            }
        };
        verifyAdmin();
        // eslint-disable-next-line
    }, [])

    // console.log('values',values);
    const generateError = (error) => 
    toast.error(error,{
        position: "bottom-right"
    })

    const handleSubmit = async(e)=>{
        const id = location.state.id;
        e.preventDefault();
        try {
            if (!values.name) {
                generateError("Name is required");
            }else if (values.name.length < 3) {
                generateError("Name must be atleast 3 characters");
            }else if (values.name.length > 20) {
                generateError("Name must be less than 20 characters");
            }else if (!values.name.match(/^[A-Za-z][A-Za-z ]*$/)) {
                generateError("Enter a valid name");
            }else if (!values.mobile) {
                generateError("Mobile is required");
            }else if (values.mobile.match(/[^0-9]/g)) {
                generateError("Enter a valid mobile number");
            }else if (values.mobile.length !== 10) {
                generateError("Mobile must be 10 characters");
            }else if (!values.email) {
                generateError("Email is required");
            }else if (!values.email.match(/^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/)) {
                generateError("Enter a valid email");
            }else{
            const {data} = await axios.post(`http://localhost:4000/admin/edituser/${id}`, {
                ...values
            },{
                withCredentials:true
            });
            if (data){
                if (data.errors) {
                    const {name, mobile, email } = data.errors;
                    console.log(mobile);
                    if (email) {
                        generateError(email);
                    } else if (name) {
                        generateError(name);
                    } else if (mobile) {
                        generateError(mobile);
                    }
                } else {
                    navigate("/admin");
                }
            }
        }
        } catch (error) {
            console.log(error.message);
        }
    }
    return (
        <div className='container'>
            <h2>Update User</h2>
            <form onSubmit={handleSubmit} >
                <div>
                    <label htmlFor="name">Name</label>
                    <input 
                    type="name" 
                    name="name"
                    value={values.name}
                    placeholder='Username' 
                    onChange={(e)=>{
                        setValues({...values,[e.target.name]:e.target.value})
                    }}
                    />
                </div>
                <div>
                    <label htmlFor="mobile">Phone Number</label>
                    <input 
                    type="name" 
                    name="mobile" 
                    value={values.mobile}
                    placeholder='9876543210' 
                    onChange={(e)=>{
                        setValues({...values,[e.target.name]:e.target.value})
                    }}
                    />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input 
                    type="name" 
                    name="email" 
                    value={values.email}
                    placeholder='Email' 
                    onChange={(e)=>{
                        setValues({...values,[e.target.name]:e.target.value})
                    }}
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
            <ToastContainer />
        </div>
    )
}

export default EditUser
