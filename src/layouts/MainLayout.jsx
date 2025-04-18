import { Outlet } from "react-router-dom";
import BottomNav from "../components/general/BottomNav";
import NavBar from "../components/general/NavBar";


const MainLayout = () => {
  return (
    <>
    <NavBar />
      <div className="mx-auto w-[88vw] sm:w-[90vw] lg:max-w-[1290px] pb-20 p-4">
        <Outlet />
      </div>
      <BottomNav />
    </>
  );
};

export default MainLayout;
