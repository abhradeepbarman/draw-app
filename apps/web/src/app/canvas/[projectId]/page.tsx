import ProjectCanvas from "@/components/ProjectCanvas";

const Page = ({ params }: { params: { projectId: string } }) => {
    const { projectId } = params;

    return <ProjectCanvas projectId={projectId} />;
};

export default Page;
