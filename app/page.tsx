
import { serverApi } from "@/lib/server/eden";

import ImageForm from "@/components/ImageForm"
import ProjectListing from "@/components/ProjectListing"
import StarfieldBackground from "@/components/Starfield"
import Tagform from "@/components/Tagform"
import { Button } from "@/components/ui/button"
import { LocalFile } from "@/lib/Zod/file"
// import { useState } from "react"

export default async function Page() {
  // const [images, setImages] = useState<LocalFile[]>([]);
  // const [tags, setTags] = useState<string[]>([]);

  const hello = await serverApi.get();
  const status = await serverApi.status.get();
  const profile = await serverApi.profile.get();
  const projects = await serverApi.projects.get();
  const echoed = await serverApi.echo.post({
    name: "))))",
  });


  return (
    <div className="flex flex-col  min-h-screen">
      <div className="backdrop-blur-xs w-dvw min-h-dvh
        flex ">
        <h1 className="text-4xl font-bold text-white">Welcome to my Portfolio</h1>

        <h1 className="text-2xl font-semibold">Elysia Test</h1>

        <div className="mt-4 space-y-2">
          <p>GET result: {JSON.stringify(hello.data)}</p>
          <p>Status: {JSON.stringify(status.data)}</p>
          <p>Profile: {JSON.stringify(profile.data)}</p>
          <p>Projects: {JSON.stringify(projects.data)}</p>
          <p>POST result: {JSON.stringify(echoed.data)}</p>
        </div>
        {/* <ImageForm 
          images={images} 
          onDelete={(id) => {
            setImages(images.filter((img) => img.id !== id));
          }} 
          onSubmit={(files) => {
            let newImages = new Set([...files, ...images]);
            setImages(Array.from(newImages));
          }} 
          upDateImages={(image) => {
            setImages(images.map((img) => img.id === image.id ? image : img));
          }} /> */}



        {/* <Tagform
            tags={tags}
            onAddTag={(tag) => setTags([...tags, tag])}
            onRemoveTag={(tag) => setTags(tags.filter((t) => t !== tag))}
          /> */}

      </div>


      <div className="backdrop-blur-xs w-dvw min-h-dvh
        flex ">
        <ProjectListing listing={[
          {
            title: "Project 1",
            projectUrl: "/project-1"
          },
          {
            title: "Project 2",
            projectUrl: "/project-2"
          },
          {
            title: "Project 3",
            projectUrl: "/project-3"
          },
          {
            title: "Project 4",
            projectUrl: "/project-4"
          },
          {
            title: "Project 5",
            projectUrl: "/project-5"
          },
          {
            title: "Project 6",
            projectUrl: "/project-6"
          }


        ]} />
      </div>

      <StarfieldBackground />
    </div>
  )
}
