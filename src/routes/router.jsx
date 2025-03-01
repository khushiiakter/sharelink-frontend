import { createBrowserRouter } from "react-router-dom";
import MainLayouts from "../layouts/MainLayouts";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";



// import ErrorPage from "../pages/ErrorPage";

const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayouts></MainLayouts>,
    //   errorElement: <ErrorPage></ErrorPage>,
      children: [
        {
          path: "/",
          element: <Home></Home>,
          
        },
        {
          path: "/dashboard",
          element: <Dashboard></Dashboard>,
          
        },
        {
          path: "/login",
          element: <Login></Login>,
          
        },
        
       
      ]
    },
  ]);
export default router;