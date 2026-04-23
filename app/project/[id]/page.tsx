import ProjectShowcase from "@/components/ProjectShowcase";
import React from "react";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return (
    <div>
      <ProjectShowcase projectId={id} />
    </div>
  );
}