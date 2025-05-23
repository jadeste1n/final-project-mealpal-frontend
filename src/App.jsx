import "./App.css";
import { createContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AppLayout from "./layouts/AppLayout.jsx";
import RootLayout from "./layouts/RootLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";

import InventoryOverview from "./pages/inventory/InventoryOverview";
import Diary from "./pages/diary/Diary";
import Search from "./pages/search/Search";
import RecipeRoute from "./pages/recipes/RecipeRoute.jsx";
import AccountSettings from "./pages/account/AccountSettings";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/SignUp";

export const AppContext = createContext();

function App() {
  //Modal variables-------
  const [modalState, setModalState] = useState(false);
  const [content, setContent] = useState(null);

  //search variables-------
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [delayedQuery, setDelayedQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("new");
  const [addToSelection, setAddToSelection] = useState("Add To Fridge"); //state to control the selection of where to add items from -> TabSelection Component
  const [selection, setSelection] = useState(() => {
    const stored = localStorage.getItem("selection");
    return stored ? JSON.parse(stored) : []; //parse elements from local Storage or return empty array if none saved
  });
  const [favorites, setFavorites] = useState([]);

  //Diary variables
  const [entries, setEntries] = useState([]);

  // Modal utils-------
  const openModal = (content) => {
    setContent(content);
    setModalState(true);
  };

  const closeModal = () => {
    setContent(null);
    setModalState(false);
  };

  useEffect(() => {
    // Apply dark mode preference from localStorage or system default
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  //search utils-------
  //fetch all the Favorite items from backend
  const fetchFavorites = async () => {
    try {
      const res = await fetch(`${backendUrl}/favorites/items`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setFavorites(data);
      }
    } catch (err) {
      console.error("Failed to fetch favorites", err);
    }
  };

  // search effects ---------
  //save selection to localStorage (on mount + whenever variable changes)
  useEffect(() => {
    localStorage.setItem("selection", JSON.stringify(selection));
    console.log("Updated selection:", selection); //every time selection array changes, update to local Storage
  }, [selection]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  //---------------
  return (
    <AppContext.Provider
      value={{
        searchResults,
        setSearchResults,
        isLoading,
        setIsLoading,
        delayedQuery,
        setDelayedQuery,
        selectedTab,
        setSelectedTab,
        selection,
        setSelection,
        addToSelection,
        setAddToSelection,
        favorites,
        fetchFavorites,
        backendUrl,
        setContent,
        content,
        openModal,
        closeModal,
        setModalState,
        modalState,
        entries,
        setEntries,
      }}
    >
      <BrowserRouter>
        <Routes>
          {/* Root layout */}
          <Route element={<RootLayout />}>
            {/* Protected routes */}
            <Route element={<ProtectedLayout />}>
              <Route element={<MainLayout />}>
                <Route index element={<InventoryOverview />} />
                <Route path="/diary" element={<Diary />} />
                <Route path="/search" element={<Search />} />
                <Route path="/recipes/*" element={<RecipeRoute />} />
                <Route path="/account" element={<AccountSettings />} />
              </Route>
            </Route>

            {/* Public routes */}
            <Route element={<AppLayout />}>
              <Route path="/register" element={<Signup />} />
              <Route path="/login" element={<Login />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}
export default App;
