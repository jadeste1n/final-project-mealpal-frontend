import { Outlet } from "react-router-dom";
import BottomNav from "../components/general/BottomNav";

const MainLayout = () => {
	return (
		<>
			<div className="mx-auto w-[88vw] sm:w-[90vw] lg:max-w-[1290px] pb-20">
				<Outlet />
			</div>
			<BottomNav />
		</>
	);
};

export default MainLayout;
