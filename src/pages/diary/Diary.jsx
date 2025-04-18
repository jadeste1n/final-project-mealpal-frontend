import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../App";
import IngredientSearchResult from "../../components/search/IngredientSearchResult";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Importing the icons from lucide-react
import "cally"; //calender dependency
import EntryPreview from "../../components/diary/EntryPreview"; // Importing the EntryPreview component
import Modal from "../../components/general/Modal";
import EnergySummaryChart from "../../components/inventory/EnergySummaryChart";

const Diary = () => {
	// variables ----------------
	const { backendUrl, entries, setEntries, modalState, closeModal, content } =
		useContext(AppContext);
	const [date, setDate] = useState(() => {
		const today = new Date(); //set day to today
		return today.toISOString().split("T")[0]; // Format as YYYY-MM-DD (Date only) -> no time & time zone
	});
	const categories = ["uncategorised", "Breakfast", "Lunch", "Dinner", "Snack"];
	const [totalNutrition, setTotalNutrition] = useState({
		calories: 0,
		protein: 0,
		carbs: 0,
		fat: 0,
	});
	const [groupedEntries, setGroupedEntries] = useState({});

	const fetchDiaryEntries = async (date) => {
		try {
			const formattedDate = new Date(date);
			const stringDate = formattedDate.toISOString(); // converts the JavaScript Date object into a string representation in the ISO 8601 format

			const res = await fetch(`${backendUrl}/diary?date=${stringDate}`, {
				credentials: "include",
			});
			console.log(`fetching Data for ${stringDate}`);
			if (!res.ok) throw new Error("Failed to fetch diary entries");
			const data = await res.json();
			setEntries(data || []);
			console.log(data);
		} catch (err) {
			console.error(err.message);
		}
	};

	// Utils ----------------
	const groupEntriesByCategory = (entries, categories) => {
		return categories.reduce((acc, category) => {
			acc[category] = entries.filter((e) => {
				const meal = e.meal ? e.meal.toLowerCase() : "uncategorized";
				return meal === category.toLowerCase();
			});
			return acc;
		}, {});
	};

	// Effects ----------------

	// Fetch diary entries when the component mounts or when the date changes
	useEffect(() => {
		fetchDiaryEntries(date);
	}, [date]);

	useEffect(() => {
		//whenever entries changes update totalNutrition
		const total = entries.reduce(
			(acc, entry) => {
				const nutrition = entry.item?.nutrition || {}; //check if nutrition is available otherwise set empty
				acc.calories += nutrition.calories || 0; //accumulate calory item by adding & assigning to variable
				acc.protein += nutrition.protein || 0;
				acc.carbs += nutrition.carbs || 0;
				acc.fat += nutrition.fat || 0;
				// Return the updated total for the next loop iteration
				return acc;
			},
			// Initial value of the accumulator
			{ calories: 0, protein: 0, carbs: 0, fat: 0 }
		);

		setTotalNutrition(total);
	}, [entries]);

	useEffect(() => {
		const groupEntries = groupEntriesByCategory(entries, categories);
		setGroupedEntries(groupEntries);
	}, [entries]); // Whenever `entries` changes, update the `groupedEntries`

	//Button Actions ----------------
	const handleDateChange = (e) => {
		const newDate = e.target.value;
		setDate(newDate);
		document.getElementById("cally1").innerText = newDate;
	};

	const handleNextDate = () => {
		const currentDate = new Date(date);
		currentDate.setDate(currentDate.getDate() + 1); // Increment the date by one day
		const newDate = currentDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
		setDate(newDate);
	};

	const handlePrevDate = () => {
		const currentDate = new Date(date);
		currentDate.setDate(currentDate.getDate() - 1); // Decrement the date by one day
		const newDate = currentDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
		setDate(newDate);
	};

	return (
		<div className="space-y-4 pb-32 ">
			<h1 className="text-xl font-semibold mb-4">Your Diary</h1>
			<div className="flex flex-row justify-center items-center content-center gap-2 mb-8 justify-items-stretch">
				{/* DaisyUI Dropdown Implementation */}
				<div className="dropdown w-100">
					<div className="flex flex-row">
						<ChevronLeft
							aria-label="Previous"
							className="my-auto"
							onClick={handlePrevDate}
							size={24}
						/>
						<button
							className="input w-full text-center flex font-bold justify-center items-center bg-primary border-0 text-white"
							id="cally1"
							data-dropdown-toggle="cally-popover1"
						>
							{date}
						</button>
						<ChevronRight
							aria-label="Next"
							className="my-auto"
							onClick={handleNextDate}
							size={24}
						/>
					</div>
					<div
						id="cally-popover1"
						className="dropdown-content bg-base-100 rounded-box shadow-lg w-64 p-4"
						style={{ position: "absolute" }}
					>
						<calendar-date class="cally" onchange={handleDateChange}>
							<calendar-month></calendar-month>
						</calendar-date>
					</div>
				</div>
			</div>

			<div className="p-12 pt-8 bg-base-200 rounded-lg shadow-md flex flex-col items-center text-center">
				<p className="pb-10 text-sm text-gray-400">
					Macronutrient Overview of the Day
				</p>
				<EnergySummaryChart nutrition={totalNutrition} />
			</div>

			{categories.map((category) => (
				<div key={category} className="collapse collapse-arrow bg-base-200">
					<input type="checkbox" defaultChecked />
					<div className="collapse-title text-sm capitalize text-left text-primary flex justify-between">
						<span className="font-bold">{category}</span>
						<span className="text-xs font-bold text-gray-500 my-auto">
							({groupedEntries[category]?.length || 0})
						</span>
					</div>
					{/* Use IngredientSearchComponent for testing right now */}
					<div className="collapse-content">
						<ul className="space-y-2">
							{groupedEntries[category]?.map((entry) => (
								<EntryPreview key={entry._id} item={entry} />
							))}
						</ul>
					</div>
				</div>
			))}

			{modalState && (
				<Modal isOpen={modalState} onClose={closeModal}>
					{content}
				</Modal>
			)}
		</div>
	);
};

export default Diary;
