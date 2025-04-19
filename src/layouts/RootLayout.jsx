import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthContextProvider } from "@/context";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "../components/general/NavBar";

const RootLayout = () => {
  return (
    <>
    <NavBar />
    <div className="container mx-auto">
      <ToastContainer position="bottom-left" autoClose={1500} theme="colored" />
      <AuthContextProvider>
        <Outlet />
      </AuthContextProvider>
    </div>
    </>
  );
};

export default RootLayout;
