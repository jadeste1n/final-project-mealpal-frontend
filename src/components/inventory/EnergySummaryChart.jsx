import {
	CircularProgressbarWithChildren,
	buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useLocation } from "react-router-dom";

const EnergySummaryChart = ({ nutrition }) => {
	const { protein, carbs, fat, calories } = nutrition;
	const location = useLocation();
	const isDiary = location.pathname.includes("diary");

	// Convert grams to kcal (protein & carbs = 4 kcal/g, fat = 9 kcal/g)
	const proteinKcal = protein * 4;
	const carbsKcal = carbs * 4;
	const fatKcal = fat * 9;

	const total = proteinKcal + carbsKcal + fatKcal || 1; // Avoid division by 0

	const proteinPct = Math.round((proteinKcal / total) * 100);
	const carbsPct = Math.round((carbsKcal / total) * 100);
	const fatPct = 100 - proteinPct - carbsPct; // ensure total = 100

	return (
		<div className="flex gap-4 items-center">
			<div className="w-24 h-24 relative">
				{/* Outer gray ring */}
				<CircularProgressbarWithChildren
					value={100}
					strokeWidth={12}
					styles={buildStyles({
						pathColor: "rgba(55, 65, 81, 0.2)", // gray
						trailColor: "transparent",
					})}
				>
					{/* Carbs ring */}
					{carbsPct > 0 && (
						<CircularProgressbarWithChildren
							value={carbsPct}
							strokeWidth={12}
							styles={buildStyles({
								pathColor: "#48CAE4", // blue
								trailColor: "transparent",
							})}
						>
							{/* Protein ring */}
							{proteinPct > 0 && (
								<CircularProgressbarWithChildren
									value={proteinPct}
									strokeWidth={12}
									styles={buildStyles({
										pathColor: "#90EE90", // green
										trailColor: "transparent",
									})}
								>
									{/* Fat ring */}
									{fatPct > 0 && (
										<CircularProgressbarWithChildren
											value={fatPct}
											strokeWidth={12}
											styles={buildStyles({
												pathColor: "#F25C3B", // red
												trailColor: "transparent",
											})}
										/>
									)}
								</CircularProgressbarWithChildren>
							)}
						</CircularProgressbarWithChildren>
					)}
				</CircularProgressbarWithChildren>

				{/* Calorie count always visible */}
				<div className="absolute inset-0 flex flex-col items-center justify-center text-sm font-semibold pointer-events-none">
					<div
						className={`text-xl ${isDiary ? "text-primary" : "text-gray-800"}`}
					>
						{Math.round(calories) || 0}
					</div>
					<div className="text-xs text-gray-500">kcal</div>
				</div>
			</div>

			{/* Macronutrient breakdown */}
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
