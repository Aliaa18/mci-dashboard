
import { createBrowserRouter, createHashRouter, RouterProvider } from 'react-router-dom';
import  { Toaster } from 'react-hot-toast';
import './App.css';
import Home from './Components/Home/Home';
import Layout from './Components/Layout/Layout';
import Products from './Components/Products/Products';
import Brands from './Components/Brands/Brands';
import Sidebar from './Components/SideBar/Sidebar';
import Orders from './Components/Orders/Orders';
import Users from './Components/Users/Users';
import Categories from './Components/Categories/Categories';
import Subcategories from './Components/Subcategories/Subcategories';
import Catdetails from './Components/Catdetails/Catdetails';
import UserOrders from './Components/UserOrders/UserOrders';

function App() {
  let router = createHashRouter([
    {
       path:"/" ,element:<Layout/> , children:[
        { index:true , element:<Products/>},
        {path:"/products" , element:<Products/>},
        {path:"/brands" , element:<Brands/>},
        {path:"/categories" , element:<Categories/>},
        {path:"/categories/:slug" , element:<Catdetails/>},
        {path:"/subcategories" , element:<Subcategories/>},
        {path:"/orders" , element:<Orders/>},
        {path:"/users" , element:<Users/>},
        {path:"/userOrders/:user_id" , element:<UserOrders/>},
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
