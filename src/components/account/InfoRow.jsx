import { ChevronRight } from "lucide-react";

const InfoRow = ({ label, field, value, onClick }) => {
  return (
    <div
      onClick={() => onClick(field)}
      className="flex justify-between items-center bg-base-200 rounded-lg px-4 py-4 mb-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition"
    >
      <span className="text-base font-medium capitalize">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-base">
          {field === "weight" && value ? `${value} kg` : value ?? "—"}
        </span>
        <ChevronRight size={20} className="text-gray-500" />
      </div>
    </div>
  );
};

export default InfoRow;
