import IngredientSearchResult from "../../components/search/IngredientSearchResult";
import SearchBar from "../../components/search/SearchBar";
import TabsSelection from "../../components/search/TabSelection";
import BottomDrawer from "../../components/search/BottomDrawer";
import Modal from "../../components/general/Modal";
import { AppContext } from "../../App";
import { useState, useContext, useEffect } from "react";

const Search = () => {
	const {
		searchResults,
		setSearchResults,
		selection,
		setSelection,
		addToSelection,
		setAddToSelection,
		modalState,
		closeModal,
		content,
	} = useContext(AppContext);

	//Prevent User from adding products diary if going back to fridge tab: If addToSelection changes, reset selection to zero
	useEffect(() => {
		setSelection([]);
	}, [addToSelection]);

	return (
		<div className="pb-32">
			{/* Selection Where to Add Items To -> Controls Conditional Rendering */}
			<select
				className="select select-ghost mb-4 w-full text-center bg-primary"
				value={addToSelection}
				onChange={(e) => setAddToSelection(e.target.value)}
			>
				<option>Add To Fridge</option>
				<option>Add To Diary</option>
			</select>
			<SearchBar /> {/* Search Bar Component */}
			<TabsSelection
				AddToSelection={addToSelection}
				ingredients={searchResults}
			/>
			{modalState && (
				<Modal isOpen={modalState} onClose={closeModal}>
					{content}
				</Modal>
			)}
			<BottomDrawer selection={selection} />
			{/* Tab Element w. individual List */}
			{/* List Element open/close */}
		</div>
	);
};

export default Search;
