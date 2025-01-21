import React from 'react'
import icon from '../../Assets/icon.jpg'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return <>
  <nav class=" navbar navbar-expand-lg navbar-light bg-transparent">
   <div className="container">
   <Link class="navbar-brand" href="#">
    <div className=''>
    <img  src={icon} alt="" className='brand-img' />
    <h5 className=''>Control panel</h5>
    </div>
   </Link>
 

   </div>
</nav>
  </>
}
