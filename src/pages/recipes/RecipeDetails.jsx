import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../utils/axiosInstance";
import { ArrowLeft, CookingPot, NotebookPen, BookmarkPlus } from "lucide-react";
import RecipeIngredientsTable from "../../components/recipes/RecipeIngredientsTable";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import RecipeFabMenu from "../../components/recipes/RecipeFabMenu";

//import { useAuth } from '/Users/ankitbansal/Downloads/mealpal-frontend-main/src/context/index.js';

const RecipeDetails = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { recipe } = location.state || {};
	const [servings, setServings] = useState(recipe?.servings || 2);

	if (!recipe) {
		return (
			<div className="p-4 text-center">
				<p className="text-white">No recipe selected.</p>
				<button
					className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
					onClick={() => navigate(-1)}
				>
					<ArrowLeft className="inline-block w-4 h-4 mr-1" /> Go Back
				</button>
				<RecipeFabMenu />
			</div>
		);
	}

	const scaledIngredients = (recipe.ingredients || [])
		.filter((i) => i && (typeof i === "string" || typeof i === "object"))
		.map((ing) => ({
			name: typeof ing === "string" ? ing : ing.name || "Unknown ingredient",
			amount:
				typeof ing === "string"
					? ""
					: `${(((ing.amount || 1) / recipe.servings) * servings).toFixed(1)} ${
							ing.unit || ""
					  }`,
		}));

	const handleUseRecipe = async () => {
		try {
			await api.post("/recipes/use", {
				usedIngredients: recipe.ingredients.map((i) => ({ name: i.name || i })),
			});
			toast.success("Ingredients deducted from fridge!");
		} catch (err) {
			console.error("Error using recipe:", err);
			toast.error("Failed to deduct ingredients.");
		}
	};

	const handleAddToDiary = async () => {
		try {
			await api.post("/diary/recipes", {
				date: new Date().toISOString().slice(0, 10),
				meal: "dinner",
				recipe: {
					title: recipe.title,
					nutrition: {
						calories: recipe.nutrition?.calories || 0,
						protein: recipe.nutrition?.protein || 0,
						carbs: recipe.nutrition?.carbs || 0,
						fat: recipe.nutrition?.fat || 0,
					},
				},
			});
			console.log(recipe);
			toast.success("Recipe logged to diary!");
		} catch (err) {
			console.error("Error logging recipe:", err);
			toast.error("Failed to log to diary.");
		}
	};

	const handleSaveFavorite = async () => {
		try {
			await api.post("/favorites/items", {
				type: "recipe",
				data: {
					referenceId: recipe.id,
					name: recipe.title,
					image: recipe.image || "/images/placeholder.jpg",
					nutrition: recipe.nutrition,
					source: "spoonacular",
					ingredients: recipe.ingredients.map((i) =>
						typeof i === "string" ? i : `${i.name} ${i.amount || ""}`.trim()
					),
					instructions: recipe.instructions,
				},
			});
			toast.success("Recipe saved to favorites!");
		} catch (err) {
			console.error("Error saving favorite:", err);
			toast.error("Failed to save favorite.");
		}
	};

	return (
		<motion.div
			className="p-4 max-w-3xl mx-auto pb-10"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<button
				onClick={() => navigate(-1)}
				className="text-sm text-blue-400 mb-4 inline-flex items-center hover:text-white"
			>
				<ArrowLeft className="w-4 h-4 mr-1" /> Back
			</button>

			<h1 className="text-2xl font-bold text-white mb-2">{recipe.title}</h1>
			<img
				src={recipe.image || "/images/placeholder.jpg"}
				alt={recipe.title}
				className="w-full rounded-xl mb-6 shadow-md object-cover h-64"
			/>

			<RecipeIngredientsTable
				ingredients={scaledIngredients}
				servings={servings}
				onIncrease={() => setServings((s) => s + 1)}
				onDecrease={() => setServings((s) => Math.max(1, s - 1))}
			/>

			<div className="mt-8 mb-6">
				<h2 className="text-lg font-semibold text-white mb-2">Instructions</h2>
				<ol className="list-decimal list-inside text-sm text-gray-300 space-y-2">
					{recipe.instructions.map((step, idx) => (
						<li key={idx}>{step}</li>
					))}
				</ol>
			</div>

			<div className="flex flex-col gap-3">
				<motion.button
					whileTap={{ scale: 0.97 }}
					whileHover={{ scale: 1.03 }}
					onClick={handleUseRecipe}
					className="bg-emerald-600 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2"
				>
					<CookingPot className="w-5 h-5" /> Use Recipe
				</motion.button>
				<motion.button
					whileTap={{ scale: 0.97 }}
					whileHover={{ scale: 1.03 }}
					onClick={handleAddToDiary}
					className="bg-yellow-500 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2"
				>
					<NotebookPen className="w-5 h-5" /> Add to Diary
				</motion.button>
				<motion.button
					whileTap={{ scale: 0.97 }}
					whileHover={{ scale: 1.03 }}
					onClick={handleSaveFavorite}
					className="bg-pink-500 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2"
				>
					<BookmarkPlus className="w-5 h-5" /> Save to Favorites
				</motion.button>
			</div>

			<RecipeFabMenu />
		</motion.div>
	);
};

export default RecipeDetails;
