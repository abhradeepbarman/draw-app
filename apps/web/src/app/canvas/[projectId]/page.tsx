import React from "react";
import ProjectCanvas from "./_components/ProjectCanvas";

type Props = {
	params: {
		projectId: string;
	};
};

async function Canvas({ params }: Props) {
	const { projectId } = await params;
	return <ProjectCanvas projectId={projectId} />;
}

export default Canvas;
