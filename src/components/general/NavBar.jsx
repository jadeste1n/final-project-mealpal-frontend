import { Link } from "react-router-dom";
import LogoHorizontal from "/src/assets/logo-horizontal.svg?react";

const NavBar = () => {
	const color1 = "#154836";
	const color2 = "#154836 ";
	const color3 = "#154836";
	const color4 = "#E06138 ";
	const color5 = "#154836";

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
		</div>
	);
};

export default NavBar;
