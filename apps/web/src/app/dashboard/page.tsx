"use client";
import axiosInstance from "@/lib/axios";
import { Button } from "@repo/ui/button";
import { useRouter } from "next/navigation";

const page = () => {
    const router = useRouter();

    async function createCanvas() {
        try {
            const { data: response } = await axiosInstance.post("/project");
            router.push(`canvas/${response.data.id}`);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <Button onclick={createCanvas}>Create Canvas</Button>
        </div>
    );
};

export default page;
