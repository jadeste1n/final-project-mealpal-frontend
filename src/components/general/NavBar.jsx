import { Link, useLocation } from "react-router-dom";
import { User } from "lucide-react";
import LogoHorizontal from "/src/assets/logo-horizontal.svg?react";

const NavBar = () => {
	const { pathname } = useLocation();
	//og color: "#154836"
	const color1 = "oklch(59.6% 0.145 163.225)";
	const color2 = "oklch(59.6% 0.145 163.225)";
	const color3 = "oklch(59.6% 0.145 163.225)";
	const color4 = "#E06138 ";
	const color5 = "oklch(59.6% 0.145 163.225)";

	return (
		<div className="navbar bg-base-200 shadow-sm mb-6 sticky top-0 z-10 flex justify-left">
			<a className="text-xl p-6 bg-base-200 rounded-md h-10 flex items-center">
				<LogoHorizontal
					className="w-24"
					style={{
						"--color1": color1,
						"--color2": color2,
						"--color3": color3,
						"--color4": color4,
						"--color5": color5,
					}}
				/>
			</a>
			{pathname !== "/register" && pathname !== "/login" && (
				<Link
					to="/account"
					className={`ml-auto p-1 rounded-2xl not-first:btn-ghost rounded-btn ${
						pathname === "/account" ? "text-green-700 bg-green-200 " : ""
					}`}
				>
					<User className="w-5 h-5" />
				</Link>
			)}
		</div>
	);
};

export default NavBar;
