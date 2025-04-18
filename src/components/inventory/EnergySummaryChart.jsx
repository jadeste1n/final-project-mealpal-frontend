import { PieChart } from "react-minimal-pie-chart";

const EnergySummaryChart = ({ nutrition }) => {
  const { protein, carbs, fat, calories } = nutrition;

  const proteinKcal = protein * 4;
  const carbsKcal = carbs * 4;
  const fatKcal = fat * 9;
  const total = proteinKcal + carbsKcal + fatKcal || 1;

  const proteinPct = Math.round((proteinKcal / total) * 100);
  const carbsPct = Math.round((carbsKcal / total) * 100);
  const fatPct = 100 - proteinPct - carbsPct;

  return (
    <div className="flex gap-4 items-center">
      <div className="relative w-24 h-24">
        <PieChart
          data={[
            { title: "Carbs", value: carbsPct, color: "#48CAE4" },
            { title: "Protein", value: proteinPct, color: "#4CAF50" },
            { title: "Fat", value: fatPct, color: "#F25C3B" },
          ]}
          lineWidth={15}
          rounded
          animate
          startAngle={270}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-sm font-semibold pointer-events-none">
          <div className="text-xl text-base-content">
            {Math.round(calories) || 0}
          </div>
          <div className="text-xs text-gray-500">kcal</div>
        </div>
      </div>

      <div className="text-sm space-y-1">
        <p className="text-green-600 font-semibold">
          Protein ({proteinPct}%) – {protein}g
        </p>
        <p className="text-sky-500 font-semibold">
          Net Carbs ({carbsPct}%) – {carbs}g
        </p>
        <p className="text-red-500 font-semibold">
          Fat ({fatPct}%) – {fat}g
        </p>
      </div>
    </div>
  );
};

export default EnergySummaryChart;
