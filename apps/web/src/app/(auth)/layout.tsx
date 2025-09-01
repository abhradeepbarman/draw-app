"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

type Props = { children: React.ReactNode };

const layout = ({ children }: Props) => {
	const { isLoggedIn } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (isLoggedIn) router.push("/dashboard");
	}, [isLoggedIn, router]);

	return <>{children}</>;
};

export default layout;
