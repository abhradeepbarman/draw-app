import axiosInstance from "@/lib/axios";

export async function sendChat({
    projectId,
    message,
}: {
    projectId: string;
    message: string;
}) {
    try {
        const response = await axiosInstance.post(`/chat/${projectId}`, {
            message,
        });

        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getAllChats(projectId: string) {
    try {
        const response = await axiosInstance.get(`/chat/all/${projectId}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
