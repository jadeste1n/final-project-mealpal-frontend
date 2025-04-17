import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "@/utils/axiosInstance.jsx";
import {
  ArrowLeft,
  CookingPot,
  NotebookPen,
  BookmarkPlus,
  Plus,
  Minus,
} from "lucide-react";
//import { useAuth } from '/Users/ankitbansal/Downloads/mealpal-frontend-main/src/context/index.js';

const RecipeDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  //const  user  = useAuth();
  //const userId = user?._id;
  const userId = "67fbf2fe846c53686b5c6ffa"; // FOR TESTING THE PAGES I HAVE USED THIS
  const { recipe } = location.state || {};

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
  const handleUseRecipe = async () => {
    try {
      await api.post("/recipes/use", {
        userId,
        usedIngredients: recipe.ingredients.map((name) => ({ name })),
      });
      alert("Ingredients deducted from fridge!");
    } catch (err) {
      console.error("Error using recipe:", err);
      alert("Failed to deduct ingredients.");
    }
  };
  const handleAddToDiary = async () => {
    try {
      await api.post(`/diary/${userId}/recipe`, {
        date: new Date().toISOString().slice(0, 10),
        meal: "dinner",
        recipe: {
          title: recipe.title,
          nutrition: recipe.nutrition,
        },
      });
      alert("Recipe logged to diary!");
    } catch (err) {
      console.error("Error logging recipe:", err);
      alert("Failed to log to diary.");
    }
  };
  const handleSaveFavorite = async () => {
    try {
      await api.post(`/favorites/${userId}`, {
        type: "recipe",
        data: {
          id: recipe.id,
          name: recipe.title,
          image: recipe.image,
          nutrition: recipe.nutrition,
          source: "spoonacular",
        },
      });
      alert("Recipe saved to favorites!");
    } catch (err) {
      console.error("Error saving favorite:", err);
      alert("Failed to save favorite.");
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-blue-600 mb-4 inline-flex items-center"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </button>

      <h1 className="text-2xl font-bold mb-2">{recipe.title}</h1>
      <img
        src={recipe.image}
        alt={recipe.title}
        className="w-full rounded mb-4"
      />

      <div className="mb-4">
        <h2 className="text-lg font-semibold">Ingredients</h2>
        <ul className="list-disc list-inside">
          {recipe.ingredients.map((ing, idx) => (
            <li key={idx}>{ing}</li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">Instructions</h2>
        <ol className="list-decimal list-inside">
          {recipe.instructions.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={handleUseRecipe}
          className="bg-green-600 text-white py-2 px-4 rounded flex items-center justify-center gap-2"
        >
          <CookingPot className="w-4 h-4" /> Use Recipe
        </button>
        <button
          onClick={handleAddToDiary}
          className="bg-yellow-500 text-white py-2 px-4 rounded flex items-center justify-center gap-2"
        >
          <NotebookPen className="w-4 h-4" /> Add to Diary
        </button>
        <button
          onClick={handleSaveFavorite}
          className="bg-pink-500 text-white py-2 px-4 rounded flex items-center justify-center gap-2"
        >
          <BookmarkPlus className="w-4 h-4" /> Save to Favorites
        </button>
      </div>
    </div>
  );
};

export default RecipeDetails;
