"use client";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {};

const HeroSection = (props: Props) => {
	const router = useRouter();

	return (
		<section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<div className="text-center">
					<h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 leading-tight">
						Draw. Collaborate.
						<br />
						Create Together.
					</h1>
					<p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
						The most intuitive collaborative whiteboard for teams who think
						visually. Real-time drawing, infinite canvas, and seamless
						collaboration.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
						<button
							onClick={() => router.push("/register")}
							className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-200 cursor-pointer"
						>
							Start Drawing Free
						</button>
						<button className="border-2 border-gray-600 text-gray-300 px-8 py-4 rounded-full text-lg font-semibold hover:border-cyan-400 hover:text-cyan-400 transition-colors">
							Watch Demo
						</button>
					</div>

					{/* Demo Image Placeholder */}
					<div className="relative max-w-5xl mx-auto">
						<div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden border border-gray-700">
							<div className="bg-gray-800 h-12 flex items-center justify-between px-6 border-b border-gray-700">
								<div className="flex space-x-2">
									<div className="w-3 h-3 bg-red-500 rounded-full"></div>
									<div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
									<div className="w-3 h-3 bg-green-500 rounded-full"></div>
								</div>
								<div className="text-sm text-gray-400">Drawlio Workspace</div>
								<div></div>
							</div>
							<div className="h-96 bg-gray-900 relative overflow-hidden">
								<div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black">
									<svg className="w-full h-full" viewBox="0 0 800 400">
										{/* Drawing elements simulation - glowing effect */}
										<defs>
											<filter id="glow">
												<feGaussianBlur stdDeviation="4" result="coloredBlur" />
												<feMerge>
													<feMergeNode in="coloredBlur" />
													<feMergeNode in="SourceGraphic" />
												</feMerge>
											</filter>
										</defs>
										<path
											d="M50 200 Q 150 100 250 200 T 450 200"
											stroke="#06B6D4"
											strokeWidth="4"
											fill="none"
											className="animate-pulse"
											filter="url(#glow)"
										/>
										<circle
											cx="550"
											cy="150"
											r="40"
											fill="#A855F7"
											opacity="0.8"
											filter="url(#glow)"
										/>
										<rect
											x="600"
											y="100"
											width="80"
											height="60"
											fill="#EC4899"
											opacity="0.7"
											rx="8"
											filter="url(#glow)"
										/>
										<path
											d="M100 300 L 200 250 L 180 320 Z"
											fill="#10B981"
											opacity="0.8"
											filter="url(#glow)"
										/>
									</svg>
									{/* Cursor indicators with glow */}
									<div className="absolute top-20 left-32 w-4 h-4 bg-cyan-400 rounded-full animate-bounce shadow-lg shadow-cyan-400/50"></div>
									<div className="absolute top-32 right-40 w-4 h-4 bg-purple-400 rounded-full animate-pulse shadow-lg shadow-purple-400/50"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HeroSection;
