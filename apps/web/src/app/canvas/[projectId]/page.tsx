import ProjectCanvas from "@/components/ProjectCanvas";

const Page = async ({ params }: { params: { projectId: string } }) => {
    const { projectId } = await params;

    return <ProjectCanvas projectId={projectId} />;
};

export default Page;
