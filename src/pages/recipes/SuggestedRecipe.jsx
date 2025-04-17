import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { api } from "@/utils/axiosInstance.jsx";
import RecipeGrid from "@/components/recipes/RecipeGrid.jsx";
import RecipeIngredients from "@/components/recipes/RecipeIngredient.jsx";

const SuggestedRecipe = () => {
  const locaton = useLocation();
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, SetSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      const params = new URLSearchParams(location.search);
      const useFridge = params.get("fridge") === "true";
      const mealType = params.get("mealType");
      const maxReadyTime = params.get("maxReadyTime");

      try {
        const body = useFridge
          ? { ingredients: ["chicken", "broccoli"], refresh: true } // TODo will replace this with actual fridge items
          : { mealType, maxReadyTime: Number(maxReadyTime), refresh: true };

        const res = await api.post("/recipes/suggest", body);
        setRecipes(res.data);
      } catch (err) {
        console.error("Error fetching recipes", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [locaton.search]);

  return (
    <div className="p-4">
      <h1 className="text-x1 font-semibold mb-4">Suggested Recipes</h1>
      {loading ? (
        <p> Loading Recipes...</p>
      ) : (
        <RecipeGrid recipes={recipes} onselect={SetSelectedRecipe} />
      )}

      {selectedRecipe && (
        <RecipeIngredients
          recipe={selectedRecipe}
          onClose={() => SetSelectedRecipe(null)}
        />
      )}
    </div>
  );
};

export default SuggestedRecipe;
