import React from 'react';
import RecipeCard from 'src/components/recipes/RecipeCard.jsx';

const RecipeGrid = ({ recipes, onSelect }) => {
  if (!recipes?.length) {
    return <p className="text-center text-gray-500">No recipes found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {recipes.map((recipe, index) => (
        <RecipeCard
          key={index}
          title={recipe.title}
          image={recipe.image}
          calories={recipe.nutrition?.calories}
          onClick={() => onSelect(recipe)}
        />
      ))}
    </div>
  );
};

export default RecipeGrid;

// This component is a grid layout for displaying a list of recipes.
