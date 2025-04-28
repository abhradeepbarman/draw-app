import ProjectCanvas from "@/components/ProjectCanvas";

const Page = async ({
    params,
}: {
    params: {
        projectId: string;
    };
}) => {
    const { projectId } = await params;
    console.log("projectId", projectId);

    return <ProjectCanvas projectId={projectId} />;
};

export default Page;
