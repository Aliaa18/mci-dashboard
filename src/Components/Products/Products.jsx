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
import { Helmet } from 'react-helmet';


export default function Products({ existingImages = [] }) {
   let [rows , setRows] = useState(null)
    let [loading , setLoading] = useState(true)
    let [visible , setVisible] = useState(false)
    let [editMode , seteditMode] = useState(false)
    let [brands , setBrands] = useState(null)
    let [cats , setCats] = useState(null)
    
    const [selectedImages, setSelectedImages] = useState([]);
    useEffect(() => {
      if (editMode && existingImages) {
        setSelectedImages(existingImages); // Keep existing images in state
      }
    }, [editMode, existingImages]);
  
    const handleImageChange = (event) => {
      const files = Array.from(event.target.files);
      setSelectedImages(files);
    };
    const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  let [formData , setFormData] = useState({
    title: '',
    price: '',
    brand_id: '',
    subcategory_id:'',
    stock: '',
    description: ' ',
    features:' ',
    apps:'',
    cover_image: null,
    images:[]
   })
   let {register , handleSubmit, setValue , formState:{errors} , reset } = useForm();
  
   
   let showDialog = () => setVisible(true);
   let closeDialog = () => {
      setVisible(false) 
       reset()
     };
   const handleChange = (product = null) =>{
    if(product){
      seteditMode(true)
      setFormData(product)
      reset(product)
    } else {
      seteditMode(false)
      setFormData({
        title: '',
        price: '',
        brand_id: '',
        stock: '',
        description: ' ',
        features:' ',
        cover_image: '',
        apps:'',
        images:[],
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
      { field: 'title', headerName: 'Title', width: 400 },
      { field: 'price', headerName: 'Price', width: 100 },
      { field: 'brand', headerName: 'Brand', width: 200 },
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
      //  console.log(values);
     await updateProduct( values.slug ,values)
     setTimeout(()=>{
      closeDialog()
     } , 1000)
    
    } else {
      // console.log(values);
      addProduct(values)
       
   setTimeout(()=>{
    closeDialog()
   } , 2000)

    }
 }
    async function getProducts(){
    try {
      const {data} = await axios.get('https://mcishop.vercel.app/api/v1/products')
         
      //setProducts(data?.products)
           const transData = data?.products.map((pro)=>({
          
            slug : pro.slug,
            id: pro.id, 
            title: pro.title,
            price: pro.price,
            apps: pro.apps,
            brand_id:pro.brand_id?._id || '--',
            subcategory_id:pro.subcategory_id?._id || '--',
            brand: pro.brand_id?.name || '--',
            category: pro.category_id?.name || '--',
            subcategory: pro.subcategory_id?.name || '--',
            stock:pro.stock,
            description:pro.description,
            features:pro.features,
            cover_image:pro.cover_image.path,
            images:pro.images,
            createdAt: pro.createdAt.slice(0,19).replace('T' , ' , '),
            updatedAt: pro.updatedAt.slice(0,19).replace('T' , ' , '),
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
        message: 'Are you sure to delete this product?',
        buttons: [
          {
            label: 'Yes',
            onClick:async () => {
              try {
                let { data } = await axios.delete(`https://mcishop.vercel.app/api/v1/products/${slug}`);
            // console.log(data.product);
                toast.success('Product deleted successfully')
                getProducts(); 
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
      //       getProducts()
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
        formData.append("subcategory_id", data.subcategory_id);
        formData.append("apps", data.apps);
        formData.append("description", data.description);
        formData.append("features", data.features);
        if (data.cover_image && data.cover_image[0]) {
          formData.append("cover_image", data.cover_image[0]);
        }
        // console.log("Images Data:", data);
        //  console.log("Type of images:", typeof data.images);

         if (data.images instanceof FileList) {
          Array.from(data.images).forEach((image, index) => {
            formData.append(`images`, image);
          });
        }
        let res = await axios.post('https://mcishop.vercel.app/api/v1/products' , formData , {
          headers:{
           "Content-Type": "multipart/form-data"
          }
           })
    // console.log(data.product);
        toast.success('Product Added successfully')
        
        getProducts(); 
      } catch (error) {
        toast.error('Failed to Add')
        console.log(error);
        if (error?.response.data.message.includes("E11000 duplicate key error") )
          toast.error('Product already exist!')
      }
     }
     async function updateProduct(slug , data ) {
      try {
        
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("price", data.price);
        formData.append("stock", data.stock);
        formData.append("brand_id", data.brand_id);
        formData.append("subcategory_id", data.subcategory_id);
        formData.append("apps", data.apps);
        formData.append("description", data.description);
        formData.append("features", data.features);
        if (data.cover_image && data.cover_image[0]) {
          formData.append("cover_image", data.cover_image[0]);
        }
        if (data.images instanceof FileList) {
          Array.from(data.images).forEach((image, index) => {
            formData.append(`images`, image);
          });
        }
        let res = await axios.put(`https://mcishop.vercel.app/api/v1/products/${slug}` , formData , {
          headers:{
           "Content-Type": "multipart/form-data"
          }
           })
    //  console.log(formData);
        toast.success('Product updated successfully')
        getProducts(); 
      } catch (error) {
        toast.error('Failed to update')
        console.log(error);
        if (error?.response.data.message.includes("E11000 duplicate key error") )
          toast.error('Product already exist!')
      }
     }

     async function getBrands(){
      try {
        const {data} = await axios.get('https://mcishop.vercel.app/api/v1/brands')
           
        setBrands(data?.brands)
            //  const transData = data?.brands.map((brand)=>({
            
            //   slug : brand.slug,
            //   id: brand.id, 
            //   name: brand.name,
            //  }))
             
             setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error);
      }  
            
       }
     async function getCategories(){
      try {
        const {data} = await axios.get('https://mcishop.vercel.app/api/v1/categories')
          
        setCats(data?.categories)
            //  const transData = data?.brands.map((brand)=>({
            
            //   slug : brand.slug,
            //   id: brand.id, 
            //   name: brand.name,
            //  }))
             
             setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error);
      }  
            
       }
     
   
    useEffect(()=>{
       getProducts()
    }, [])
    useEffect(()=>{
       getBrands()
    }, [brands])
    useEffect(()=>{
       getCategories()
    }, [cats])
  
    return <>
    <Helmet>
      <title>Mci-control-Panel</title>
    </Helmet>
         <div className="container py-5 position-relative">
          
           <h2 className='text-center mb-5'>Products</h2>
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
            value:1000,
            message:"Product title must be from 3 to 1000 letters!"
          } , minLength:{
            value:3,
            message:"Product title must be from 3 to 100 letters!"
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
                
              {...register("apps" ) }
                 className='w-100 shadow-sm p-2 mb-4 border    placeholder-white rounded' type="text" placeholder='enter product applications'/>
                 {errors.apps && <>
                     <div className="mb-3 bg-danger rounded p-1">
                        <p>{errors.apps.message}</p>
                     </div>
                 </>
                  }
                <input 
                
              {...register("features" , { required:"Product description is required!" ,
          maxLength:{
            value:10000,
            message:"Product features must be from 3 to 100 letters!"
          } , minLength:{
            value:3,
            message:"Product features must be from 3 to 100 letters!"
          }
         }) }
                 className='w-100 shadow-sm p-2 mb-4 border    placeholder-white rounded' type="text" placeholder='enter product features (optional*)'/>
                 {errors.features && <>
                     <div className="mb-3 bg-danger rounded p-1">
                        <p>{errors.features.message}</p>
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
                 <select
  {...register("brand_id", {
    required: "Product brand_id is required!",
    pattern: {
      value: /^[a-f\d]{24}$/i,
      message: "Invalid brand!",
    },
  })}
  className="w-100 shadow-sm p-2 mb-4 border placeholder-white rounded"
>
  <option value="">Select a Brand</option>
  {brands?.map((brand) => (
    <option key={brand._id} value={brand._id}>
      {brand.name}
    </option>
  ))}
</select>
 {errors.brand_id && <>
                       <div className="mb-3 bg-danger rounded p-1">
                          <p>{errors.brand_id.message}</p>
                       </div>
                   </>
                    }
                 <select
  {...register("subcategory_id", {
    required: "Product subcategory_id is required!",
    pattern: {
      value: /^[a-f\d]{24}$/i,
      message: "Invalid brand!",
    },
  })}
  className="w-100 shadow-sm p-2 mb-4 border placeholder-white rounded"
>
  <option value="">Select a Subcategory</option>
  {cats?.map((cat) => (
          cat.subcategories.map((subcat)=>(
            <option key={subcat._id} value={subcat._id}>
            {subcat.name}
          </option>
          ))
  ))}
</select>
 {errors.subcategory_id && <>
                       <div className="mb-3 bg-danger rounded p-1">
                          <p>{errors.subcategory_id.message}</p>
                       </div>
                   </>
                    }
                   
                   <input 
            
                {...register("cover_image" , {required:"Product cover_image is required!" ,
                  validate: {
                    isFileTypeValid: (files) =>
                      ["image/jpeg", "image/png" , "image/webp"].includes(files[0]?.type) ||
                      "Only JPG, PNG or WEBP files are allowed",
                    // Check file size (e.g., < 2MB)
                    isFileSizeValid: (files) =>
                      files[0]?.size < 2 * 1024 * 1024 || "File size should be less than 2MB",
                     },
           }) }
                   className='w-100 shadow-sm p-2 mb-4 border    placeholder-white rounded'
                    type="file" placeholder='choose file'
                    onChange={handleImageChange}
                    />
                   {errors.cover_image && <>
                       <div className="mb-3 bg-danger rounded p-1">
                          <p>{errors.cover_image.message}</p>
                       </div>
                   </>
                    }
                   <input
  type="file"
  multiple
  {...register("images", {
    required: false,
    validate: {
      isFileTypeValid: (files) =>
        files.length > 0 &&
        Array.from(files).every(
          (file) => ["image/jpeg", "image/png" , "image/webp"].includes(file.type)
        ) || "Only JPG , PNG or WEBP files are allowed",

      isFileSizeValid: (files) =>
        files.length > 0 &&
        Array.from(files).every((file) => file.size < 2 * 1024 * 1024) ||
        "Each file size should be less than 2MB",
    },
  })}
  onChange={(e) => console.log(e.target.files)}
  className="w-100 shadow-sm p-2 mb-4 border placeholder-white rounded"
/>




                
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
             <h5> Product Images:</h5>
             <div className='w-100 d-flex justify-content-between align-items-center mb-3'>
            {selectedRow.images?.map((image)=>(
              <div className=' d-flex justify-content-center align-items-center  '>
              <img loading='lazy' src={image.image_id.path} alt={selectedRow.description} className='w-50' style={{height:''}} />
                </div>
            ))}
            </div>
              <Typography className='mb-3'><strong>ID:</strong> {selectedRow.id}.</Typography>
              <Typography className='mb-3'><strong>Title:</strong> {selectedRow.title}.</Typography>
              <Typography className='mb-3'><strong>Price:</strong> {selectedRow.price} EGP.</Typography>
              <Typography className='mb-3'><strong>Brand:</strong> {selectedRow.brand}. </Typography>
              <Typography className='mb-3'><strong>Category:</strong> {selectedRow.category}. </Typography>
              <Typography className='mb-3'><strong>Subcategory:</strong> {selectedRow.subcategory}. </Typography>
              <Typography className='mb-3'><strong>Description:</strong> {selectedRow.description}. </Typography>
              <Typography className='mb-3'><strong>Features:</strong> {selectedRow.features}. </Typography>
              <Typography className='mb-3'><strong>Applications:</strong> {selectedRow.apps}. </Typography>
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


