import { Infinity, Palette, RotateCcw, Save, Users, Zap } from "lucide-react";
import React from "react";

type Props = {};

const Features = (props: Props) => {
	const features = [
		{
			icon: <Zap className="w-8 h-8 text-cyan-400" />,
			title: "Real-time Sync",
			description:
				"Collaborate instantly with your team. See changes as they happen in real-time.",
		},
		{
			icon: <Palette className="w-8 h-8 text-purple-400" />,
			title: "Multiple Tools",
			description:
				"Pens, brushes, shapes, text, and more. Everything you need to bring ideas to life.",
		},
		{
			icon: <Infinity className="w-8 h-8 text-emerald-400" />,
			title: "Infinite Canvas",
			description:
				"Never run out of space. Zoom and pan across an unlimited drawing surface.",
		},
		{
			icon: <RotateCcw className="w-8 h-8 text-orange-400" />,
			title: "Undo & Redo",
			description:
				"Experiment fearlessly with powerful undo/redo functionality.",
		},
		{
			icon: <Save className="w-8 h-8 text-rose-400" />,
			title: "Auto-save",
			description:
				"Your work is automatically saved. Never lose your creative progress again.",
		},
		{
			icon: <Users className="w-8 h-8 text-indigo-400" />,
			title: "Team Collaboration",
			description:
				"Invite unlimited collaborators and work together seamlessly.",
		},
	];

	return (
		<section id="features" className="py-20 bg-gray-800">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
						Everything you need to create
					</h2>
					<p className="text-xl text-gray-300 max-w-3xl mx-auto">
						Powerful features designed for seamless collaboration and limitless
						creativity.
					</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
					{features.map((feature, index) => (
						<div
							key={index}
							className="bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-700 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 hover:transform hover:scale-105"
						>
							<div className="mb-6">{feature.icon}</div>
							<h3 className="text-2xl font-bold text-white mb-4">
								{feature.title}
							</h3>
							<p className="text-gray-400 leading-relaxed">
								{feature.description}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default Features;
