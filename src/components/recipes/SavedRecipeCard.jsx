import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ChefHat } from 'lucide-react';

const SavedRecipeCard = ({ recipe }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/recipes/details', { state: { recipe } });
  };

  return (
    <div
      className="bg-white rounded-lg shadow cursor-pointer hover:shadow-md transition overflow-hidden"
      onClick={handleClick}
    >
      <img src={recipe.image} alt={recipe.title} className="w-full h-36 object-cover" />
      <div className="p-3">
        <h3 className="text-md font-semibold mb-1 truncate">{recipe.title}</h3>
        <div className="flex gap-2 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" /> {recipe.readyInMinutes || 30} min
          </span>
          <span className="flex items-center gap-1">
            <ChefHat className="w-4 h-4" /> {recipe.mealType || 'Dinner'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SavedRecipeCard;


// This is a recipe card that displays the recipe title, image, and cooking time.