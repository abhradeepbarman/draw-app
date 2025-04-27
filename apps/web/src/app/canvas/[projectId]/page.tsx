import ProjectCanvas from "@/components/ProjectCanvas";

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
