import { useAuth } from "@/context/AuthContext";

const LogoutBtn = () => {
	const { logout } = useAuth();

	const handleLogout = async () => {
		await logout();
	};

	return (
		<button
			className="bg-red-500 text-white px-4 py-2 rounded"
			onClick={handleLogout}
		>
			Logout
		</button>
	);
};

export default LogoutBtn;
