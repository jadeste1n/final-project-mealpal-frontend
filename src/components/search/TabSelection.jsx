import SearchBar from "./SearchBar";
import { useContext } from "react";
import { AppContext } from "../../App";
import IngredientSearchResult from "./IngredientSearchResult";
import { Lock } from "lucide-react";

const TabsSelection = ({ AddToSelection, ingredients }) => {
	//AddToSelection = tab visibility //ingredients = List of ingredients component
	const { isLoading, delayedQuery, setSelectedTab } = useContext(AppContext);

	return (
		<>
			<div role="tablist" className="tabs tabs-border">
				<input
					type="radio"
					name="my_tabs_1"
					className="tab text-primary hover:text-primary"
					aria-label="New"
					onClick={() => setSelectedTab("new")}
					defaultChecked
				/>
				<div className="tab-content rounded-md  border-base-300 bg-base-100 p-0">
					{" "}
					{isLoading && (
						<div className="text-xs text-muted pt-10 pb-10">Searching...</div>
					)}
					{!isLoading &&
					ingredients.length === 0 &&
					delayedQuery.length !== 0 ? (
						<p className="text-sm opacity-70 pt-10 pb-10">
							No ingredients found.
						</p>
					) : !isLoading &&
					  ingredients.length === 0 &&
					  delayedQuery.length === 0 ? (
						<p className="text-sm opacity-70 pt-10 pb-10">Type for Search</p>
					) : (
						!isLoading && (
							<ul className="list bg-base-100 rounded-box shadow-md">
								<li className="pt-6 pb-4 text-xs opacity-60 tracking-wide ">
									{ingredients.length} Results found
								</li>
								{ingredients.map((ingredient) => (
									<IngredientSearchResult
										key={ingredient._id || ingredient.id}
										ingredient={ingredient}
										inDrawer={false}
									/>
								))}
							</ul>
						)
					)}
				</div>
				<input
					type="radio"
					name="my_tabs_1"
					className="tab text-primary hover:text-primary"
					aria-label="Favorites"
					onClick={() => setSelectedTab("favorites")}
				/>
				<div className="tab-content rounded-md  border-base-300 bg-base-100 p-0">
					{isLoading && (
						<div className="text-xs text-muted pt-10 pb-10">Searching...</div>
					)}
					{!isLoading && ingredients.length === 0 ? (
						<p className="text-sm opacity-70 pt-10 pb-10">
							No ingredients in Favorites.
						</p>
					) : (
						!isLoading && (
							<ul className="list bg-base-100 rounded-box shadow-md">
								<li className="pt-6 pb-4 text-xs opacity-60 tracking-wide">
									{ingredients.length} Results found
								</li>
								{ingredients.map((ingredient) => (
									<IngredientSearchResult
										key={ingredient._id || ingredient.id}
										ingredient={ingredient}
										inDrawer={false}
									/>
								))}
							</ul>
						)
					)}
				</div>
				<input
					type="radio"
					name="my_tabs_1"
					className={`tab text-primary hover:text-primary ${
						AddToSelection === "Add To Diary" ? "" : "hidden"
					}`}
					aria-label="Fridge"
					onClick={() => setSelectedTab("fridge")}
				/>
				<div className="tab-content rounded-md border-base-300 bg-base-100 p-0">
					{isLoading && (
						<div className="text-xs text-muted pt-10 pb-10">Searching...</div>
					)}
					{!isLoading && ingredients.length === 0 ? (
						<p className="text-sm opacity-70 pt-10 pb-10">
							No ingredients in Fridge.
						</p>
					) : (
						!isLoading &&
						ingredients.length !== 0 && (
							<ul className="list bg-base-100 rounded-box shadow-md">
								<li className="pt-6 pb-4 text-xs opacity-60 tracking-wide">
									{ingredients.length} Results found
								</li>
								{ingredients.map((ingredient) => (
									<IngredientSearchResult
										key={ingredient._id || ingredient.id}
										ingredient={ingredient}
										inDrawer={false}
									/>
								))}
							</ul>
						)
					)}
				</div>
				<input
					type="radio"
					name="my_tabs_1"
					className={`tab text-primary hover:text-primary ${
						AddToSelection === "Add To Diary" ? "" : "hidden"
					}`}
					aria-label="Recipes"
					onClick={() => setSelectedTab("recipes")}
				/>
				<div className="tab-content rounded-md  border-base-300 bg-base-100 p-0">
					{/*}
					<div className="flex items-center gap-4 p-4 border border-yellow-400/30 bg-yellow-50 text-yellow-900 rounded-2xl shadow-sm">
						<div className="bg-yellow-100 p-2 rounded-full">
							<Lock className="w-6 h-6 text-yellow-600" />
						</div>
						<div>
							<h3 className="font-semibold text-base text-left">Unlock this Feature</h3>
							<p className="text-sm text-yellow-800 text-left">
								This Feature will be available as Beta for Premium Members soon. Stay tuned!
							</p>
						</div>
					</div>*/}
					{isLoading && (
						<div className="text-xs text-muted pt-10 pb-10">Searching...</div>
					)}
					{!isLoading && ingredients.length === 0 ? (
						<p className="text-sm opacity-70 pt-10 pb-10">
							No Saved Recipes
						</p>
					) : (
						!isLoading &&
						ingredients.length !== 0 && (
							<ul className="list bg-base-100 rounded-box shadow-md">
								<li className="pt-6 pb-4 text-xs opacity-60 tracking-wide">
									{ingredients.length} Results found
								</li>
								{ingredients.map((ingredient) => (
									<IngredientSearchResult
										key={ingredient._id || ingredient.id}
										ingredient={ingredient}
										inDrawer={false}
									/>
								))}
							</ul>
						)
					)}
				</div>
			</div>
		</>
	);
};

export default TabsSelection;
