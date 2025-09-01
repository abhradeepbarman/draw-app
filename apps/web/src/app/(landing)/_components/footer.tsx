"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {};

const Footer = (props: Props) => {
	const router = useRouter();

	return (
		<footer className="bg-black text-white py-16">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid md:grid-cols-4 gap-8 mb-12">
					<div className="md:col-span-2 cursor-pointer">
						<div
							className="flex items-center mb-4"
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
						<p className="text-gray-400 text-lg leading-relaxed max-w-md">
							The collaborative whiteboard that brings your team's ideas to
							life. Create, collaborate, and innovate together.
						</p>
					</div>

					<div>
						<h4 className="text-lg font-semibold mb-4">Product</h4>
						<ul className="space-y-2">
							<li>
								<a
									href="#"
									className="text-gray-400 hover:text-cyan-400 transition-colors"
								>
									Features
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-gray-400 hover:text-cyan-400 transition-colors"
								>
									Pricing
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-gray-400 hover:text-cyan-400 transition-colors"
								>
									Updates
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-gray-400 hover:text-cyan-400 transition-colors"
								>
									Mobile App
								</a>
							</li>
						</ul>
					</div>

					<div>
						<h4 className="text-lg font-semibold mb-4">Legal</h4>
						<ul className="space-y-2">
							<li>
								<a
									href="#"
									className="text-gray-400 hover:text-cyan-400 transition-colors"
								>
									Terms of Service
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-gray-400 hover:text-cyan-400 transition-colors"
								>
									Privacy Policy
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-gray-400 hover:text-cyan-400 transition-colors"
								>
									Cookie Policy
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-gray-400 hover:text-cyan-400 transition-colors"
								>
									GDPR
								</a>
							</li>
						</ul>
					</div>
				</div>

				<div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
					<p className="text-gray-400 mb-4 md:mb-0">
						© 2025 Drawlio. All rights reserved.
					</p>
					<div className="flex space-x-6">
						<a
							href="#"
							className="text-gray-400 hover:text-cyan-400 transition-colors"
						>
							Twitter
						</a>
						<a
							href="#"
							className="text-gray-400 hover:text-cyan-400 transition-colors"
						>
							LinkedIn
						</a>
						<a
							href="#"
							className="text-gray-400 hover:text-cyan-400 transition-colors"
						>
							GitHub
						</a>
						<a
							href="#"
							className="text-gray-400 hover:text-cyan-400 transition-colors"
						>
							Discord
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
