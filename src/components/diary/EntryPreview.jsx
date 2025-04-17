import { CircleMinus, Eye } from "lucide-react";
import { useState, useEffect, useContext, use } from "react";
import { AppContext } from "../../App";
import EntryDetail from "./EntryDetail";

const EntryPreview = ({ item }) => {
	//--------------------VARIABLES
	const { backendUrl, openModal, setEntries } = useContext(AppContext);

	//--------------------EFFECTS

	// keep selection quantity in sync when in drawer

	//--------------------BUTTON ACTIONS
	const handleOpenDetails = async () => {
		console.log("Opening modal...", item); //DEBUG
        //On Click open Modal with EntryDetail as Content
		openModal(<EntryDetail ingredient={item} />);
	};

	/// Remove item from diary (frontend + backend)
	const handleRemove = async () => {
		console.log(item._id); //DEBUG

		try {
			const res = await fetch(`${backendUrl}/diary/${item._id}`, {
				method: "DELETE",
				credentials: "include", // important if using cookies/auth
			});

			if (res.ok) {
				// Remove locally after successful delete
				setEntries((prevEntries) =>
					prevEntries.filter((entry) => entry._id !== item._id)
				);
			} else {
				console.error("Failed to delete diary entry:", res.status);
			}
		} catch (err) {
			console.error("Error deleting diary entry:", err);
		}
	};

	//List Element
	return (
		<>
			<li className="list-row flex flex-row justify-between">
				<div className="flex flex-col justify-start content-start">
					<p className="text-left">{item.item.name}</p>
					<p className="text-left">{item.item?.brand}</p>
				</div>
				<div className="flex flex-row">
					<button
						className="btn btn-square btn-ghost min-w-fit p-3 my-auto
"
						onClick={handleOpenDetails}
					>
						<Eye className="stroke-blue-600" />{" "}
						{/* opens pop up with Ingredient Details */}
					</button>

					<button
						className="btn btn-square btn-ghost min-w-fit pl-3 my-auto"
						onClick={handleRemove}
					>
						<CircleMinus className="stroke-red-800 " />
					</button>
				</div>
			</li>
		</>
	);
};

export default EntryPreview;
