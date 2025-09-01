"use client";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useLayoutEffect, useState } from "react";
import toast from "react-hot-toast";

interface User {
	id: string;
	name: string;
	email: string;
}

interface AuthContextType {
	user: User | null;
	loading: boolean;
	isLoggedIn: boolean;
	register: (data: any) => Promise<void>;
	login: (data: any) => Promise<void>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const router = useRouter();

	useLayoutEffect(() => {
		const loadUser = async () => {
			try {
				const res = await axiosInstance.get("/auth/me");
				setUser({
					id: res.data?.data.id,
					name: res.data?.data.name,
					email: res.data?.data.email,
				});
				setIsLoggedIn(true);
			} catch {
				setUser(null);
				setIsLoggedIn(false);
			} finally {
				setLoading(false);
			}
		};
		loadUser();
	}, []);

	const register = async (data: any) => {
		setLoading(true);
		try {
			const res = await axiosInstance.post("/auth/register", data);
			setUser(res.data.data);
			setIsLoggedIn(true);
			router.push("/dashboard");
			toast.success("User registered successfully");
		} catch (error) {
			console.log(error);
			toast.error("User registration failed");
		} finally {
			setLoading(false);
		}
	};

	const login = async (data: any) => {
		setLoading(true);
		try {
			const res = await axiosInstance.post("/auth/login", data);
			setUser(res.data.data);
			setIsLoggedIn(true);
			router.push("/dashboard");
			toast.success("User logged in successfully");
		} catch (error) {
			console.log(error);
			toast.error("User login failed");
		} finally {
			setLoading(false);
		}
	};

	const logout = async () => {
		setLoading(true);
		try {
			await axiosInstance.post("/auth/logout");
			setUser(null);
			setIsLoggedIn(false);
			router.push("/login");
			toast.success("User logged out successfully");
		} catch (error) {
			console.log(error);
			toast.error("User logout failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<AuthContext.Provider
			value={{ user, loading, isLoggedIn, register, login, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
	return ctx;
};
