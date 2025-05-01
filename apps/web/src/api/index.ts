import axiosInstance from "@/lib/axios";

export async function getPreviousChats(projectId: string) {
    try {
        const { data } = await axiosInstance.get(`/chat/all/${projectId}`);
        return data?.data;
    } catch (error) {
        console.log(error);
    }
}

export async function sendShape(projectId: string, message: string) {
    try {
        await axiosInstance.post(`/chat/${projectId}`, {
            message,
        });
        return true;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteShapes(projectId: string, shapes: string[]) {
    try {
        await axiosInstance.delete(`/chat/${projectId}`, {
            data: {
                chats: JSON.stringify(shapes),
            },
        });
        return true;
    } catch (error) {
        console.log(error);
    }
}