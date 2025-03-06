import React from 'react'
import { Link } from 'react-router-dom'

export default function Sidebar() {
  return <>
    <div className='sidebar'>
          <div className='vh-100 pt-5'>
              <Link to={'/products'}>
              <div className='item w-75 ms-auto mb-5 d-flex justify-content-around align-items-center'>
                <i className=" fa-regular fa-square-check fa-lg" style={{color:" #000000"}}></i>   <h5> Products </h5>
                </div>
              </Link>
                <Link to={'/brands'}>
                <div className='item w-75 ms-auto mb-5 d-flex justify-content-around align-items-center'>
                <i className=" fa-regular fa-square-check fa-lg" style={{color:" #000000"}}></i>     <h5> Brands </h5>
                </div>
                </Link>
                <Link to={'/categories'}>
                <div className='item w-75 ms-auto mb-5 d-flex justify-content-around align-items-center'>
                <i className=" fa-regular fa-square-check fa-lg" style={{color:" #000000"}}></i>     <h5> Categories </h5>
                </div>
                </Link>
               
                
        
          </div>
        </div>
    </>
}
