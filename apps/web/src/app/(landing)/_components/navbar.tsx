"use client";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {};

const Navbar = (props: Props) => {
	const router = useRouter();
	const { isLoggedIn } = useAuth();

	return (
		<nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-800">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<div
						className="flex items-center cursor-pointer"
						onClick={() => router.push("/")}
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
					<div className="hidden md:flex space-x-8">
						<a
							href="#features"
							className="text-gray-300 hover:text-cyan-400 transition-colors"
						>
							Features
						</a>
						<a
							href="#pricing"
							className="text-gray-300 hover:text-cyan-400 transition-colors"
						>
							Pricing
						</a>
						<a
							href="#faq"
							className="text-gray-300 hover:text-cyan-400 transition-colors"
						>
							FAQ
						</a>
					</div>
					{isLoggedIn ? (
						<button
							className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-200 cursor-pointer"
							onClick={() => router.push("/dashboard")}
						>
							Dashboard
						</button>
					) : (
						<div className="flex space-x-4">
							<button
								onClick={() => router.push("/login")}
								className="text-gray-300 hover:text-cyan-400 transition-colors cursor-pointer"
							>
								Sign In
							</button>
							<button
								className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-200 cursor-pointer"
								onClick={() => router.push("/register")}
							>
								Try Free
							</button>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
