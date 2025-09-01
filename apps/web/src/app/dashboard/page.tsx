"use client";
import axiosInstance from "@/lib/axios";
import {
	FileText,
	FolderPlus,
	Grid3x3,
	List,
	MoreHorizontal,
	Palette,
	Plus,
	Search,
	Sparkles,
	User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Header from "./_components/header";

const Dashboard = () => {
	const [activeTab, setActiveTab] = useState("All");
	const [viewMode, setViewMode] = useState("grid");
	const router = useRouter();

	// Mock data for existing drawings
	const drawings = [
		{
			id: 1,
			name: "UI Wireframe Design",
			created: "2 days ago",
			edited: "1 day ago",
			comments: 3,
			author: "You",
			type: "drawing",
		},
		{
			id: 2,
			name: "Marketing Campaign Flow",
			created: "1 week ago",
			edited: "3 days ago",
			comments: 7,
			author: "You",
			type: "drawing",
		},
		{
			id: 3,
			name: "Product Architecture",
			created: "2 weeks ago",
			edited: "1 week ago",
			comments: 12,
			author: "Team",
			type: "drawing",
		},
		{
			id: 4,
			name: "User Journey Map",
			created: "3 weeks ago",
			edited: "2 weeks ago",
			comments: 5,
			author: "You",
			type: "drawing",
		},
		{
			id: 5,
			name: "System Integration Diagram",
			created: "1 month ago",
			edited: "3 weeks ago",
			comments: 8,
			author: "Team",
			type: "drawing",
		},
	];

	const tabs = ["All", "Recent", "Created by Me", "Shared"];

	const createCanvas = async () => {
		try {
			const { data: response } = await axiosInstance.post("/project");
			router.push(`canvas/${response.data.id}`);
		} catch (error) {
			console.log(error);
		}
	};

	const filteredDrawings = drawings.filter((drawing) => {
		if (activeTab === "All") {
			return true;
		} else if (activeTab === "Recent") {
			return drawing.edited === "1 day ago";
		} else if (activeTab === "Created by Me") {
			return drawing.author === "You";
		} else if (activeTab === "Shared") {
			return drawing.author === "Team";
		}
		return false;
	});

	return (
		<div className="min-h-screen bg-gray-900">
			{/* Header */}
			<Header />

			<div className="flex">
				{/* Sidebar */}
				<aside className="w-64 bg-gray-800 border-r border-gray-700 min-h-screen">
					<div className="p-6">
						{/* Create New Button */}
						<button
							onClick={createCanvas}
							className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 mb-6"
						>
							<Plus className="w-5 h-5" />
							<span>New Drawing</span>
						</button>

						{/* Navigation */}
						<nav className="space-y-2">
							<button className="w-full flex items-center space-x-3 px-3 py-2 text-white bg-gray-700 rounded-lg">
								<Grid3x3 className="w-5 h-5" />
								<span>All Drawings</span>
								<span className="ml-auto text-xs text-gray-400">A</span>
							</button>

							<button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
								<FolderPlus className="w-5 h-5" />
								<span>Team Folders</span>
							</button>

							<button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
								<FileText className="w-5 h-5" />
								<span>Templates</span>
								<span className="ml-auto text-xs bg-cyan-500 text-white px-1.5 py-0.5 rounded">
									T
								</span>
							</button>

							<button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
								<User className="w-5 h-5" />
								<span>Shared with Me</span>
								<span className="ml-auto text-xs text-gray-400">S</span>
							</button>
						</nav>
					</div>
				</aside>

				{/* Main Content */}
				<main className="flex-1 p-6">
					{/* Tabs & Actions */}
					<div className="flex items-center justify-between mb-6">
						<div className="flex space-x-6">
							{tabs.map((tab) => (
								<button
									key={tab}
									onClick={() => setActiveTab(tab)}
									className={`pb-2 border-b-2 transition-colors ${
										activeTab === tab
											? "text-cyan-400 border-cyan-400"
											: "text-gray-400 border-transparent hover:text-gray-300"
									}`}
								>
									{tab}
								</button>
							))}
						</div>

						<div className="flex items-center space-x-2">
							<button
								onClick={() => setViewMode("grid")}
								className={`p-2 rounded-lg transition-colors ${
									viewMode === "grid"
										? "text-cyan-400 bg-gray-800"
										: "text-gray-400 hover:text-white"
								}`}
							>
								<Grid3x3 className="w-5 h-5" />
							</button>
							<button
								onClick={() => setViewMode("list")}
								className={`p-2 rounded-lg transition-colors ${
									viewMode === "list"
										? "text-cyan-400 bg-gray-800"
										: "text-gray-400 hover:text-white"
								}`}
							>
								<List className="w-5 h-5" />
							</button>
						</div>
					</div>

					{/* Create New Cards */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
						<button
							onClick={createCanvas}
							className="group bg-gray-800 border-2 border-dashed border-gray-600 rounded-xl p-8 hover:border-cyan-500 hover:bg-gray-750 transition-all duration-200 flex flex-col items-center space-y-3"
						>
							<div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center group-hover:bg-cyan-500 transition-colors">
								<Plus className="w-6 h-6 text-gray-400 group-hover:text-white" />
							</div>
							<div>
								<h3 className="text-white font-medium">
									Create a Blank Drawing
								</h3>
								<p className="text-gray-400 text-sm">
									Start with an empty canvas
								</p>
							</div>
						</button>

						<div className="relative">
							<button className="group bg-gray-800 border-2 border-dashed border-gray-600 rounded-xl p-8 hover:border-purple-500 hover:bg-gray-750 transition-all duration-200 flex flex-col items-center space-y-3 w-full">
								<div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center group-hover:bg-purple-500 transition-colors">
									<Sparkles className="w-6 h-6 text-gray-400 group-hover:text-white" />
								</div>
								<div>
									<h3 className="text-white font-medium">AI-Powered Design</h3>
									<p className="text-gray-400 text-sm">
										Generate with AI assistance
									</p>
								</div>
							</button>
							<div className="absolute inset-0 bg-black/30 backdrop-blur-xs rounded-xl flex items-center justify-center pointer-events-none">
								<span className="text-white font-semibold text-sm">
									Available Soon
								</span>
							</div>
						</div>

						<div className="relative">
							<button className="group bg-gray-800 border-2 border-dashed border-gray-600 rounded-xl p-8 hover:border-emerald-500 hover:bg-gray-750 transition-all duration-200 flex flex-col items-center space-y-3 w-full">
								<div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
									<FileText className="w-6 h-6 text-gray-400 group-hover:text-white" />
								</div>
								<div>
									<h3 className="text-white font-medium">Use Template</h3>
									<p className="text-gray-400 text-sm">Start with a template</p>
								</div>
							</button>
							<div className="absolute inset-0 bg-black/30 backdrop-blur-xs rounded-xl flex items-center justify-center pointer-events-none">
								<span className="text-white font-semibold text-sm">
									Available Soon
								</span>
							</div>
						</div>
					</div>

					{/* Drawings List */}
					{viewMode === "list" ? (
						<div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
							{/* Table Header */}
							<div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-750 border-b border-gray-700 text-sm font-medium text-gray-400 uppercase tracking-wider">
								<div className="col-span-4">Name</div>
								<div className="col-span-2">Created</div>
								<div className="col-span-2">Last Edited</div>
								<div className="col-span-2">Comments</div>
								<div className="col-span-1">Author</div>
								<div className="col-span-1"></div>
							</div>

							{/* Table Rows */}
							{/* {filteredDrawings.map((drawing) => (
								<div
									key={drawing.id}
									className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer group"
								>
									<div className="col-span-4 flex items-center space-x-3">
										<div className="w-10 h-10 bg-gradient-to-br from-cyan-400/20 to-purple-500/20 rounded-lg flex items-center justify-center">
											<Palette className="w-5 h-5 text-cyan-400" />
										</div>
										<div>
											<h3 className="text-white font-medium group-hover:text-cyan-400 transition-colors">
												{drawing.name}
											</h3>
										</div>
									</div>
									<div className="col-span-2 text-gray-400 text-sm flex items-center">
										{drawing.created}
									</div>
									<div className="col-span-2 text-gray-400 text-sm flex items-center">
										{drawing.edited}
									</div>
									<div className="col-span-2 text-gray-400 text-sm flex items-center">
										{drawing.comments}
									</div>
									<div className="col-span-1 flex items-center">
										<div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
											<span className="text-white text-xs font-medium">
												{drawing.author === "You" ? "Y" : "T"}
											</span>
										</div>
									</div>
									<div className="col-span-1 flex items-center justify-end">
										<button className="p-1 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all">
											<MoreHorizontal className="w-4 h-4" />
										</button>
									</div>
								</div>
							))} */}
						</div>
					) : (
						// Grid View
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{filteredDrawings.map((drawing) => (
								<div
									key={drawing.id}
									className="group bg-gray-800 rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all duration-200 overflow-hidden cursor-pointer hover:transform hover:scale-105"
								>
									{/* Thumbnail */}
									<div className="h-48 bg-gradient-to-br from-gray-700 to-gray-800 relative overflow-hidden">
										<div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-purple-500/10 flex items-center justify-center">
											<Palette className="w-12 h-12 text-cyan-400/50" />
										</div>
										<div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
											<button className="p-2 bg-gray-900/80 rounded-lg text-gray-400 hover:text-white">
												<MoreHorizontal className="w-4 h-4" />
											</button>
										</div>
									</div>

									{/* Content */}
									<div className="p-4">
										<h3 className="text-white font-medium mb-2 group-hover:text-cyan-400 transition-colors">
											{drawing.name}
										</h3>
										<div className="flex items-center justify-between text-sm text-gray-400">
											<span>Edited {drawing.edited}</span>
											<div className="flex items-center space-x-2">
												<span>{drawing.comments}</span>
												<div className="w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center">
													<span className="text-white text-xs">
														{drawing.author === "You" ? "Y" : "T"}
													</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					)}

					{/* Empty State */}
					{filteredDrawings.length === 0 && (
						<div className="text-center py-16">
							<div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-4">
								<Search className="w-8 h-8 text-gray-400" />
							</div>
							<h3 className="text-white font-medium mb-2">No drawings found</h3>
							<p className="text-gray-400">
								Try adjusting your search terms or create a new drawing
							</p>
						</div>
					)}
				</main>
			</div>
		</div>
	);
};

export default Dashboard;
