"use client";
import { Button } from "@repo/ui/button";

const page = () => {
    return (
        <div>
            <Button
                onclick={() => {
                    console.log("create canvas");
                }}
            >
                Create Canvas
            </Button>
        </div>
    );
};

export default page;
