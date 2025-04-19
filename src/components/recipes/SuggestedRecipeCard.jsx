import React from 'react';
import { Bookmark, ChefHat, Clock, BarChart3, UtensilsCrossed, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

const SuggestedRecipeCard = ({ recipe, onSelect, onSave }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-slate-800 text-gray-800 dark:text-white rounded-2xl shadow-xl overflow-hidden max-w-xl mx-auto"
    >
      <div className="relative">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-64 object-cover object-center"
          loading="lazy"
        />
        <button
          onClick={onSave}
          className="absolute top-3 right-3 bg-white dark:bg-slate-700 text-gray-800 dark:text-white hover:text-pink-500 dark:hover:text-pink-400 rounded-full p-2 shadow-md transition"
        >
          <Bookmark className="w-5 h-5" />
        </button>
      </div>

      <div className="p-5">
        <h2 className="text-xl font-semibold flex items-center justify-center gap-2 mb-1">
          <ChefHat className="w-5 h-5 text-green-600 dark:text-emerald-400" /> Suggested Recipe
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-300 text-center mb-4">
          We have cooked up something based on your preferences.
        </p>

        <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-600 dark:text-gray-300 mb-4">
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
          <h3 className="text-lg font-bold mb-1">{recipe.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {recipe.description || 'A delicious meal crafted just for you based on your selected criteria.'}
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.03 }}
          onClick={onSelect}
          className="mt-5 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition"
        >
          <Eye className="w-4 h-4" /> View Full Recipe
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SuggestedRecipeCard;
