import ProjectCanvas from "@/components/ProjectCanvas";
import React from "react";
import SideBar from "../../../components/Sidebar";

const Page = async ({
    params,
}: {
    params: {
        projectId: string;
    };
}) => {
    const { projectId } = await params;

    return (
        <div>
            <ProjectCanvas projectId={projectId} />
        </div>
    );
};

export default Page;
