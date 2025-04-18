import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { api } from "../../utils/axiosInstance";
import SuggestedRecipeCard from "../../components/recipes/SuggestedRecipeCard";

const SuggestedRecipe = () => {
	const location = useLocation();
	const navigate = useNavigate();
	//const { user } = useAuth();
	//const userId = user?._id;

	const userId = "67fbf2fe846c53686b5c6ffa"; // FOR TESTING THE PAGES
	const [recipe, setRecipe] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchRecipe = async () => {
			setLoading(true);
			const params = new URLSearchParams(location.search);
			const useFridge = params.get("fridge") === "true";
			const mealType = params.get("mealType") || "dinner";
			const maxReadyTime = params.get("maxReadyTime") || 30;

			try {
				let body;
				if (useFridge) {
					const fridgeItems = ["chicken", "broccoli"]; // Replace with real fridge items
					body = { ingredients: fridgeItems, refresh: true };
				} else {
					body = {
						mealType,
						maxReadyTime: Number(maxReadyTime),
						refresh: true,
					};
				}

				console.log("Body sent to backend:", body);
				const res = await api.post("/recipes/suggest", body);
				console.log("Response:", res.data);
				setRecipe(res.data[0]);
			} catch (err) {
				console.error("Error fetching recipe:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchRecipe();
	}, [location.search]);

	const handleSave = async () => {
		try {
			await api.post(`/favorites/${userId}`, {
				type: "recipe",
				data: {
					id: recipe.id,
					name: recipe.title,
					image: recipe.image,
					nutrition: recipe.nutrition,
					source: "spoonacular",
				},
			});
			alert("Recipe saved!");
		} catch (err) {
			console.error("Error saving recipe:", err);
			alert("Failed to save recipe.");
		}
	};

	const handleSelect = () => {
		navigate("/recipes/details", { state: { recipe } });
	};

	return (
		<div className="p-4">
			<h1 className="text-xl font-semibold mb-4">Suggested Recipe</h1>
			{loading && <p>Loading recipe...</p>}
			{!loading && recipe && (
				<SuggestedRecipeCard
					recipe={recipe}
					onSave={handleSave}
					onSelect={handleSelect}
				/>
			)}
			{!loading && !recipe && (
				<p className="text-center text-gray-400 mt-4">
					No recipes found. Try different filters.
				</p>
			)}
			<Link
				to="/recipes/create"
				className="mt-6 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
			>
				Create Another Recipe
			</Link>
		</div>
	);
};

export default SuggestedRecipe;
