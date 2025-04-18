import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "@/context";
import { signup } from "@/data";

const Signup = () => {
	const { isAuthenticated, setCheckSession, setIsAuthenticated } = useAuth();

	const [{ userName, email, password, confirmPassword }, setForm] = useState({
		userName: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setForm((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (!userName || !email || !password || !confirmPassword) {
				throw new Error("All fields are required");
			}
			if (password !== confirmPassword) {
				throw new Error("Passwords do not match");
			}

			setLoading(true);
			const res = await signup({ userName, email, password }); // 👈 don't send confirmPassword
			setIsAuthenticated(true);
			setCheckSession(true);
			toast.success(res.success);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	if (isAuthenticated) return <Navigate to="/" />;

	return (
		<form
			className="my-5 md:w-1/2 mx-auto flex flex-col gap-3"
			onSubmit={handleSubmit}
		>
			{/* Username */}
			<label className="input input-bordered flex items-center gap-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24"
					viewBox="0 0 24 24"
					width="24"
				>
					<path d="M0 0h24v24H0z" fill="none" />
					<path
						fill="white"
						fill-opacity="0.7"
						d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
					/>
				</svg>
				<input
					name="userName"
					value={userName}
					onChange={handleChange}
					className="grow w-full"
					placeholder="Username"
				/>
			</label>

			{/* Email */}
			<label className="input input-bordered flex items-center gap-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 16 16"
					fill="currentColor"
					className="h-4 w-4 opacity-70"
				>
					<path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
					<path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
				</svg>
				<input
					name="email"
					type="email"
					value={email}
					onChange={handleChange}
					className="grow"
					placeholder="Email"
				/>
			</label>

			{/* Passwords */}
			
				<label className="grow input input-bordered flex items-center gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="24"
						viewBox="0 0 24 24"
						width="24"
					>
						<path d="M0 0h24v24H0z" fill="none" />
						<path
							fill="white"
							fill-opacity="0.7"
							d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
						/>
					</svg>
					<input
						name="password"
						type="password"
						value={password}
						onChange={handleChange}
						className="grow w-full"
						placeholder="Password"
					/>
				</label>

				<label className="grow input input-bordered flex items-center gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="24"
						viewBox="0 0 24 24"
						width="24"
					>
						<path d="M0 0h24v24H0z" fill="none" />
						<path
							fill="white"
							fill-opacity="0.7"
							d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
						/>
					</svg>
					<input
						name="confirmPassword"
						type="password"
						value={confirmPassword}
						onChange={handleChange}
						className="grow"
						placeholder="Confirm Password"
					/>
				</label>
			

			{/* Link + Submit */}
			<small>
				Already have an account?{" "}
				<Link to="/login" className="text-primary hover:underline">
					Log in!
				</Link>
			</small>

			<button className="btn btn-primary self-center" disabled={loading}>
				Create Account
			</button>
		</form>
	);
};

export default Signup;
