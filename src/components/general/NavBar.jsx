import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import LogoHorizontal from "/src/assets/logo-horizontal.svg?react";

const NavBar = () => {
  const { pathname } = useLocation();

  // Colors for the logo
  const color1 = "oklch(59.6% 0.145 163.225)";
  const color2 = "oklch(59.6% 0.145 163.225)";
  const color3 = "oklch(59.6% 0.145 163.225)";
  const color4 = "#E06138";
  const color5 = "oklch(59.6% 0.145 163.225)";

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    document.documentElement.setAttribute(
      "data-theme",
      newMode ? "dark" : "light"
    );
  };

  return (
    <div className="navbar bg-base-200 shadow-sm mb-6 sticky top-0 z-10 flex justify-between items-center px-4">
      {/* Logo */}
      <a className="text-xl bg-base-200 rounded-md h-10 flex items-center">
        <LogoHorizontal
          className="w-24"
          style={{
            "--color1": color1,
            "--color2": color2,
            "--color3": color3,
            "--color4": color4,
            "--color5": color5,
          }}
        />
      </a>

      {/* Theme toggle */}
      {pathname !== "/register" && pathname !== "/login" && (
        <div className="flex items-center">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={toggleTheme}
              className="toggle"
            />
            {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
          </label>
        </div>
      )}
    </div>
  );
};

export default NavBar;
