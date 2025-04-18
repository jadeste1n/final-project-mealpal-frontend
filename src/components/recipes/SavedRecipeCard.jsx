import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ChefHat, XCircle } from 'lucide-react';

const SavedRecipeCard = ({ recipe, favoriteId, onRemove }) => {
  const navigate = useNavigate();

  if (!recipe || typeof recipe !== 'object') return null;

  const handleClick = () => {
    navigate('/recipes/details', { state: { recipe } });
  };

  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden cursor-pointer relative"
    >
      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title || 'Recipe'}
          className="w-full h-36 object-cover object-center"
          onClick={handleClick}
        />
      )}

      <div className="p-3" onClick={handleClick}>
        <h3 className="text-md font-semibold text-gray-800 mb-1 truncate">
          {recipe?.name || recipe?.title || 'Untitled Recipe'}
        </h3>
        <div className="flex gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" /> {recipe.readyInMinutes || 30} min
          </span>
          <span className="flex items-center gap-1">
            <ChefHat className="w-4 h-4" /> Recipe
          </span>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove?.(favoriteId);
        }}
        className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow"
      >
        <XCircle className="w-4 h-4" />
      </button>
    </div>
  );
};

export default SavedRecipeCard;
