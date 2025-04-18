import { Star, CirclePlus, CircleMinus, Eye, Plus, Minus } from "lucide-react";
import { useState, useEffect, useContext, use } from "react";
import IngredientDetail from "./IngredientDetail";
import { AppContext } from "../../App";

const IngredientSearchResult = ({ ingredient, inDrawer = false }) => {
	//--------------------VARIABLES
	// takes ingredient from fetched data array
	const { selection, setSelection, favorites, fetchFavorites, openModal } =
		useContext(AppContext);
	const [quantity, setQuantity] = useState(ingredient.quantity || 1);
	const backendUrl = import.meta.env.VITE_BACKEND_URL;

	// Check if item is coming from favorites
	const isFavoriteItem = ingredient.data ? true : false;

	const isFridgeItem = ingredient.referenceId ? true : false; //check if item is coming from fridge

	// Ingredient details - Render conditionally based on source
	const ingredientId = ingredient._id || ingredient.id; //check if _id or id is set
	//const ReferenceId = ingredient.id || ingredient.data.id;
	const source = ingredient.source || ingredient.data?.source;
	const ingredientName = isFavoriteItem
		? ingredient.data.name
		: ingredient.name;
	const ingredientBrand = isFavoriteItem
		? ingredient.data.brand
		: ingredient.brand;

	//--------------------

	//NOTE ON OBJECT FORMATS:
	//FOOD DB data in search tab
	// data object from food db details with ID (NO SOURCE): {"id": 2117388, "name": "APPLE","brand": "Associated Wholesale Grocers, Inc.", "nutrition": {"calories": 110, "protein": 0, "carbs": 28,"fat": 0}
	// data object from food db with ID (NO NUTRIENTS): {"id": 2117388, "name": "APPLE","brand": "Associated Wholesale Grocers, Inc.", "source": "usda"}

	// objects saved to selection:
	// data from food db -> fetch details -> saved to selection = only id from food db
	// data from favorites/fridge -> fetched from backend -> saved to selection -> with _id

	//data object from favorites (WITH _id): { "name": "100% Whole Wheat Bread", "brand": "Nature's Own", "source": "off", "_id": "67fe6f20ce4ac05f7217d54a", "userId": "67fbf2fe846c53686b5c6ffa", "type": "product", "createdAt": "2025-0415", "nutrition": { "calories": 110, "protein": 4, "carbs": 20, "fat": 1.5 },
	//data object from fridge (with _id): { "nutrition": { "calories": 0, "protein": 13.5, "carbs": 58.7, "fat": 7 }, "_id": "67fe900ff46a8519dbff8598", "userId": "67fbf2fe846c53686b5c6ffa", "name": "Haferflocken", "quantity": 1, "category": "other", "isFavorite": false, "createdAt": "2025-04-15T16:57:_

	//--------------------UTILS
	// Check if ingredient is in the selection array (selection array saves objects with _id)
	/*const isInSelection = selection.some(
		(item) => (item._id || item.id || item.data.id) === ingredientId
	);*/

	//check if this type of item in already in selection
	const isInSelection = selection.some((item) => {
		const itemRefId =
			item.referenceId || item.data?.referenceId || item.id || item.data?.id;
		const ingredientRefId =
			ingredient.referenceId ||
			ingredient.data?.referenceId ||
			ingredient.id;
	
		return String(itemRefId) === String(ingredientRefId);
	});

	//check if ingredient is within favorites backend
	const isFavorite = favorites.some((fav) => {
		const favRefId = fav.data?.referenceId; //check original food id in favorites against...
		const ingredientRefId =
			ingredient.referenceId || //data from fridge
			ingredient.data?.referenceId || //data within favorites
			ingredient.id; //data from search

		if (!favRefId || !ingredientRefId) return false;

		return String(favRefId) === String(ingredientRefId);
	});

	//--------------------EFFECTS
	//fetch full product before adding to selection, fridge or favorites
	const fetchFullIngredientDetails = async () => {
		try {
			//this fetch only takes .id of original search product
			const res = await fetch(
				`${backendUrl}/products/${source}/${ingredientId}`
			);

			if (!res.ok) {
				throw new Error("Failed to fetch product details");
			}

			return await res.json();
		} catch (error) {
			console.error("Error fetching product details:", error.message);
			return null;
		}
	};

	// keep selection quantity in sync when in drawer
	useEffect(() => {
		if (!inDrawer || !isInSelection) return;
		setSelection((prevSelection) =>
			prevSelection.map((item) => {
				const matchId = item._id || item.id || item.data?.id;
				if (matchId === ingredientId) {
					return { ...item, quantity };
				}
				return item;
			})
		);
	}, [quantity]);

	//--------------------BUTTON ACTIONS
	const handleOpenDetails = async () => {
		console.log("Opening modal...", ingredient); //DEBUG

		// Check for nutrition in both ingredient and ingredient.data
		const ingredientData = ingredient?.data || ingredient;
		const hasNutrition = ingredientData.nutrition;

		if (hasNutrition) {
			// Already have the details
			openModal(<IngredientDetail ingredient={ingredient} />);
		} else {
			// Fetch the full details
			const fullDetails = await fetchFullIngredientDetails();
			if (fullDetails) {
				openModal(<IngredientDetail ingredient={fullDetails} />);
			} else {
				openModal(<p>Failed to load ingredient details.</p>);
			}
		}
	};

	// Add ingredient to favorites
	const handleAddToFavorites = async () => {
		let fullProduct;
		//if coming from search fetch full product details
		if (!isFridgeItem && !isFavoriteItem) {
			fullProduct = await fetchFullIngredientDetails();
			if (!fullProduct) return;
		} else {
			fullProduct = {
				...ingredient,
			};
		}

		//add to favorites db
		try {
			const res = await fetch(`${backendUrl}/favorites/items`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					type: "product",
					data: {
						referenceId: fullProduct.id || fullProduct.referenceId, // id from food db
						name: fullProduct.name,
						brand: fullProduct.brand || "",
						category: fullProduct.category || "other",
						nutrition: fullProduct.nutrition || {},
						source: fullProduct.source || "",
					},
				}),
			});

			if (!res.ok) {
				throw new Error("Failed to add to favorites");
			}

			console.log(`added ${ingredient.name} to favorites`); //DEBUG
			fetchFavorites(); // Trigger a fetch to update the favorites list in context
		} catch (error) {
			console.error("Error adding ingredient to favorites:", error.message);
		}
	};

	// Remove ingredient from favorites
	const handleRemoveFromFavorites = async () => {
		try {
			let favoriteIdToRemove;

			if (isFavoriteItem) {
				// Coming directly from favorites
				favoriteIdToRemove = ingredient._id;
			} else {
				// Coming from fridge or search
				const ingredientRefId = String(
					ingredient.referenceId ||
						ingredient.data?.referenceId ||
						ingredient.id
				);

				const matchingFavorite = favorites.find(
					(fav) => String(fav.data?.referenceId) === ingredientRefId
				);

				if (!matchingFavorite?._id) {
					console.warn("Favorite not found for removal");
					console.log("IngredientRefId:", ingredientRefId);
					console.log("Favorites:", favorites);
					return;
				}

				favoriteIdToRemove = matchingFavorite._id;
			}

			console.log("Deleting favorite with ID:", favoriteIdToRemove);

			const res = await fetch(
				`${backendUrl}/favorites/items/${favoriteIdToRemove}`,
				{
					method: "DELETE",
					credentials: "include",
				}
			);

			if (!res.ok) {
				throw new Error("Failed to remove from favorites");
			}

			fetchFavorites();
		} catch (error) {
			console.error("Error removing ingredient from favorites:", error.message);
		}
	};

	// Add ingredient WITH DETAILS to selection list
	const handleAddToSelection = async () => {
		if (isInSelection) return; //check if its already saved to selection, if Already there, no need to fetch or add again

		let fullProduct;

		//get full product details if its from search
		if (!isFavoriteItem && !isFridgeItem) {
			fullProduct = await fetchFullIngredientDetails();
			if (!fullProduct) return;
		}

		//if in format of favorite or fridge item save object without modification to selection
		if (isFavoriteItem || isFridgeItem) {
			fullProduct = {
				...ingredient,
			};
		}

		fullProduct.quantity = quantity; //add quantity set in drawer
		//add product to list of elements to add to diary or fridge
		setSelection((prevSelection) => [...prevSelection, fullProduct]);
	};

	// Remove ingredient from selection list
	const handleRemoveFromSelection = () => {
		setSelection((prevSelection) =>
			prevSelection.filter((item) => (item._id || item.id) !== ingredientId)
		);
	};

	//Adjust Quantity Buttons
	const incrementQuantity = () => setQuantity((q) => q + 1);
	const decrementQuantity = () => setQuantity((q) => Math.max(1, q - 1));

	//List Element
	return (
		<>
			<li className="list-row flex flex-row justify-between">
				<div className="flex flex-col justify-start content-start">
					<p className="text-left font-bold">{ingredientName}</p>
					<p className="text-left text-gray-400">{ingredientBrand}</p>
				</div>
				<div className="flex flex-row">
					{!inDrawer && (
						<>
							<button
								className="btn btn-square btn-ghost min-w-fit p-3 my-auto
"
								onClick={handleOpenDetails}
							>
								<Eye className="stroke-blue-600" />{" "}
								{/* opens pop up with Ingredient Details */}
							</button>
							<button
								className="btn btn-square btn-ghost min-w-fit p-3 my-auto
"
								onClick={
									isFavorite ? handleRemoveFromFavorites : handleAddToFavorites
								}
							>
								{isFavorite ? (
									<Star className="fill-yellow-500 text-yellow-500" />
								) : (
									<Star />
								)}{" "}
								{/* saves ingredient to favorites -> add to backend favorites POST */}
							</button>
						</>
					)}

					{inDrawer && (
						<div className="bg-white rounded-sm border-2 inline-flex items-center h-fit my-auto mr-2">
							<button
								onClick={decrementQuantity}
								className="btn btn-xs bg-gray-700"
							>
								<Minus size={16} />
							</button>
							<span className="w-[48px] inline-block text-center px-2 text-primary font-bold ">
								{quantity}
							</span>
							<button
								onClick={incrementQuantity}
								className="btn btn-xs bg-gray-700"
							>
								<Plus size={16} />
							</button>
						</div>
					)}

					<button
						className="btn btn-square btn-ghost min-w-fit pl-3 my-auto"
						onClick={
							isInSelection ? handleRemoveFromSelection : handleAddToSelection
						}
					>
						{isInSelection ? (
							<CircleMinus className="stroke-red-800 " /> // Remove from selection
						) : (
							<CirclePlus className="stroke-green-600 " /> // Add to selection
						)}
					</button>
				</div>
			</li>
		</>
	);
};

export default IngredientSearchResult;
