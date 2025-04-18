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
    const userId = user?._id;
  
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
          if (useFridge) {
            const fridgeItems = ['chicken', 'broccoli'];
            body = { ingredients: fridgeItems, refresh: true };
          } else {
            body = {
              mealType,
              maxReadyTime: Number(maxReadyTime),
              refresh: true
            };
          }
  
          const res = await api.post('/recipes/suggest', body);
          setRecipe(res.data[0]);
        } catch (err) {
          console.error('Error fetching recipe:', err);
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
              image: recipe.image || '/images/placeholder.jpg',
              nutrition: recipe.nutrition,
              source: 'spoonacular',
              ingredients: recipe.ingredients.map(i =>
                typeof i === 'string' ? i : `${i.name} ${i.amount || ''}`.trim()
              ),
              instructions: recipe.instructions
            }
          });
          toast.success('Recipe saved to favorites!');
        } catch (err) {
          console.error('Error saving favorite:', err);
          toast.error('Failed to save favorite.');
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
  
        <Link
          to="/recipes/create"
          className="mt-8 inline-flex items-center gap-2 text-white px-5 py-3 rounded-full bg-slate-700 hover:bg-slate-600 transition"
        >
          <PlusCircle className="w-5 h-5" /> Create Another Recipe
        </Link>
        <RecipeFabMenu />
      </div>
    );
  };
  
  export default SuggestedRecipe;
  