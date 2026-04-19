import ProjectListing from "@/components/ProjectListing"
import StarfieldBackground from "@/components/Starfield"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="flex flex-col  min-h-screen">
      <div className="backdrop-blur-xs w-dvw min-h-dvh
        flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">Welcome to my Portfolio</h1>

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
            

         ]}/>
      </div>
      
       <StarfieldBackground/>
    </div>
  )
}
