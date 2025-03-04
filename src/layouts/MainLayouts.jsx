// import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Login from "../pages/Login";
import Home from "../pages/Home";
import { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";

const MainLayouts = () => {
  const { user } = useContext(AuthContext);
  return (
    <div>
      <section className="w-full fixed z-20 backdrop-blur-lg ">
        <Navbar></Navbar>
      </section>

      <div className="pt-[68px] min-h-screen">
        {!user && <Login></Login>}
        {user && <Home></Home>}
      </div>
    </div>
  );
};

export default MainLayouts;
