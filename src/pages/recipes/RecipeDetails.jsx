import React, {useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from 'utils/axiosInstance.jsx';
import {  ArrowLeft,CookingPot,NotebookPen,BookmarkPlus, Plus,Minus} from 'lucide-react';
import RecipeIngredientsTable from '../../components/recipes/RecipeIngredientsTable';

//import { useAuth } from '/Users/ankitbansal/Downloads/mealpal-frontend-main/src/context/index.js';

const RecipeDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  //const  user  = useAuth(); 
  //const userId = user?._id;
  const userId = '67fbf2fe846c53686b5c6ffa'; // FOR TESTING THE PAGES I HAVE USED THIS 
  const { recipe } = location.state || {};

  const [servings, setServings] = useState(recipe?.servings || 2);

  if (!recipe) {
    return (
      <div className="p-4 text-center">
        <p>No recipe selected.</p>
        <button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="inline-block w-4 h-4 mr-1" /> Go Back
        </button>
      </div>
    );
  }

  const scaledIngredients = recipe.ingredients.map((ing) => ({
    name: ing.name || ing,
    amount: `${((ing.amount || 1) / recipe.servings * servings).toFixed(1)} ${ing.unit || ''}`
  }));

  const handleUseRecipe = async () => {
    try {
      await api.post('/recipes/use', {
        userId,
        usedIngredients: recipe.ingredients.map(i => ({ name: i.name || i }))
      });
      alert('Ingredients deducted from fridge!');
    } catch (err) {
      console.error('Error using recipe:', err);
      alert('Failed to deduct ingredients.');
    }
  };

  const handleAddToDiary = async () => {
    try {
      await api.post(`/diary/${userId}/recipes`, {
        
        date: new Date().toISOString().slice(0, 10),
        meal: 'Dinner',
        item: {
          name: recipe.title,
          quantity: 1,
          nutrition: {
            calories: recipe.nutrition.calories || 0,
            protein: recipe.nutrition.protein || 0,
            carbs: recipe.nutrition.carbs || 0,
            fat: recipe.nutrition.fat || 0
          },
          source: 'recipe'
        }
      });
      alert('Recipe logged to diary!');
    } catch (err) {
      console.error('Error logging recipe:', err);
      alert('Failed to log to diary.');
    }
  };

  const handleSaveFavorite = async () => {
    try {
      await api.post(`/favorites/${userId}`, {
        type: 'recipe',
        data: {
          id: recipe.id,
          name: recipe.title,
          image: recipe.image,
          nutrition: recipe.nutrition,
          source: 'spoonacular'
        }
      });
      alert('Recipe saved to favorites!');
    } catch (err) {
      console.error('Error saving favorite:', err);
      alert('Failed to save favorite.');
    }
  };

  return (
    <div className="p-4">
      <button onClick={() => navigate(-1)} className="text-sm text-blue-600 mb-4 inline-flex items-center">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </button>

      <h1 className="text-2xl font-bold mb-2">{recipe.title}</h1>
      <img src={recipe.image} alt={recipe.title} className="w-full rounded mb-4" />

      <RecipeIngredientsTable
        ingredients={scaledIngredients}
        servings={servings}
        onIncrease={() => setServings((s) => s + 1)}
        onDecrease={() => setServings((s) => Math.max(1, s - 1))}
      />

      <div className="mt-6 mb-4">
        <h2 className="text-lg font-semibold mb-2">Instructions</h2>
        <ol className="list-decimal list-inside text-sm text-gray-700">
          {recipe.instructions.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={handleUseRecipe}
          className="bg-gray-600 text-white py-2 px-4 rounded flex items-center justify-center gap-2"
        >
          <CookingPot className="w-4 h-4" /> Use Recipe
        </button>
        <button
          onClick={handleAddToDiary}
          className="bg-gray-500 text-white py-2 px-4 rounded flex items-center justify-center gap-2"
        >
          <NotebookPen className="w-4 h-4" /> Add to Diary
        </button>
        <button
          onClick={handleSaveFavorite}
          className="bg-gray-500 text-white py-2 px-4 rounded flex items-center justify-center gap-2"
        >
          <BookmarkPlus className="w-4 h-4" /> Save to Favorites
        </button>
      </div>
    </div>
  );
};

export default RecipeDetails;