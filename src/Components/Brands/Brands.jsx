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
export default function Brands() {
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
   logo: null,
  })
  let {register , handleSubmit, setValue , formState:{errors} , reset } = useForm();
 
  
  let showDialog = () => setVisible(true);
  let closeDialog = () => {
     setVisible(false) 
      reset()
    };
  const handleChange = (brand = null) =>{
   if(brand){
     seteditMode(true)
     setFormData(brand)
     reset(brand)
   } else {
     seteditMode(false)
     setFormData({
       name: ' ',
       logo: '',
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
    await updateBrand( values.slug ,values)
    setTimeout(()=>{
     closeDialog()
    } , 1000)
   
   } else {
     console.log(values);
     addBrand(values)
       reset()
  setTimeout(()=>{
   closeDialog()
  } , 2000)

   }
   getBrands()
}
   async function getBrands(){
   try {
     const {data} = await axios.get('https://mcishop.vercel.app/api/v1/brands')
        console.log(data);
     //setProducts(data?.products)
          const transData = data?.brands.map((brand)=>({
           slug : brand.slug,
           id: brand._id, 
           name: brand.name,
           logo:brand.logo.path,
           createdAt: brand.createdAt.slice(0,19).replace('T' , ' , '),
           updatedAt: brand.updatedAt.slice(0,19).replace('T' , ' , '),
          }))
          setRows(transData)
          setLoading(false)
   } catch (error) {
     console.error('Error fetching data:', error);
   }  
         
    }
     function handleDelete(slug) {
     confirmAlert({
       title: 'Confirm to delete',
       message: 'Are you sure to delete this Brand?',
       buttons: [
         {
           label: 'Yes',
           onClick:async () => {
             try {
               let { data } = await axios.delete(`https://mcishop.vercel.app/api/v1/brands/${slug}`);
           // console.log(data.product);
               toast.success('Brand deleted successfully')
               getBrands(); 
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
     //       getBrands()
     // } catch (error) {
     //   console.log(error);
       
     // }
    }
    async function addBrand(data) {
     try {
       const formData = new FormData();
       formData.append("name", data.name);
       if (data.logo && data.logo[0]) {
         formData.append("logo", data.logo[0]);
       }
       let res = await axios.post('https://mcishop.vercel.app/api/v1/brands' , formData , {
         headers:{
          "Content-Type": "multipart/form-data"
         }
          })
          getBrands(); 
   // console.log(data.product);
       toast.success('Brand Added successfully')
       
     } catch (error) {
       toast.error('Failed to Add')
       console.log(error);
     }
    }
    async function updateBrand(slug , data ) {
     try {
       
       const formData = new FormData();
       formData.append("name", data.name);
       if (data.logo && data.logo[0]) {
         formData.append("logo", data.logo[0]);
       }
       let res = await axios.put(`https://mcishop.vercel.app/api/v1/brands/${slug}` , formData , {
         headers:{
          "Content-Type": "multipart/form-data"
         }
          })
          getBrands();
     // console.log(formData);
       toast.success('Brand updated successfully')
        
     } catch (error) {
       toast.error('Failed to update' , error.message)
       console.log(error);
     }
    }
  
   useEffect(()=>{
      getBrands()
   }, [])
 
   return <>
    <Helmet>
      <title>Mci-control-Panel</title>
    </Helmet>
        <div className="container py-5 position-relative">
         
          <h2 className='text-center mb-5'>Brands</h2>
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
               
             {...register("name" , {required:"Product name is required!" ,
         maxLength:{
           value:200,
           message:"Product name must be from 3 to 100 letters!"
         } , minLength:{
           value:3,
           message:"Product name must be from 3 to 100 letters!"
         } , pattern:{
           value:/^[A-Za-z]+$/i,
          message:"Invalid name!"
         } 
        }) }
                className='w-100 shadow-sm p-2 mb-4 border    placeholder-white rounded' type="text" placeholder='enter product title'/>
                {errors.name && <>
                    <div className="mb-3 bg-danger rounded p-1">
                       <p>{errors.name.message}</p>
                    </div>
                </>
                 }
                  <input 
           
               {...register("logo" , {required:"Product logo is required!" ,
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
                  {errors.logo && <>
                      <div className="mb-3 bg-danger rounded p-1">
                         <p>{errors.logo.message}</p>
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
           <strong>Brand details</strong>
         </Typography>
         {selectedRow && (
           <div>
           <div className='w-100 d-flex justify-content-center align-items-center'>
                       <img loading='lazy' src={selectedRow.logo} alt={selectedRow.name} className='w-50 h-25 my-3' style={{height:''}} />

           </div>
             <Typography className='mb-3'><strong>ID:</strong> {selectedRow.id}.</Typography>
             <Typography className='mb-3'><strong>Name:</strong> {selectedRow.name}.</Typography>
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
