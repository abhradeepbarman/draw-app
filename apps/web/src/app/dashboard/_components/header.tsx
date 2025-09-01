"use client";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import LogoutBtn from "./logout-btn";
import { useRouter } from "next/navigation";

type Props = {};

const Header = (props: Props) => {
	const router = useRouter();
	const { isLoggedIn } = useAuth();

	return (
		<header className="bg-gray-800 border-b border-gray-700">
			<div className="px-6 py-3">
				<div className="flex items-center justify-between">
					{/* Logo & Team */}
					<div className="flex items-center space-x-4">
						<div
							className="flex items-center cursor-pointer"
							onClick={() => router.push("/dashboard")}
						>
							<Image
								src={"/logo.png"}
								alt="Drawlio"
								width={40}
								height={40}
								className="mr-1"
							/>
							<span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
								Drawlio
							</span>
						</div>
					</div>

					{/*Actions */}
					<div className="flex items-center space-x-4">
						{/* User Menu */}
						<div className="flex items-center space-x-2">
							<div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
								<span className="text-white text-sm font-medium">U</span>
							</div>
							{isLoggedIn && <LogoutBtn />}
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
