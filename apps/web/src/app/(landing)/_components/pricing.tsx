"use client";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {};

const Pricing = (props: Props) => {
	const router = useRouter();

	return (
		<section id="pricing" className="py-20 bg-gray-900">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
						Simple, transparent pricing
					</h2>
					<p className="text-xl text-gray-300">
						Choose the plan that works best for you and your team.
					</p>
				</div>

				<div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
					{/* Free Plan */}
					<div className="bg-gray-800 border-2 border-gray-700 rounded-2xl p-8 hover:border-cyan-500/50 transition-colors">
						<div className="text-center mb-8">
							<h3 className="text-2xl font-bold text-white mb-2">Free</h3>
							<div className="text-5xl font-bold text-white mb-2">$0</div>
							<p className="text-gray-400">Perfect for getting started</p>
						</div>

						<ul className="space-y-4 mb-8">
							<li className="flex items-center">
								<Check className="w-5 h-5 text-emerald-400 mr-3" />
								<span className="text-gray-300">Up to 3 collaborators</span>
							</li>
							<li className="flex items-center">
								<Check className="w-5 h-5 text-emerald-400 mr-3" />
								<span className="text-gray-300">5 drawings limit</span>
							</li>
							<li className="flex items-center">
								<Check className="w-5 h-5 text-emerald-400 mr-3" />
								<span className="text-gray-300">Basic drawing tools</span>
							</li>
							<li className="flex items-center">
								<Check className="w-5 h-5 text-emerald-400 mr-3" />
								<span className="text-gray-300">PNG/JPG export</span>
							</li>
							<li className="flex items-center">
								<X className="w-5 h-5 text-gray-600 mr-3" />
								<span className="text-gray-600">Version history</span>
							</li>
						</ul>

						<button
							onClick={() => router.push("/register")}
							className="w-full border-2 border-gray-600 text-gray-300 py-3 rounded-full font-semibold hover:border-cyan-400 hover:text-cyan-400 transition-colors cursor-pointer"
						>
							Get Started Free
						</button>
					</div>

					{/* Pro Plan */}
					<div className="bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl shadow-cyan-500/20">
						<div className="absolute top-4 right-4 bg-white text-purple-600 px-3 py-1 rounded-full text-sm font-semibold">
							Popular
						</div>

						<div className="text-center mb-8">
							<h3 className="text-2xl font-bold mb-2">Pro</h3>
							<div className="text-5xl font-bold mb-2">$12</div>
							<p className="text-cyan-100">per user / month</p>
						</div>

						<ul className="space-y-4 mb-8">
							<li className="flex items-center">
								<Check className="w-5 h-5 text-emerald-300 mr-3" />
								<span>Unlimited collaborators</span>
							</li>
							<li className="flex items-center">
								<Check className="w-5 h-5 text-emerald-300 mr-3" />
								<span>Unlimited drawings</span>
							</li>
							<li className="flex items-center">
								<Check className="w-5 h-5 text-emerald-300 mr-3" />
								<span>Advanced tools & brushes</span>
							</li>
							<li className="flex items-center">
								<Check className="w-5 h-5 text-emerald-300 mr-3" />
								<span>All export formats</span>
							</li>
							<li className="flex items-center">
								<Check className="w-5 h-5 text-emerald-300 mr-3" />
								<span>Version history</span>
							</li>
							<li className="flex items-center">
								<Check className="w-5 h-5 text-emerald-300 mr-3" />
								<span>Priority support</span>
							</li>
						</ul>

						<button className="cursor-pointer w-full bg-white text-purple-600 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg">
							Start Pro Trial
						</button>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Pricing;
