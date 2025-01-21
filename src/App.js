
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import  { Toaster } from 'react-hot-toast';
import './App.css';
import Home from './Components/Home/Home';
import Layout from './Components/Layout/Layout';
import Products from './Components/Products/Products';
import Brands from './Components/Brands/Brands';
import Sidebar from './Components/SideBar/Sidebar';
import Orders from './Components/Orders/Orders';
import Users from './Components/Users/Users';

function App() {
  let router = createBrowserRouter([
    {
       path:"/" ,element:<Layout/> , children:[
        { index:true , element:<Products/>},
        {path:"/products" , element:<Products/>},
        {path:"/brands" , element:<Brands/>},
        {path:"/orders" , element:<Orders/>},
        {path:"/users" , element:<Users/>},
        {path:"/sidebar" , element:<Sidebar/>},
      ]
    }
  ])

  return <>
         <RouterProvider router={router}></RouterProvider>
         <Toaster/>
  </>
}

export default App;
