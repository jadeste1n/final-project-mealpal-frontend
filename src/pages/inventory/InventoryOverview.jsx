import { useEffect, useState } from "react";
import FridgeItem from "../../components/inventory/FridgeItem"; // Adjust the path as needed
import { getFridgeItems, deleteFridgeItem } from "@/data";
import {
  addFavorite,
  getFavorites,
  removeFavoritesByReferenceId,
} from "@/data";
import { toast } from "react-toastify";

const InventoryOverview = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchFridgeItemsWithFavorites = async () => {
      try {
        const [fridgeItems, favorites] = await Promise.all([
          getFridgeItems(),
          getFavorites("product"),
        ]);

        const favoriteIds = new Set(
          favorites.map((fav) => String(fav.data.referenceId))
        );

        const enrichedItems = fridgeItems.map((item) => ({
          ...item,
          isFavorite: favoriteIds.has(String(item.referenceId)),
        }));

        setItems(enrichedItems);
      } catch (err) {
        console.error("Error fetching fridge items or favorites:", err);
      }
    };

    fetchFridgeItemsWithFavorites();
  }, []);

  const handleToggleFavorite = async (item, currentFavoriteState) => {
    try {
      if (!currentFavoriteState) {
        await addFavorite(item);
        setItems((prev) =>
          prev.map((i) => (i._id === item._id ? { ...i, isFavorite: true } : i))
        );
      } else {
        const favorites = await getFavorites("product");

        const match = favorites.find(
          (fav) =>
            fav?.type === "product" &&
            String(fav?.data?.referenceId) === String(item.referenceId)
        );

        if (!match) {
          console.warn("⚠️ Favorite not found for removal");
          return;
        }

        await removeFavoritesByReferenceId(item.referenceId, "product");

        setItems((prev) =>
          prev.map((i) =>
            i._id === item._id ? { ...i, isFavorite: false } : i
          )
        );
      }
    } catch (err) {
      console.error(
        "❌ Error toggling favorite:",
        err.response?.data || err.message
      );
    }
  };

  const handleOpenMenu = (itemId) => {
    console.log("Open menu for:", itemId);
    // Here you could open a modal or dropdown, depending on your design
  };

  const handleDeleteItem = async (itemId, suppressToast = false) => {
    try {
      await deleteFridgeItem(itemId);
      setItems((prev) => prev.filter((item) => item._id !== itemId));

      if (!suppressToast) {
        toast.success("Item deleted successfully.");
      }
    } catch (err) {
      toast.error("Error deleting item.");
    }
  };

  return (
    <>
      <h1 className="text-xl font-semibold mb-4">Your Fridge</h1>
      <div>
        {items.map((item) => (
          <FridgeItem
            key={item._id}
            name={item.name}
            brand={item.brand}
            nutrition={item.nutrition}
            isFavorite={item.isFavorite}
            onToggleFavorite={() => handleToggleFavorite(item, item.isFavorite)}
            onOpenMenu={() => handleOpenMenu(item._id)}
            onDelete={(suppressToast) =>
              handleDeleteItem(item._id, suppressToast)
            }
          />
        ))}
      </div>
    </>
  );
};

export default InventoryOverview;
