import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import LogoutBtn from "./logout-btn";

type Props = {};

const Navbar = (props: Props) => {
	return (
		<div className="border-b-2">
			<div className="max-w-7xl mx-auto py-3 flex justify-between items-center">
				<p className="text-2xl">Dashboard</p>
				<div className="flex gap-x-4 items-center">
					<Avatar>
						<AvatarImage src="https://github.com/shadcn.png" />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>

					<LogoutBtn />
				</div>
			</div>
		</div>
	);
};

export default Navbar;
