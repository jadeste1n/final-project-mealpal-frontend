import { Link, useLocation } from "react-router-dom";
import {
  Refrigerator,
  BookOpenCheck,
  Soup,
  User,
  Plus,
  Bookmark,
} from "lucide-react";

const BottomNav = () => {
  const { pathname } = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="dock dock-xs bg-base-300 relative">
        {/* Floating Action Button inside the dock */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
          <Link to="/search">
            <button className="btn btn-lg btn-circle bg-[#009966] text-white hover:bg-green-500 shadow-lg">
              <Plus className="w-8 h-8" />
            </button>
          </Link>
        </div>

        {/* Dock Items */}
        <Link
          to="/"
          className={`btn-ghost btn-sm rounded-btn ${
            pathname === "/" ? "dock-active  text-green-700" : ""
          }`}
        >
          <Refrigerator className="w-5 h-5" />
        </Link>
        <Link
          to="/diary"
          className={`btn-ghost rounded-btn ${
            pathname === "/diary" ? "dock-active text-green-700" : ""
          }`}
        >
          <BookOpenCheck className="w-5 h-5" />
        </Link>
        <div className="w-12" />
        <Link
          to="/recipes/create"
          className={`btn-ghost rounded-btn ${
            pathname === "/recipes/create" ? "dock-active  text-green-700" : ""
          }`}
        >
          <Soup className="w-5 h-5" />
        </Link>
        <Link
          to="/recipes"
          className={`btn-ghost rounded-btn ${
            pathname === "/recipes" ? "dock-active  text-green-700" : ""
          }`}
        >
          <Bookmark className="w-5 h-5" />
        </Link>
        {/*
        <Link
          to="/account"
          className={`btn-ghost rounded-btn ${
            pathname === "/account" ? "dock-active text-green-700" : ""
          }`}
        >
          <User className="w-5 h-5" />
        </Link>
        */}
      </div>
    </div>
  );
};

export default BottomNav;
