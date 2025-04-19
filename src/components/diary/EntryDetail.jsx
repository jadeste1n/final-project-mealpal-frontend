import { useState, useEffect, useContext, useRef } from "react";
import { AppContext } from "../../App";
import { Minus, Plus } from "lucide-react";

const EntryDetail = ({ item }) => {
	const { _id, item: product, meal } = item || {}; // item.item = product
	const {
		name,
		brand,
		quantity,
		source,
		nutrition = {},
		ingredients = [],
		instructions = [],
	} = product || {}; //set ingredients to default empty to use variable
	const { setEntries, backendUrl } = useContext(AppContext);
	const [productQuantity, setProductQuantity] = useState(quantity || 1);
	const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1).toLowerCase();
	const [mealCategory, setMealCategory] = useState(
		capitalize(meal) || "Uncategorised"
	);
	console.log(item);

	//Adjust Quantity Buttons
	const incrementQuantity = () => setProductQuantity((q) => q + 1);
	const decrementQuantity = () => setProductQuantity((q) => Math.max(1, q - 1));

	// keep entry quantity in sync
	useEffect(() => {
		setEntries((prevSelection) =>
			prevSelection.map((entry) => {
				// Check if the entry _id matches the current item's _id
				if (entry._id === _id) {
					return {
						...entry,
						item: { ...entry.item, quantity: productQuantity },
						meal: mealCategory,
					};
				}
				return entry;
			})
		);
	}, [productQuantity, mealCategory, product, _id, setEntries]);

	//change quantity & meal in backend
	const firstRun = useRef(true); // 🧠 this tracks if it's the first effect run

	useEffect(() => {
		if (firstRun.current) {
			firstRun.current = false; // ✅ skip first run
			return;
		}

		const updateEntry = async () => {
			try {
				const res = await fetch(`${backendUrl}/diary/${_id}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify({
						item: { ...product, quantity: productQuantity },
						meal: mealCategory,
					}),
				});

				if (!res.ok) {
					console.error("Failed to update entry in backend:", res.status);
				}
				console.log("Updated entry in backend:", {
					item: { ...product, quantity: productQuantity },
					meal: mealCategory,
				});
			} catch (err) {
				console.error("Error updating entry:", err);
			}
		};

		updateEntry();
	}, [productQuantity, mealCategory, backendUrl, _id, product]);

	// Safeguard: Check if item is undefined or null
	if (!item) {
		return <div>No Item Id given</div>; // You can display a loading state or a fallback UI
	}

	return (
		<div className="p-4">
			<div className="mb-6">
				<h3 className="text-lg font-bold">{name}</h3>
				<p className="text-sm text-gray-400">{brand}</p>
			</div>
			<div className="mb-4 w-100">
				<h4 className="text-sm mb-2 font-bold">Meal Category</h4>
				<select
					value={mealCategory}
					className="select"
					onChange={(e) => setMealCategory(e.target.value)}
				>
					<option>uncategorised</option>
					<option>Breakfast</option>
					<option>Lunch</option>
					<option>Dinner</option>
					<option>Snack</option>
				</select>
			</div>
			{!ingredients.length && (
				<>
					{source === "recipe" ? (
						<h4 className="text-sm font-bold mb-4">Servings</h4>
					) : (
						<>
							<h4 className="text-sm font-bold">Quantity</h4>
							<p className="text-xs text-gray-500 mb-4">
								1 Quantity equals 100g/100ml
							</p>
						</>
					)}

					<div className="bg-white rounded-sm border-2 inline-flex items-center h-fit my-auto mr-2 mb-4">
						<button
							onClick={decrementQuantity}
							className="btn btn-xs bg-gray-700"
						>
							<Minus size={16} />
						</button>
						<span className="w-[48px] inline-block text-center px-2 text-primary font-bold ">
							{productQuantity}
						</span>
						<button
							onClick={incrementQuantity}
							className="btn btn-xs bg-gray-700"
						>
							<Plus size={16} />
						</button>
					</div>
				</>
			)}
			<p className="text-xs text-gray-500 mt-4">
				Nutritional Data for {quantity || 1}{" "}
				{ingredients.length ? "Serving" : "Quantity"}:
			</p>

			<table className="mt-2 w-full text-sm border-collapse">
				<tbody>
					<tr className="border-b">
						<td className="py-2">Calories</td>
						<td className="py-2 text-right font-bold">
							{nutrition?.calories ?? "-"}
						</td>
					</tr>
					<tr className="border-b">
						<td className="py-2 ">Protein</td>
						<td className="py-2 text-right font-bold">
							{nutrition?.protein ?? "-"}
						</td>
					</tr>
					<tr className="border-b">
						<td className="py-2">Carbs</td>
						<td className="py-2 text-right font-bold">
							{nutrition?.carbs ?? "-"}
						</td>
					</tr>
					<tr>
						<td className="py-2">Fat</td>
						<td className="py-2 text-right font-bold">
							{nutrition?.fat ?? "-"}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default EntryDetail;
