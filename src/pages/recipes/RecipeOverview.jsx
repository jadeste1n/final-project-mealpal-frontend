import React, { useEffect, useState } from 'react';
import { api } from 'utils/axiosInstance.jsx';
import SavedRecipeCard from 'src/components/recipes/SavedRecipeCard.jsx';
//import { useAuth } from '/Users/ankitbansal/Downloads/mealpal-frontend-main/src/context/index.js';



const RecipeOverview = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  //const  user  = useAuth(); 
  //const userId = user?._id;
  const userId = '67fbf2fe846c53686b5c6ffa'; // FOR TESTING THE PAGES

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/favorites/${userId}?type=recipe`);
        setRecipes(res.data);
      } catch (err) {
        console.error('Failed to fetch recipes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [userId]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Saved Recipes</h1>
      {loading && <p>Loading...</p>}
      {!loading && recipes.length === 0 && (
        <p className="text-gray-500">You haven’t saved any recipes yet.</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {recipes.map((fav, idx) => (
          <SavedRecipeCard key={idx} recipe={fav.data} />
        ))}
      </div>
    </div>
  );
};

export default RecipeOverview;
