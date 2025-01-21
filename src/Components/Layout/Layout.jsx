import React from 'react'
import Navbar from '../Navbar/Navbar'
import { Outlet } from 'react-router-dom'
import Sidebar from '../SideBar/Sidebar'

export default function Layout() {
  return <>
  
  <Navbar/>
  <div className='d-flex'>
  <Sidebar/> 
  <Outlet></Outlet>
  </div>
  
  </>
}
