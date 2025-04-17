import React from 'react';
import { Plus, Minus } from 'lucide-react';

const RecipeIngredientsTable = ({ ingredients, servings, onIncrease, onDecrease }) => {
  return (
    <div className="bg-white rounded-md p-4 shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Ingredients</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={onDecrease}
            className="bg-gray-200 p-1 rounded hover:bg-gray-300"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-sm">{servings} servings</span>
          <button
            onClick={onIncrease}
            className="bg-gray-200 p-1 rounded hover:bg-gray-300"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <ul className="text-sm text-gray-700 space-y-2">
        {ingredients.map((item, idx) => (
          <li key={idx} className="flex justify-between">
            <span>{item.name}</span>
            <span>{item.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeIngredientsTable;

// This component displays a list of ingredients with the ability to adjust the number of servings.