import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';
import Dialog from 'rc-dialog'
import "rc-dialog/assets/index.css";
import { DataGrid } from '@mui/x-data-grid';
import { Modal, Box, Typography } from '@mui/material';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';
import toast from 'react-hot-toast';

export default function Users() {
  let [rows , setRows] = useState(null)
   const [selectedRows, setSelectedRows] = useState([]);
    let [products , setProducts] = useState(null)
    let [loading , setLoading] = useState(true)
    let [visible , setVisible] = useState(false)
    let [editMode , seteditMode] = useState(false)
    const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  let [formData , setFormData] = useState({
    name: '',
    email: '',
    role: '',
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
        name: '',
    email: '',
    role: '',
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
      { field: 'name', headerName: 'Name', width: 400 },
      { field: 'email', headerName: 'Email', width: 100 },
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
              handleDelete(params.row.slug); // Delete action
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
       console.log(values);
     await updateProduct( values.slug ,values)
     setTimeout(()=>{
      closeDialog()
     } , 1000)
    
    } else {
      console.log(values);
      addProduct(values)
        reset()
   setTimeout(()=>{
    closeDialog()
   } , 2000)

    }
 }
    async function getUsers(){
    try {
      const {data} = await axios.get('http://localhost:3000/api/v1/auth')
         console.log(data);
      //setProducts(data?.products)
           const transData = data?.users.map((user)=>({
          
            
            id: user._id, 
            name: user.name,
            email: user.email,
  
            role:user.role,
          
            createdAt: user.createdAt.slice(0,19).replace('T' , ' , '),
            updatedAt: user.updatedAt.slice(0,19).replace('T' , ' , '),
           }))
           setRows(transData)
           setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error);
    }  
          
     }
      function handleDelete(id) {
      confirmAlert({
        title: 'Confirm to delete',
        message: 'Are you sure to delete this user?',
        buttons: [
          {
            label: 'Yes',
            onClick:async () => {
              try {
                let { data } = await axios.delete(`http://localhost:3000/api/v1/users/${id}`);
            // console.log(data.product);
                toast.success('Product deleted successfully')
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
      //   let {data} = await axios.delete(`http://localhost:3000/api/v1/products/${slug}`)
      //       console.log(data);
      //       getUsers()
      // } catch (error) {
      //   console.log(error);
        
      // }
     }
     async function addProduct(data) {
      try {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("price", data.price);
        formData.append("stock", data.stock);
        formData.append("brand_id", data.brand_id);
        formData.append("description", data.description);
        if (data.cover_image && data.cover_image[0]) {
          formData.append("cover_image", data.cover_image[0]);
        }
        let res = await axios.post('http://localhost:3000/api/v1/products' , formData , {
          headers:{
           "Content-Type": "multipart/form-data"
          }
           })
    // console.log(data.product);
        toast.success('Product Added successfully')
        getUsers(); 
      } catch (error) {
        toast.error('Failed to Add')
        console.log(error);
      }
     }
     async function updateProduct(slug , data ) {
      try {
        
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("price", data.price);
        formData.append("stock", data.stock);
        formData.append("brand_id", data.brand_id);
        formData.append("description", data.description);
        if (data.cover_image && data.cover_image[0]) {
          formData.append("cover_image", data.cover_image[0]);
        }
        let res = await axios.put(`http://localhost:3000/api/v1/products/${slug}` , formData , {
          headers:{
           "Content-Type": "multipart/form-data"
          }
           })
     console.log(formData);
        toast.success('Product updated successfully')
        getUsers(); 
      } catch (error) {
        toast.error('Failed to update')
        console.log(error);
      }
     }
   
    useEffect(()=>{
       getUsers()
    }, [])
  
    return <>
         <div className="container py-5 position-relative">
          
           <h2 className='text-center mb-5'>Customers</h2>
           <div onClick={()=>(handleChange())} className='add '>
            <i className="fa-solid fa-plus"
               style={{color:'white'}}
            ></i>
            </div>

     <Dialog
        className='di'
        visible={visible}
        onClose={closeDialog}
        title={editMode===true ? "Update product " : "Add new product"}
        footer={[
          <button className='btn btn-outline-danger' key="close" onClick={closeDialog}>
            Close
          </button>,
        ]}
      >
         <div className='  mx-auto '>
             <form className='p-10 ' action="" onSubmit={handleSubmit(onSunmit)}>
                <input 
                
              {...register("title" , {required:"Product title is required!" ,
          maxLength:{
            value:200,
            message:"Product title must be from 3 to 100 letters!"
          } , minLength:{
            value:3,
            message:"Product title must be from 3 to 100 letters!"
          } , pattern:{
            value:/^[A-Za-z]+$/i,
           message:"Invalid title!"
          } 
         }) }
                 className='w-100 shadow-sm p-2 mb-4 border    placeholder-white rounded' type="text" placeholder='enter product title'/>
                 {errors.title && <>
                     <div className="mb-3 bg-danger rounded p-1">
                        <p>{errors.title.message}</p>
                     </div>
                 </>
                  }
                <input 
                
              {...register("description" , {required:"Product description is required!" ,
          maxLength:{
            value:10000,
            message:"Product description must be from 3 to 100 letters!"
          } , minLength:{
            value:3,
            message:"Product description must be from 3 to 100 letters!"
          } , pattern:{
            value:/^[A-Za-z]+$/i,
           message:"Invalid description!"
          } 
         }) }
                 className='w-100 shadow-sm p-2 mb-4 border    placeholder-white rounded' type="text" placeholder='enter product description'/>
                 {errors.description && <>
                     <div className="mb-3 bg-danger rounded p-1">
                        <p>{errors.description.message}</p>
                     </div>
                 </>
                  }
                   <input 
                
                {...register("price" , {required:"Product price is required!" ,
             min:{
              value:0.01,
              message:"Invalid price!"
            } 
           }) }
                   className='w-100 shadow-sm p-2 mb-4 border    placeholder-white rounded' type="text" placeholder='enter product price'/>
                   {errors.price && <>
                       <div className="mb-3 bg-danger rounded p-1">
                          <p>{errors.price.message}</p>
                       </div>
                   </>
                    }
                   <input 
                
                {...register("stock" , {required:"Product stock is required!" ,
             min:{
              value:0,
              message:"Invalid stock!"
            } 
           }) }
                   className='w-100 shadow-sm p-2 mb-4 border    placeholder-white rounded' type="text" placeholder='enter product stock'/>
                   {errors.stock && <>
                       <div className="mb-3 bg-danger rounded p-1">
                          <p>{errors.stock.message}</p>
                       </div>
                   </>
                    }
                   <input 
                
                {...register("brand_id" , {required:"Product brand_id is required!" ,
                  pattern:{
                    value:/^[a-f\d]{24}$/i,
                   message:"Invalid brand!"
                  } 
           }) }
                   className='w-100 shadow-sm p-2 mb-4 border    placeholder-white rounded' type="text" placeholder='enter product brand_id'/>
                   {errors.brand_id && <>
                       <div className="mb-3 bg-danger rounded p-1">
                          <p>{errors.brand_id.message}</p>
                       </div>
                   </>
                    }
                   <input 
            
                {...register("cover_image" , {required:"Product cover_image is required!" ,
                  validate: {
                    isFileTypeValid: (files) =>
                      ["image/jpeg", "image/png"].includes(files[0]?.type) ||
                      "Only JPG or PNG files are allowed",
                    // Check file size (e.g., < 2MB)
                    isFileSizeValid: (files) =>
                      files[0]?.size < 2 * 1024 * 1024 || "File size should be less than 2MB",
                     },
           }) }
                   className='w-100 shadow-sm p-2 mb-4 border    placeholder-white rounded' type="file" placeholder='choose file'/>
                   {errors.cover_image && <>
                       <div className="mb-3 bg-danger rounded p-1">
                          <p>{errors.cover_image.message}</p>
                       </div>
                   </>
                    }
                
                   <button  className='btn btn-danger  p-2 '>{editMode? "Update" :"Add"}</button>
             </form>
          </div>
          
      </Dialog>








          <div style={{ height: '30%', width: '100%' }} className='d-flex justify-content-center align-items-center mt-4'>
           
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
            <strong>Product details</strong>
          </Typography>
          {selectedRow && (
            <div>
            <div className='w-100 d-flex justify-content-center align-items-center'>
                        <img loading='lazy' src={selectedRow.cover_image} alt={selectedRow.description} className='w-50 h-25 my-3' style={{height:''}} />

            </div>
              <Typography className='mb-3'><strong>ID:</strong> {selectedRow.id}.</Typography>
              <Typography className='mb-3'><strong>Title:</strong> {selectedRow.title}.</Typography>
              <Typography className='mb-3'><strong>Price:</strong> {selectedRow.price} EGP.</Typography>
              <Typography className='mb-3'><strong>Brand:</strong> {selectedRow.brand}. </Typography>
              <Typography className='mb-3'><strong>Description:</strong> {selectedRow.description}. </Typography>
              <Typography><strong>Stock:</strong> {selectedRow.stock}. </Typography>
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
