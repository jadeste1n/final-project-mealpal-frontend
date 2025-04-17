import React from "react";
import {Clock, BarChart3, UtensilsCrossed} from "lucide-react";

const iconmap = {
    time: <Clock className="w-4 h-4" />,
    difficulty: <BarChart3 className="w-4 h-4" />,
    meal: <UtensilsCrossed className="w-4 h-4" />
};

const RecipeBadge = ({ type, value }) => {
    const icon = iconmap[type] || null;

    return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded-full ">{icon}{value}</span>
    );
};
export default RecipeBadge;


//Shows the basic info for the recipe like time, difficulty and meal type