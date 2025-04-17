import { Routes, Route, Navigate } from "react-router-dom";
import CreateRecipe from "./CreateRecipe.jsx";
import RecipeDetails from "./RecipeDetails.jsx";
import SuggestedRecipe from "./SuggestedRecipe.jsx";
import RecipeOverview from "./RecipeOverview.jsx";

const RecipeRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<RecipeOverview />} />
      <Route path="/create" element={<CreateRecipe />} />
      <Route path="/details" element={<RecipeDetails />} />
      <Route path="/suggestions" element={<SuggestedRecipe />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
export default RecipeRoute;
