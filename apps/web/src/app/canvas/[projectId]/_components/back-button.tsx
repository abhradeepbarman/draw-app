import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
	route: string;
};

const BackButton = ({ route }: Props) => {
	const router = useRouter();

	return (
		<div
			onClick={() => router.push(route)}
			className="bg-neutral-700 text-white p-3 rounded-xl border border-neutral-500 cursor-pointer hover:scale-105"
		>
			<ArrowLeft />
		</div>
	);
};

export default BackButton;
