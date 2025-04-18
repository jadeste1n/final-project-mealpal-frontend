import React from 'react';
import { Bookmark, ChefHat, Clock, BarChart3, UtensilsCrossed } from 'lucide-react';


const SuggestedRecipeCard = ({ recipe, onSelect, onSave }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden relative">
      <div className="relative">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-56 object-cover"
        />
        <button
          onClick={onSave}
          className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white"
        >
          <Bookmark className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      <div className="p-4">
        <h2 className="text-lg font-bold text-center mb-1 flex justify-center items-center gap-1">
          <ChefHat className="w-5 h-5" /> Suggested Recipe
        </h2>
        <p className="text-sm text-gray-500 text-center mb-4">We’ve Cooked up a Match for You!</p>

        <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-600 mb-3">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" /> {recipe.readyInMinutes || 30} min
          </span>
          <span className="flex items-center gap-1">
            <BarChart3 className="w-4 h-4" /> Medium
          </span>
          <span className="flex items-center gap-1">
            <UtensilsCrossed className="w-4 h-4" /> {recipe.mealType || 'Dinner'}
          </span>
        </div>

        <div className="text-center">
          <h3 className="text-md font-semibold mb-1">{recipe.title}</h3>
          <p className="text-sm text-gray-500 line-clamp-2">
            {recipe.description || 'This is a short recipe description that gives a short info about the recipe.'}
          </p>
        </div>

        <button
          onClick={onSelect}
          className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          View Full Recipe
        </button>
      </div>
    </div>
  );
};

export default SuggestedRecipeCard;
