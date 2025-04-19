import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { api } from "../../utils/axiosInstance";
import { useAuth } from "../../context/index.js";
import SuggestedRecipeCard from "../../components/recipes/SuggestedRecipeCard";
import { Loader2, PlusCircle } from "lucide-react";
import {motion} from "framer-motion";
import { toast } from 'react-toastify';
import RecipeFabMenu from '../../components/recipes/RecipeFabMenu';

const SuggestedRecipe = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      const params = new URLSearchParams(location.search);
      const useFridge = params.get('fridge') === 'true';
      const mealType = params.get('mealType') || 'Dinner';
      const maxReadyTime = params.get('maxReadyTime') || 30;

      try {
        let body;
        let source = 'filtered';

        if (useFridge) {
          const fridgeRes = await api.get('/fridge/items');
          const fridgeItems = fridgeRes.data.map(item => item.name.toLowerCase());

          if (fridgeItems.length === 0) {
            toast.info("Your fridge is empty. Add some items first.");
            setLoading(false);
            return;
          }

          body = { ingredients: fridgeItems, refresh: true };
          source = 'fridge';
        } else {
          body = {
            mealType,
            maxReadyTime: Number(maxReadyTime),
            refresh: true
          };
        }

        const res = await api.post('/recipes/suggest', body);
        const enrichedRecipe = { ...res.data[0], source };
        setRecipe(enrichedRecipe);
      } catch (err) {
        console.error('Error fetching recipe:', err);
        toast.error('Failed to fetch recipe.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [location.search]);

  const handleSave = async () => {
    try {
      await api.post('/favorites/items', {
        type: 'recipe',
        data: {
          referenceId: recipe.id,
          name: recipe.title,
          image: recipe.image,
          nutrition: recipe.nutrition,
          source: 'spoonacular',
          ingredients: recipe.ingredients,
          instructions: recipe.instructions
        }
      });
      toast.success('Recipe saved!');
    } catch (err) {
      console.error('Error saving recipe:', err);
      toast.error('Failed to save recipe.');
    }
  };

  const handleSelect = () => {
    navigate('/recipes/details', { state: { recipe } });
  };

  return (
    <div className="p-4 min-h-screen flex flex-col items-center justify-start">
      <h1 className="text-2xl font-bold text-white mb-6">Suggested Recipe</h1>

      {loading && (
        <motion.div
          className="text-center text-gray-400 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader2 className="w-6 h-6 animate-spin inline-block mr-2" />
          Fetching a recipe...
        </motion.div>
      )}

      {!loading && recipe && (
        <SuggestedRecipeCard
          recipe={recipe}
          onSave={handleSave}
          onSelect={handleSelect}
        />
      )}

      {!loading && !recipe && (
        <p className="text-gray-400 mt-4">No recipes found. Try different filters.</p>
      )}

      <RecipeFabMenu />
    </div>
  );
};

export default SuggestedRecipe;
