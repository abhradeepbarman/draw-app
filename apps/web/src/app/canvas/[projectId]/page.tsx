import React from "react";
import ProjectCanvas from "./_components/project-canvas";

interface ParamsProps {
	projectId: string;
}

interface SearchParams {
	redirect: string;
}

async function Canvas({
	params,
	searchParams,
}: {
	params: Promise<ParamsProps>;
	searchParams: Promise<SearchParams>;
}) {
	const { projectId } = await params;
	const { redirect } = await searchParams;

	return <ProjectCanvas projectId={projectId} redirect={redirect == "true"} />;
}

export default Canvas;
