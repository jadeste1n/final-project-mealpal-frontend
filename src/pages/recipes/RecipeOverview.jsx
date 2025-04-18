import React, { useEffect, useState } from "react";
import { api } from "@/utils/axiosInstance.jsx";
import SavedRecipeCard from "@/components/recipes/SavedRecipeCard.jsx";
import { Bookmark, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import RecipeFabMenu from "@/components/recipes/RecipeFabMenu.jsx";
import { toast } from "react-toastify";
//import { useAuth } from '/Users/ankitbansal/Downloads/mealpal-frontend-main/src/context/index.js';

const RecipeOverview = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/favorites/items?type=recipe`);
      setRecipes(res.data);
    } catch (err) {
      console.error('Failed to fetch recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (favoriteId) => {
    try {
      await api.delete(`/favorites/${favoriteId}`);
      toast.success('Recipe removed from favorites.');
      setRecipes((prev) => prev.filter((f) => f._id !== favoriteId));
    } catch (err) {
      console.error('Error removing favorite:', err);
      toast.error('Failed to remove recipe.');
    }
  };

  return (
    <div className="p-4 min-h-screen max-w-6xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Bookmark className="w-6 h-6 text-white" />
        <h1 className="text-2xl font-bold text-white">Your Saved Recipes</h1>
      </div>

      {loading && (
        <div className="flex justify-center items-center mt-10">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-400">Loading recipes...</span>
        </div>
      )}

      {!loading && recipes.length === 0 && (
        <p className="text-center text-gray-400 mt-8">No saved recipes found.</p>
      )}

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {recipes.map((fav) => (
          <SavedRecipeCard
            key={fav._id}
            recipe={fav.data}
            favoriteId={fav._id}
            onRemove={handleRemove}
          />
        ))}
      </motion.div>

      <RecipeFabMenu />
    </div>
  );
};

export default RecipeOverview;
