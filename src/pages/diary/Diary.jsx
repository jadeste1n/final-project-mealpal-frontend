import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../App";
import IngredientSearchResult from "../../components/search/IngredientSearchResult";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Importing the icons from lucide-react
import "cally"; //calender dependency
import EntryPreview from "../../components/diary/EntryPreview"; // Importing the EntryPreview component
import Modal from "../../components/general/Modal";

const Diary = () => {
	// variables ----------------
	const { backendUrl, entries, setEntries, modalState, closeModal , content} =
		useContext(AppContext);
	const [date, setDate] = useState(() => {
		const today = new Date(); //set day to today
		return today.toISOString().split("T")[0]; // Format as YYYY-MM-DD (Date only) -> no time & time zone
	});
	const categories = ["uncategorized", "breakfast", "lunch", "dinner", "snack"];

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
		} catch (err) {
			console.error(err.message);
		}
	};

	// Effects ----------------

	// Fetch diary entries when the component mounts or when the date changes
	useEffect(() => {
		fetchDiaryEntries(date);
	}, [date]);

	// Utils ----------------

	const groupedEntries = categories.reduce((acc, category) => {
		acc[category] = entries.filter(
			(e) => (e.category || "uncategorized") === category
		);
		return acc;
	}, {});

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
		<div className="p-4 space-y-4 ">
			<div className="flex flex-row justify-center items-center content-center gap-2 mb-8">
				{/* DaisyUI Dropdown Implementation */}
				<div className="dropdown">
					<div className="flex flex-row">
						<ChevronLeft
							aria-label="Previous"
							className="my-auto"
							onClick={handlePrevDate}
							size={24}
						/>
						<button
							className="input w-100 text-center flex font-bold justify-center items-center bg-primary"
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

			{categories.map((category) => (
				<div key={category} className="collapse collapse-arrow bg-base-200">
					<input type="checkbox" defaultChecked />
					<div className="collapse-title text-sm capitalize text-left text-primary flex justify-between">
						<span>{category}</span>
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
