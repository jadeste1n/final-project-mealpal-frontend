import React from 'react';

const RecipeCard = ({ title, image, calories, onClick }) => {
  return (
    <div
      className="bg-white rounded-lg shadow hover:shadow-md cursor-pointer overflow-hidden transition"
      onClick={onClick}
    >
      <img src={image} alt={title} className="w-full h-40 object-cover" />
      <div className="p-3">
        <h3 className="text-md font-semibold mb-1 truncate">{title}</h3>
        <p className="text-sm text-gray-600">
          {calories ? `${Math.round(calories)} kcal` : 'No calorie info'}
        </p>
      </div>
    </div>
  );
};

export default RecipeCard;

// This is simple recipe card that displays the recipe title, image, and calories.