import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';
import Dialog from 'rc-dialog'
import "rc-dialog/assets/index.css";
import { DataGrid } from '@mui/x-data-grid';
import { Modal, Box, Typography } from '@mui/material';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet';
export default function Users() {
  let roles =['USER' , "ADMIN"]
  let [rows , setRows] = useState(null)
  const [selectedRows, setSelectedRows] = useState([]);
   let [products , setProducts] = useState(null)
   let [loading , setLoading] = useState(true)
   let [visible , setVisible] = useState(false)
   let [editMode , seteditMode] = useState(false)
   const [open, setOpen] = useState(false);
 const [selectedRow, setSelectedRow] = useState(null);
 let [formData , setFormData] = useState({
   CompanyName:'',
   email: '',
   password:'',
   role: "",
   phone:''
  })
  let {register , handleSubmit, setValue , formState:{errors} , reset } = useForm();
 
  
  let showDialog = () => setVisible(true);
  let closeDialog = () => {
     setVisible(false) 
      reset()
    };
  const handleChange = (user = null) =>{
   if(user){
     seteditMode(true)
     setFormData(user)
     reset(user)
   } else {
     seteditMode(false)
     setFormData({
      companyName:'',
      email: '',
      password:'',
      role: "",
      phone:''
     });
     reset()
   }
   showDialog()
}
 const handleOpen =  (row) => {
   setSelectedRow(row);
   setOpen(true);
 };

 const handleClose = () => {
   setOpen(false);
   setSelectedRow(null);
 };
   const columns = [
     { field: 'id', headerName: 'ID', width: 100 },
     { field: 'companyName', headerName: 'Company-Name', width: 200 },
     { field: 'email', headerName: 'Email', width: 400 },
     { field: 'role', headerName: 'Role', width: 200 },
     { field: 'createdAt', headerName: 'CreatedAt', width: 200 },
     { field: 'updatedAt', headerName: 'UpdatedAt', width: 200 },
     {
       field: 'actions',
       headerName: 'Actions',
       width: 200,
       sortable: false,
       renderCell: (params) => (
         <div style={{ display: 'flex', gap: '10px' }}>
           <i
           className='fa-solid fa-pen fa-lg pt-4 '
           onClick={(event) => {
             event.stopPropagation(); // Prevent row click event
            handleChange(params.row) // Delete action
           }}
             style={{
               background: '',
               color: '#011222',
               border: 'none',
               padding: '5px 10px',
               cursor: 'pointer',
             }}
           >
         
           </i>
           <i
           className='fa-solid fa-trash-can fa-lg pt-4 ps-4'
           onClick={(event) => {
             event.stopPropagation(); // Prevent row click event
             handleDelete(params.row.id); // Delete action
           }}
             style={{
               background: '',
               color: 'brown',
               border: 'none',
              // padding: 'auto',
               cursor: 'pointer',
             }}
           >
             
           </i>
         </div>
       ),
     },
   ];
   
 

async function onSunmit (values){
   if(editMode===true ){
      console.log(values.id);
    await updateUser( values.id ,values)
    setTimeout(()=>{
     closeDialog()
    } , 1000)
   
   } else {
     console.log(values);
     addUser(values)
       reset()
  setTimeout(()=>{
   closeDialog()
  } , 2000)

   }
   getUsers()
}
   async function getUsers(){
   try {
     const {data} = await axios.get('http://localhost:3000/api/v1/auth')
        // console.log(data);
     //setProducts(data?.products)
          const transData = data?.users.map((user)=>({
          
           id: user._id, 
           companyName: user.companyName,
           email:user.email,
           password:user.password,
           role:user.role,
           phone:user.phone,
           createdAt: user.createdAt.slice(0,19).replace('T' , ' , '),
           updatedAt: user.updatedAt.slice(0,19).replace('T' , ' , '),
          }))
          setRows(transData)
          setLoading(false)
   } catch (error) {
     console.error('Error fetching data:', error);
   }  
         
    }
     function handleDelete(userId) {
     confirmAlert({
       title: 'Confirm to delete',
       message: 'Are you sure to delete this User?',
       buttons: [
         {
           label: 'Yes',
           onClick:async () => {
             try {
               let { data } = await axios.delete(`http://localhost:3000/api/v1/auth/${userId}`);
           // console.log(data.product);
               toast.success('User deleted successfully')
               getUsers(); 
             } catch (error) {
               toast.error('Failed to deleted')
               console.log(error);
             }
           }
         },
         {
           label: 'No',
           onClick: () => {}
         }
       ]
     });


     // try {
     //   let {data} = await axios.delete(`https://mcishop.vercel.app/api/v1/products/${slug}`)
     //       console.log(data);
     //       getUsers()
     // } catch (error) {
     //   console.log(error);
       
     // }
    }
    async function addUser(data) {
     try {
       
       let res = await axios.post('http://localhost:3000/api/v1/auth/signup' , {
        companyName:data.companyName,
        email:data.email,
        password:data.password,
        phone:data.phone,
        role:data.role
       } , {
         headers:{
          "Content-Type": "application/json"
         }
          })
          getUsers(); 
   // console.log(data.product);
       toast.success('User Added successfully')
       
     } catch (error) {
       toast.error('Failed to Add')
       console.log(error);
       console.log(error?.response.data.message);
       if (error?.response.data.message.includes("E11000 duplicate key error") )
          toast.error('User already exist!')
     }
    }
    async function updateUser(user_id , data ) {
     try {
       let res = await axios.put(`http://localhost:3000/api/v1/auth/${user_id}` , {
        companyName:data.companyName,
        email:data.email,
        phone:data.phone,
        password:data.password,
        role:data.role
       } , {
         headers:{
          "Content-Type": "application/json"
         }
          })
          getUsers();
     // console.log(formData);
       toast.success('User data updated successfully')
        
         
     } catch (error) {
       toast.error('Failed to update' , error.message)
       console.log(error);
       if (error?.response.data.message.includes("E11000 duplicate key error") )
        toast.error('User already exist!') 
     }
    }
   
    
  
   useEffect(()=>{
      getUsers()
   }, [])
 
   return <>
    <Helmet>
      <title>Mci-control-Panel</title>
    </Helmet>
        <div className="container py-5 position-relative">
         
          <h2 className='text-center mb-5'>Users</h2>
          <div onClick={()=>(handleChange())} className='add '>
           <i className="fa-solid fa-plus"
              style={{color:'white'}}
           ></i>
           </div>

    <Dialog
       className='di'
       visible={visible}
       onClose={closeDialog}
       title={editMode===true ? "Update user data " : "Add user"}
       footer={[
         <button className='btn btn-outline-danger' key="close" onClick={closeDialog}>
           Close
         </button>,
       ]}
     >
        <div className='  mx-auto '>
            <form className='p-10 ' action="" onSubmit={handleSubmit(onSunmit)}>
            <input 
  {...register("companyName", {
    required: "Company name is required!",
    maxLength: {
      value: 100,
      message: "Company name must be from 3 to 100 letters!"
    },
    minLength: {
      value: 3,
      message: "Company name must be from 3 to 100 letters!"
    },
    pattern: {
      value: /^[A-Za-z\s]+$/i, // Allows spaces in names
      message: "Invalid name! Only letters are allowed."
    }
  })}
  className='w-100 shadow-sm p-2 mb-4 border placeholder-white rounded' 
  type="text" 
  placeholder='Enter company name'
/>
{errors.companyName && (
  <div className="mb-3 bg-danger rounded p-1">
    <p>{errors.companyName.message}</p>
  </div>
)}

<input 
  {...register("email", {
    required: "Email is required!",
    pattern: {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net)$/i, // Matches only `.com` or `.net`
      message: "Invalid email! Must be a valid .com or .net email."
    }
  })}
  className='w-100 shadow-sm p-2 mb-4 border placeholder-white rounded' 
  type="text" 
  placeholder='Enter the email'
/>
{errors.email && (
  <div className="mb-3 bg-danger rounded p-1">
    <p>{errors.email.message}</p>
  </div>
)}
<input 
  {...register("phone", {
    required: "Phone number is required!",
    pattern: {
      value: /^01[0125][0-9]{8}$$/, 
      message: "Invalid number! Phone number must be a valid Egyptian number (e.g. 010xxxxxxxx)."
    }
  })}
  className='w-100 shadow-sm p-2 mb-4 border placeholder-white rounded' 
  type="text" 
  placeholder='Enter the phone number'
/>
{errors.phone && (
  <div className="mb-3 bg-danger rounded p-1">
    <p>{errors.phone.message}</p>
  </div>
)}

<input 
  {...register("password", {
    required: "Password is required!",
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i,
      message: "Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character."
    }
  })}
  className='w-100 shadow-sm p-2 mb-4 border placeholder-white rounded' 
  type="password" // Change to password for security
  placeholder='Enter the password'
/>
{errors.password && (
  <div className="mb-3 bg-danger rounded p-1">
    <p>{errors.password.message}</p>
  </div>
)}


<select
  {...register("role")}
  className="w-100 shadow-sm p-2 mb-4 border placeholder-white rounded"
>
               <option value="">Select a role</option>
  {roles?.map((role) => (
    <option key={role} value={role}>
      {role}
    </option>
  ))}
</select>
 {errors.role && <>
                       <div className="mb-3 bg-danger rounded p-1">
                          <p>{errors.role.message}</p>
                       </div>
                   </>
                    }
                  
               
                  <button  className='btn btn-danger  p-2 '>{editMode? "Update" :"Add"}</button>
            </form>
         </div>
         
     </Dialog>

         <div style={{ height: '50%', width: '100%' }} className='d-flex justify-content-center align-items-center mt-4'>
          
         <div className='' style={{ height: '100%', width: '80%' , cursor:'pointer'}}>
     <DataGrid 
     rows={rows} 
     columns={columns}
      checkboxSelection
     // onSelectionModelChange={(newSelection) => handleSelectionChange(newSelection)}
     onRowClick={(params) => handleOpen(params.row)}
     />
     <Modal open={open} onClose={handleClose}>
       <Box
         sx={{
           position: 'absolute',
           top: '50%',
           left: '50%',
           transform: 'translate(-50%, -50%)',
          // width: 400,
          maxHeight: '80vh',
           bgcolor: 'background.paper',
           border: '1px solid #000',
           boxShadow: 24,
           p: 4,
           overflow: 'auto',
         }}
       >
         <Typography className='text-center text-danger' variant="h6" component="h2" gutterBottom>
           <strong>User</strong>
         </Typography>
         {selectedRow && (
           <div>
             <Typography className='mb-3'><strong>ID:</strong> {selectedRow.id}.</Typography>
             <Typography className='mb-3'><strong>Company:</strong> {selectedRow.companyName}.</Typography>
             <Typography className='mb-3'><strong>Email:</strong> {selectedRow.email}.</Typography>
             <Typography className='mb-3'><strong>Phone:</strong> {selectedRow.phone}.</Typography>
             <Typography className='mb-3'><strong>Role:</strong> {selectedRow.role}.</Typography>
             <Typography className='mb-3'><Link className='text-danger fw-bold' to={`/userOrders/${selectedRow.id}`}>🛒User Orders</Link> </Typography>
              
           </div>
         )}

         <button
       className='btn btn bg-danger'
           onClick={handleClose}
           style={{
             marginTop: '20px',
             padding: '10px 20px',
             color: 'white',
             border: 'none',
             cursor: 'pointer',
           }}
         >
           Close
         </button>
       </Box>
     </Modal>
   </div>
         </div>
        </div>
   </>
}
