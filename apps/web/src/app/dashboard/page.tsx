"use client";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";
import Navbar from "./_components/navbar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { RotateCw } from "lucide-react";
import CanvasList from "./_components/canvas-list";

const Dashboard = () => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const handleCreateCanvas = async () => {
		setIsLoading(true);
		try {
			const { data: response } = await axiosInstance.post("/project");
			router.push(`canvas/${response.data.id}`);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div>
			<Navbar />
			<div className="max-w-7xl mx-auto py-3">
				<Button
					className="cursor-pointer w-[120px]"
					onClick={handleCreateCanvas}
				>
					{isLoading ? <RotateCw className="animate-spin" /> : "Create Canvas"}
				</Button>
				<CanvasList />
			</div>
		</div>
	);
};

export default Dashboard;
