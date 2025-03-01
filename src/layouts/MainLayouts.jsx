import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayouts = () => {
  return (
    <div>
      <section className="w-full fixed z-20 backdrop-blur-lg ">
        <Navbar></Navbar>
      </section>

      <div className="pt-[68px] min-h-screen">
          <Outlet />
        </div>
    </div>
  );
};

export default MainLayouts;
