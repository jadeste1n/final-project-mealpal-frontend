import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UtensilsCrossed, Clock4, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { BookmarkPlus } from "lucide-react";

const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];
const timeOptions = [15, 30, 45, 60];
const difficultyLevels = ["Easy", "Medium", "Hard"];

const CreateRecipe = () => {
  const navigate = useNavigate();
  const [useFridge, setUseFridge] = useState(false);
  const [mealType, setMealType] = useState("Dinner");
  const [maxReadyTime, setMaxReadyTime] = useState(30);
  const [difficulty, setDifficulty] = useState("Medium");

  const handleGenerate = () => {
    const queryParams = new URLSearchParams();
    if (useFridge) {
      queryParams.set("fridge", "true");
    } else {
      queryParams.set("mealType", mealType);
      queryParams.set("maxReadyTime", maxReadyTime);
      queryParams.set("difficulty", difficulty);
    }
    navigate(`/recipes/suggestions?${queryParams.toString()}`);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-base-content mb-6">
        <span role="img" aria-label="craving">
          🍽
        </span>{" "}
        What Are You Craving?
      </h1>

      <label className="flex items-center gap-2 mb-6">
        <input
          type="checkbox"
          checked={useFridge}
          onChange={(e) => setUseFridge(e.target.checked)}
        />
        <span className="text-sm text-base-content">
          Use Ingredients From Fridge
        </span>
      </label>

      {!useFridge && (
        <div className="space-y-6">
          {/* Meal Type */}
          <div>
            <h2 className="text-sm font-medium text-base-content mb-2 flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4" /> Meal Type
            </h2>
            <div className="flex flex-wrap gap-3">
              {mealTypes.map((type) => (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  key={type}
                  onClick={() => setMealType(type)}
                  className={`px-4 py-2 rounded-full border transition ${
                    mealType === type
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {type}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Ready In */}
          <div>
            <h2 className="text-sm font-medium text-base-content mb-2 flex items-center gap-2">
              <Clock4 className="w-4 h-4" /> Ready In
            </h2>
            <div className="flex flex-wrap gap-3">
              {timeOptions.map((t) => (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  key={t}
                  onClick={() => setMaxReadyTime(t)}
                  className={`px-4 py-2 rounded-full border transition ${
                    maxReadyTime === t
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  Under {t} min
                </motion.button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <h2 className="text-sm font-medium text-base-content mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Difficulty
            </h2>
            <div className="flex flex-wrap gap-3">
              {difficultyLevels.map((level) => (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`px-4 py-2 rounded-full border transition ${
                    difficulty === level
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {level}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Generate Button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleGenerate}
        className="mt-10 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-lg flex items-center justify-center gap-2"
      >
        CREATE RECIPE <ArrowRight className="w-5 h-5" />
      </motion.button>

      {/* View Saved Recipes */}
      <div className="mt-6 text-center">
        <Link
          to="/recipes"
          className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-black transition"
        >
          <BookmarkPlus className="w-4 h-4" /> View Favorite Recipes
        </Link>
      </div>
    </div>
  );
};

export default CreateRecipe;
