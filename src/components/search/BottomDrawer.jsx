import { useState } from "react";
import IngredientSearchResult from "./IngredientSearchResult";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useContext } from "react";
import { AppContext } from "../../App";
import { Refrigerator, BookOpenCheck } from "lucide-react";

const BottomDrawer = ({ selection }) => {
	const [isOpen, setIsOpen] = useState(false);
	const { setSelection, addToSelection, backendUrl } = useContext(AppContext);
	const addedToBackend = [];

	//Open/Close Drawer
	const toggle = () => setIsOpen(!isOpen);

	//Button Action: Add selected items to fridge
	const handleAddToFridge = async () => {
		// make a loop for every item since backend expects a single object, not an array.
		for (const item of selection) {
			// Check if the item has the necessary data
			const itemName = item.name || (item.data ? item.data.name : "Unknown");
			const itemBrand = item.brand || (item.data ? item.data.brand : "");
			const itemNutrition =
				item.nutrition || (item.data ? item.data.nutrition : {});
			const itemCategory = item.category || "other"; // Default category if none provided
			const referenceId = item.id || item.data?.referenceId || item.referenceId; //from food db: item.id , from favorites: item.data.id , fridge: item.referenceId
			console.log(item.id, item.data?.referenceId, item.referenceId); //from food db: item.id , from favorites: item.data.id , fridge: item.referenceId

			try {
				const res = await fetch(`${backendUrl}/fridge/items`, {
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						//convert object to fridge item
						name: itemName, //empty array if no name is set
						brand: itemBrand, //empty array if no brand is set
						referenceId: referenceId,
						quantity: item.quantity || 1, //default for now
						category: itemCategory, // default if none is given
						nutrition: itemNutrition,
						source: item.source || "usda",
					}),
				});
				console.log(
					"name:",
					itemName,
					"brand:",
					itemBrand,
					"referenceId:",
					referenceId,
					"quantity:",
					1,
					"category:",
					itemCategory,
					"nutrition:",
					itemNutrition
				);
				if (!res.ok) throw new Error("Failed to add item to fridge");
				console.log(`Saved ${itemName} to fridge: ${item}`); //DEBUG

				addedToBackend.push(item); // track items that are successfully added to backend
			} catch (error) {
				console.error(`Error saving ${itemName}:`, error.message);
			}
		}

		// Remove successfully added items to backend from selection
		const updatedSelection = selection.filter(
			(item) => !addedToBackend.includes(item)
		);
		setSelection(updatedSelection);

		//Update localStorage
		localStorage.setItem("selection", JSON.stringify(updatedSelection));
	};

	const handleAddToDiary = async () => {
		// make a loop for every item since backend expects a single object, not an array.
		for (const item of selection) {
			// Check if the item has the necessary data
			const itemName = item.name || (item.data ? item.data.name : "Unknown");
			const itemBrand = item.brand || (item.data ? item.data.brand : "");
			const itemNutrition =
				item.nutrition || (item.data ? item.data.nutrition : {});
			const itemCategory = item.category || "other"; // Default category if none provided
			const itemSource = item.source || "recipe";

			try {
				const res = await fetch(`${backendUrl}/diary`, {
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						//convert object to fridge item
						//date: -> use default of bk model
						//meal: "uncategorised", //default uncategorised
						item: {
							name: itemName,
							brand: itemBrand,
							quantity: item.quantity || 1, //default to one
							category: itemCategory, // default if none is given
							nutrition: itemNutrition,
							source: itemSource,
						},
					}),
				});
				if (!res.ok) throw new Error("Failed to add item to diary");
				console.log(`Saved ${itemName} to diary: ${item}`); //DEBUG

				addedToBackend.push(item); // track items that are successfully added to backend
			} catch (error) {
				console.error(`Error saving ${itemName}:`, error.message);
			}
		}

		// Remove successfully added items to backend from selection
		const updatedSelection = selection.filter(
			(item) => !addedToBackend.includes(item)
		);
		setSelection(updatedSelection);

		//Update localStorage
		localStorage.setItem("selection", JSON.stringify(updatedSelection));
	};

	return (
		<div
			className={`fixed left-0 right-0 bottom-0 z-30 pb-30 transition-all duration-300 ease-in-out ${
				isOpen ? "h-screen" : "h-24"
			} bg-base-200 shadow-2xl rounded-2xl`}
		>
			{/* handle */}
			<div
				className="p-4 text-center border-b border-base-300
 cursor-pointer"
				onClick={toggle}
			>
				<div className="flex flex-row justify-between items-center px-4">
					<p className="text-sm text-gray-400">
						<span className="font-bold text-white bg-primary p-0 px-1 rounded-2xl mr-1">
							{selection.length}
						</span>{" "}
						Selected Items
					</p>
					<div
						className="w-fit flex flex-row gap-4
"
					>
						{addToSelection === "Add To Diary" ? (
							<button
								className="btn btn-sm btn-primary"
								onClick={handleAddToDiary}
							>
								Add To Diary <BookOpenCheck />
							</button>
						) : (
							<button
								className="btn btn-sm btn-primary"
								onClick={handleAddToFridge}
							>
								Add To Fridge <Refrigerator />
							</button>
						)}

						<p className="text-sm text-gray-500">
							{isOpen ? <ChevronUp /> : <ChevronDown />}
						</p>
					</div>
				</div>
			</div>

			{/* content */}
			<div
				className={`overflow-y-auto px-4 pt-4 ${
					isOpen ? "h-[calc(100%-5rem)]" : "hidden"
				} `}
			>
				{/* Bottom padding so content doesn’t overlap the nav */}
				<ul className="list bg-base-100 rounded-box shadow-md">
					{selection.map((item) => (
						<IngredientSearchResult
							key={item._id || item.id}
							ingredient={item}
							inDrawer={true}
						/>
					))}
				</ul>
			</div>
		</div>
	);
};

export default BottomDrawer;
