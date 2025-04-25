import React from "react";

const page = ({
    params,
}: {
    params: {
        projectId: string;
    };
}) => {
    return <div>
        Canvas {params.projectId}
    </div>;
};

export default page;
