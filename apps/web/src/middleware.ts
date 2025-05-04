import { NextRequest, NextResponse } from "next/server";
import axiosInstance from "./lib/axios";

export async function middleware(request: NextRequest) {
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (!accessToken && refreshToken) {
       try {
        await axiosInstance.post("/auth/refresh");
       } catch (error) {
        console.log(error);
       }
    }

    if (!accessToken && !refreshToken) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard", "/canvas/:projectId"],
};
