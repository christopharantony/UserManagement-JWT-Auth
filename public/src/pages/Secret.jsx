import React,{useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import {useCookies} from 'react-cookie'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

function Secret() {
    const navigate = useNavigate();
    const [cookies,setCookie,removeCookie] = useCookies([]);
    useEffect(()=>{
        const verifyUser = async()=>{
            if (!cookies.jwt){
                navigate("/login");
            } else {
                const {data} = await axios.post(
                    "http://localhost:4000/",
                    {},
                    { withCredentials: true }
                    );
                    if (!data.status) {
                    removeCookie("jwt");
                    navigate("/login");
                } else {
                    toast(`Welcome ${data.user}`, { theme: "dark" })
                }
            }
        };
        verifyUser();
    },[cookies,navigate,removeCookie])
    const logout = () => {
        removeCookie("jwt");
        navigate("/login");
    }
    return (
        <>
        <div className='private'>
            <h2 style={{color:'black'}}>Your private Page</h2>
            <button className='button' onClick={logout} >Log Out</button>
        </div>
            <ToastContainer />
        </>
    )
}

export default Secret
