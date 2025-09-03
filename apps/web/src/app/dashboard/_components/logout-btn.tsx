import { useAuth } from "@/context/AuthContext";

const LogoutBtn = () => {
	const { logout } = useAuth();

	return (
		<button
			className="bg-red-500 text-white px-4 py-2 rounded"
			onClick={logout}
		>
			Logout
		</button>
	);
};

export default LogoutBtn;
