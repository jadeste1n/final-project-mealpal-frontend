import { useId } from "react";
import { useState } from "react";
import { Star, MoreHorizontal, X, Trash, ArrowRight, Eye } from "lucide-react";
import EnergySummaryChart from "./EnergySummaryChart";
import { toast } from "react-toastify";

const FridgeItem = ({
  name,
  isFavorite,
  onToggleFavorite,
  onOpenMenu,
  onDelete,
  nutrition,
}) => {
  const modalId = useId();
  const [showMealSelect, setShowMealSelect] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState("");

  const handleAddToDiaryClick = () => {
    setShowMealSelect(true); // open dropdown on button click
  };

  const handleMealSelect = async (meal) => {
    try {
      // Optional: Close the modal
      document.getElementById(modalId).close();

      const token = localStorage.getItem("token"); // or however you store your JWT

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/diary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          meal,
          item: {
            name,
            quantity: 1,
            nutrition,
            source: "fridge",
          },
        }),
      });

      if (!res.ok) throw new Error("Failed to add item to diary");

      setShowMealSelect(false);
      setSelectedMeal("");

      onDelete(true);

      toast.success("Item added to diary and removed from fridge");
    } catch (err) {
      console.error("Add to diary failed:", err);
      alert("Something went wrong.");
    }
  };

  const handleDelete = () => {
    onDelete();
    document.getElementById(modalId).close();
  };

  const toTitleCase = (str) =>
    str
      ?.toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <>
      {/* Card-style item row */}
      <div className="flex items-center justify-between bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition p-4 rounded-xl mb-3">
        <div>
          <span className="text-base font-semibold block">
            {toTitleCase(name)}
          </span>
          {/* You can add more meta info here if needed */}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={onToggleFavorite}>
            <Star
              className="w-5 h-5"
              fill={isFavorite ? "#facc15" : "none"} // yellow-400
              stroke="#facc15"
            />
          </button>
          <button
            onClick={() => document.getElementById(modalId).showModal()}
            className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center"
          >
            <Eye className="w-4 h-4 text-blue-600" />
          </button>
        </div>
      </div>

      {/* Modal */}
      <dialog id={modalId} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <div className="flex justify-between items-start mb-4">
            <form method="dialog">
              <button>
                <X className="w-5 h-5" />
              </button>
            </form>
            <div className="flex gap-4">
              <button onClick={handleDelete}>
                <Trash className="w-5 h-5" />
              </button>
              <button onClick={onToggleFavorite}>
                <Star
                  className="w-5 h-5"
                  fill={isFavorite ? "#facc15" : "none"}
                  stroke="#facc15"
                />
              </button>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-2">{toTitleCase(name)}</h2>
          <p className="text-sm mb-4 text-gray-500">
            Nutritional information per 100g
          </p>

          <div className="bg-gray-100 p-4 rounded-md mb-6">
            <p className="text-sm font-medium mb-2">Energy Summary</p>
            <EnergySummaryChart nutrition={nutrition} />
          </div>

          <div className="modal-action flex flex-col gap-2">
            {showMealSelect ? (
              <select
                className="select select-bordered w-full"
                value={selectedMeal}
                onChange={(e) => {
                  const meal = e.target.value;
                  setSelectedMeal(meal);
                  if (meal) handleMealSelect(meal);
                }}
              >
                <option value="">Select meal...</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            ) : (
              <button
                className="btn btn-block bg-black text-white"
                onClick={handleAddToDiaryClick}
              >
                ADD PRODUCT TO DIARY <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
};

export default FridgeItem;
