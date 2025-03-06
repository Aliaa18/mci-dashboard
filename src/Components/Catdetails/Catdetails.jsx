import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import { Link, useParams } from 'react-router-dom';
import Dialog from 'rc-dialog'
import "rc-dialog/assets/index.css";
import { DataGrid } from '@mui/x-data-grid';
import { Modal, Box, Typography, DialogActions, DialogTitle, DialogContent, TextField } from '@mui/material';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet';
import { Button } from 'bootstrap';
export default function Catdetails() {
  let [rows , setRows] = useState(null)
   let [loading , setLoading] = useState(true)
   let [visible , setVisible] = useState(false)
   let [editMode , seteditMode] = useState(false)
   const [open, setOpen] = useState(false);
   const [cat, setCat] = useState(null);
 const [selectedRow, setSelectedRow] = useState(null);
 let [formData , setFormData] = useState({
   name: '',
  })
  let {register , handleSubmit, setValue , formState:{errors} , reset } = useForm();
  const {slug} = useParams()
    async function getcat() {
      let {data} = await axios.get(`https://mcishop.vercel.app/api/v1/categories/${slug}`)
      console.log(data?.category._id);
      setCat(data?.category._id)
      console.log(cat);
      
   }
   useEffect(() => {
     getcat()
   }, [])
   
    
  let showDialog = () => setVisible(true);
  let closeDialog = () => {
     setVisible(false) 
      reset()
    };
  const handleChange = (subcat = null) =>{
   if(subcat){
     seteditMode(true)
     setFormData(subcat)
     reset(subcat)
   } else {
     seteditMode(false)
     setFormData({
       name: ' ',
       
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
     { field: 'name', headerName: 'Name', width: 300 },
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
    await updateSubcat( values.slug ,values)
    setTimeout(()=>{
     closeDialog()
    } , 1000)
   
   } else {
     console.log(values);
     addSubcat(values)
       reset()
  setTimeout(()=>{
   closeDialog()
  } , 2000)

   }
  getsubcats()
}
 
  async function getsubcats() {
  try {
    const { data } = await axios.get(`https://mcishop.vercel.app/api/v1/categories/${slug}/subcategories`);
    console.log(data);

    const transData = data?.subcategories.map((category) => ({
      slug: category.slug,
      id: category._id,
      name: category.name,
      createdAt: category.createdAt.slice(0, 19).replace('T', ' , '),
      updatedAt: category.updatedAt.slice(0, 19).replace('T', ' , '),
      
    }));

    setRows(transData);
    setLoading(false);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

     function handleDelete(subslug) {
     confirmAlert({
       title: 'Confirm to delete',
       message: 'Are you sure to delete this Subcategory?',
       buttons: [
         {
           label: 'Yes',
           onClick:async () => {
             try {
               let { data } = await axios.delete(`https://mcishop.vercel.app/api/v1/categories/${slug}/subcategories/${subslug}`);
           // console.log(data.product);
               toast.success('Subcategory deleted successfully')
              getsubcats(); 
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
     //      getsubcats()
     // } catch (error) {
     //   console.log(error);
       
     // }
    }
    async function addSubcat(data) {
     try {
       
      
       let res = await axios.post(`https://mcishop.vercel.app/api/v1/categories/${slug}/subcategories`, {
        name:data.name,
       } , {
         headers:{
          "Content-Type": "application/json"
         }
          })
         getsubcats(); 
   // console.log(data.product);
       toast.success('Subcategory Added successfully')
       
     } catch (error) {
       toast.error('Failed to Add')
       console.log(error);
     }
    }
    async function updateSubcat(subslug , data ) {
     try {
       let res = await axios.put(`https://mcishop.vercel.app/api/v1/categories/${slug}/subcategories/${subslug}` , {
        name:data.name,
        
       } , {
         headers:{
          "Content-Type": "application/json"
         }
          })
         getsubcats();
     // console.log(formData);
       toast.success('Subcategory updated successfully')
        
     } catch (error) {
       toast.error('Failed to update' , error.message)
       console.log(error);
     }
    }

  
   
    
  
  
   useEffect(()=>{
     getsubcats()
   }, [])
 
   return <>
    <Helmet>
      <title>Mci-control-Panel</title>
    </Helmet>
        <div className="container py-5 position-relative">
         
          <h2 className='text-center mb-5'>SubCategories</h2>
          <div onClick={()=>(handleChange())} className='add '>
           <i className="fa-solid fa-plus"
              style={{color:'white'}}
           ></i>
           </div>

    <Dialog
       className='di'
       visible={visible}
       onClose={closeDialog}
       title={editMode===true ? "Update subcategory " : "Add new subcategory"}
       footer={[
         <button className='btn btn-outline-danger' key="close" onClick={closeDialog}>
           Close
         </button>,
       ]}
     >
        <div className='  mx-auto '>
            <form className='p-10 ' action="" onSubmit={handleSubmit(onSunmit)}>
               <input 
               
             {...register("name" , {required:"Subcategory name is required!" ,
         maxLength:{
           value:200,
           message:"Subcategory name must be from 3 to 100 letters!"
         } , minLength:{
           value:3,
           message:"Subcategory name must be from 3 to 100 letters!"
         } 
        }) }
                className='w-100 shadow-sm p-2 mb-4 border    placeholder-white rounded' type="text" placeholder='enter subcategory name'/>
                {errors.name && <>
                    <div className="mb-3 bg-danger rounded p-1">
                       <p>{errors.name.message}</p>
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
      maxHeight: '80vh',
      width: '400px',
      bgcolor: 'background.paper',
      border: '1px solid #000',
      boxShadow: 24,
      p: 4,
      overflow: 'auto',
    }}
  >
    <Typography className="text-center text-danger" variant="h6" component="h2" gutterBottom>
      <strong>Subcategory Details</strong>
    </Typography>

    {selectedRow && (
      <div>
        <Typography className="mb-3"><strong>ID:</strong> {selectedRow.id}</Typography>
        <Typography className="mb-3"><strong>Name:</strong> {selectedRow.name}</Typography>

       
       
      </div>
    )}

    <button
      className="btn btn-danger w-100 mt-3"
      onClick={handleClose}
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
