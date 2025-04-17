import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../App";
import { Minus, Plus } from "lucide-react";

const EntryDetail = (item ) => {
	// Safeguard: Check if item is undefined or null
	if (!item) {
		return <div>No Item Id given</div>; // You can display a loading state or a fallback UI
	}

	const {_id, item: product } = item || {}; // item.item = product
	const {
		name,
		brand,
		quantity,
		source,
		nutrition = {},
		ingredients = [],
		instructions = [],
	} = product || {}; //set ingredients to default empty to use variable
	const { setEntries } = useContext(AppContext);
	const [productQuantity, setProductQuantity] = useState(quantity || 1);

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
					};
				}
				return item;
			})
		);
	}, [productQuantity, product, _id, setEntries]);

	return (
		<div className="p-4">
			<h3 className="text-lg font-bold">{name}</h3>
			<p className="text-sm text-gray-500">{brand}</p>

			{!ingredients.length && (
				<>
					<div className="bg-white rounded-sm border-2 inline-flex items-center h-fit my-auto mr-2">
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
					<p className="text-xs text-gray-500 mt-4">
						1 Quantity equals 100g/100ml
					</p>
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
