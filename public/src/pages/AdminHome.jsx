/* eslint-disable array-callback-return */
import { ToastContainer, toast } from 'react-toastify';
import { InputBase, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DataGrid } from '@mui/x-data-grid';
import { useCookies } from 'react-cookie'
import Swal from 'sweetalert2';
import axios from 'axios';

function AdminHome() {
    const navigate = useNavigate();
    const [cookies, , removeCookie] = useCookies([]);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('')
    useEffect(() => {
        const verifyAdmin = async () => {
            if (!cookies.adminjwt) {
                navigate("/adminLogin");
            } else {
                const { data } = await axios.post(
                    "http://localhost:4000/admin",
                    {},
                    { withCredentials: true }
                );
                if (!data.status) {
                    removeCookie("adminjwt");
                    navigate("/adminLogin");
                } else {
                    toast(`Welcome Admin`, { theme: "dark" })
                    setUsers(data.users);
                }
            }
        };
        verifyAdmin();
        // eslint-disable-next-line
    }, [])

    const adminLogout = () => {
        removeCookie("adminjwt");
        navigate("/");
    }

    const editButton = (params) => {
        return (
            <IconButton aria-label="edit" onClick={() => {
                console.log('Edit button clicked', params.row.id);
                navigate('/edit', { state: { id: params.row.id } })
            }}>
                <EditIcon />
            </IconButton>
        )
    }

    const deleteUser = async (id) => {
        await axios.post(`http://localhost:4001/admin/delete/${id}`, {}, { withCredentials: true });
        const { data } = await axios.post(
            "http://localhost:4001/admin",
            {},
            { withCredentials: true }
        );
        setUsers(data.users);
        console.log('Deleting user', id);
    }

    const deleteButton = (params) => {
        return (
            <IconButton aria-label="delete" onClick={() => {
                console.log('delete button clicked', params.row.id);
                return (
                    Swal.fire({
                        title: 'Are you sure?',
                        text: "You won't be able to revert this!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, delete it!'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            deleteUser(params.row.id);
                            Swal.fire(
                                'Deleted!',
                                'Your file has been deleted.',
                                'success'
                            )
                        }
                    })
                )
            }} >
                <DeleteIcon />
            </IconButton>
        )
    }


    const columns = [
        { field: 'sl', headerName: 'Sl.', width: 80 },
        { field: 'name', headerName: 'Name', width: 250 },
        { field: 'email', headerName: 'Email', width: 300 },
        { field: 'mobile', headerName: 'Mobile', width: 250 },
        { field: 'edit', headerName: 'Edit', renderCell: editButton, disableClickEventBubbling: true, width: 110 },
        { field: 'delete', headerName: 'Delete', renderCell: deleteButton, disableClickEventBubbling: true, width: 110 },
    ];


    const rows = users.filter((user) => {
        if (search === '') {
            return user;
        } else if (user.name.includes(search)) {
            return user;
        }
        //return user.name.includes(search)
    }
    ).map((data, index) => (
        {
            sl: index + 1,
            id: data._id,
            name: data.name,
            email: data.email,
            mobile: data.mobile,
        }
    ))



    function DataTable() {
        return (
            <div className='userTable'>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                />
            </div>
        );
    }






    return (
        <>
            <div className='adminPrivate'>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-evenly'
                }}>
                    <h4 style={{
                        margin: '0rem 33rem 0rem 0rem',
                        float: 'left'
                    }}>Admin Home</h4>
                    <InputBase
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '1rem',
                            padding: '.5rem',
                            marginRight: '1rem',
                            height: '3.5rem'
                        }}
                        type='text'
                        onChange={(e) => {
                            setSearch(e.target.value)
                        }}
                        placeholder='Search' />
                    <button className='adminButton' onClick={adminLogout} >Log Out</button>
                </div>
                <DataTable />
            </div>
            <ToastContainer />
        </>
    )
}

export default AdminHome
