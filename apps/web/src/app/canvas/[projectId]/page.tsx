import React from "react";
import ProjectCanvas from "./_components/ProjectCanvas";

type Props = {
	projectId: string;
};

async function Canvas(params: Promise<Props>) {
	const { projectId } = await params;
	return <ProjectCanvas projectId={projectId} />;
}

export default Canvas;
