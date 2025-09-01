"use client";
import { ChevronDown } from "lucide-react";
import React, { useState } from "react";

type Props = {};

const Faq = (props: Props) => {
	const [openFaq, setOpenFaq] = useState(null);
	const toggleFaq = (index: any) => {
		setOpenFaq(openFaq === index ? null : index);
	};

	const faqs = [
		{
			question: "How does real-time collaboration work?",
			answer:
				"Drawlio uses WebSocket technology to sync changes instantly across all connected devices. You'll see your teammates' cursors and changes in real-time.",
		},
		{
			question: "Can I use Drawlio offline?",
			answer:
				"Yes! Drawlio works offline and automatically syncs your changes when you're back online. Your work is never lost.",
		},
		{
			question: "What file formats can I export to?",
			answer:
				"You can export your drawings as PNG, JPG, SVG, or PDF. Pro users also get access to PSD and AI format exports.",
		},
		{
			question: "Is there a limit to canvas size?",
			answer:
				"No limits! Our infinite canvas grows as you draw. Zoom out to see the big picture or zoom in for detailed work.",
		},
		{
			question: "How secure is my data?",
			answer:
				"All data is encrypted in transit and at rest. We use enterprise-grade security and never share your drawings with third parties.",
		},
	];

	return (
		<section id="faq" className="py-20 bg-gray-800">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
						Frequently asked questions
					</h2>
					<p className="text-xl text-gray-300">
						Everything you need to know about Drawlio.
					</p>
				</div>

				<div className="space-y-4">
					{faqs.map((faq, index) => (
						<div
							key={index}
							className="bg-gray-900 rounded-2xl shadow-sm border border-gray-700 overflow-hidden"
						>
							<button
								onClick={() => toggleFaq(index)}
								className="w-full px-8 py-6 text-left flex justify-between items-center transition-colors cursor-pointer"
							>
								<span className="text-lg font-semibold text-white">
									{faq.question}
								</span>
								<ChevronDown
									className={`w-5 h-5 text-gray-400 transition-transform ${
										openFaq === index ? "transform rotate-180" : ""
									}`}
								/>
							</button>
							{openFaq === index && (
								<div className="px-8 pb-6">
									<p className="text-gray-400 leading-relaxed">{faq.answer}</p>
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default Faq;
