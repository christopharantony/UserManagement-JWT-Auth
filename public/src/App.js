import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Secret from './pages/Secret'
import "react-toastify/dist/ReactToastify.css";
import AdminLogin from './pages/AdminLogin'
import { useCookies } from 'react-cookie'
import AdminHome from './pages/AdminHome'
import EditUser from './pages/EditUser'
import AdminRegister from './pages/AdminRegister'

function App() {
  const [cookies] = useCookies([])
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path= "/edit" element={ <EditUser /> } />
        <Route exact path = "/adminRegister" element={ <AdminRegister /> }/>
        <Route exact path = "/adminLogin" element={ cookies.adminjwt ? <AdminHome /> : <AdminLogin /> }/>
        <Route exact path = "/admin" element={ <AdminHome /> }/>
        <Route exact path = "/register" element={ <Register /> }/>
        <Route exact path = "/login"  element={ cookies.jwt ? <Secret /> : <Login /> }/>
        <Route exact path = "/" element={ <Secret /> }/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
