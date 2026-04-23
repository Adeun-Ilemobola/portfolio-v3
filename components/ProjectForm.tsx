import { generateMockProject, ProjectStored, ProjectStoredSchema } from '@/lib/Zod/project'
import React, {
  useState
  , useEffect
} from 'react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import {
  Field,
  FieldError,
  FieldLabel,
  FieldContent
} from "@/components/ui/field"
import { set } from 'date-fns'
import { Button } from './ui/button'
import { Input } from './ui/input'
import Tagform from './Tagform'
import { IconBrandJavascript, IconRefresh } from '@tabler/icons-react'
import VideoLinkForm from './videoLink'
import ImageForm from './ImageForm'
import { toast } from 'sonner'
import { api } from '@/lib/eden'
type ProjectFormProps = {
  id: string | undefined
}
export default function ProjectForm({ id }: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectStored>({
    id: '',
    title: '',
    description: '',
    tags: [],
    files: [],
    url: '',
    githubUrl: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    videos: [],
  })
  const [error, setError] = useState<Partial<Record<keyof ProjectStored, string>>>({})
  const [mode, setMode] = useState<'create' | 'edit'>(id ? 'edit' : 'create')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if you are actively typing in a form field
      if (
        e.target instanceof HTMLElement &&
        (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
      ) {
        return;
      }

      // Check for 'z' or 'Z' key press
      const key = e.key.toLowerCase();
      if (key === "z" || key === "Z") {
        e.preventDefault(); 
        
        const generatedData = generateMockProject();
          setFormData(generatedData)
        
        console.log(`Mock data generated via '${e.key}' key:`, generatedData);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []); // Empty dependency array ensures this only runs on mount/unmount

  useEffect(() => {
    if (id) {
      setMode('edit')
      // Fetch project data by ID and populate formData
      // Example:
      // const project = await fetchProjectById(id);
      // setFormData(project);
    }
  }, [id])


  async function Submit() {
    setLoading(true)
    toast.loading(mode === 'create' ? "Creating project..." : "Saving changes...", { id: "project-form" })
    const validation = ProjectStoredSchema.safeParse(formData)
    if (!validation.success) {
      const zodErrors = validation.error.flatten()
      const fieldErrors: Partial<Record<keyof ProjectStored, string>> = Object.fromEntries(
          Object.entries(zodErrors.fieldErrors).map(([field, errors]) => [field, errors?.join(", ")] as [keyof ProjectStored, string])
         )
      
      setError(fieldErrors)
      setLoading(false)
      toast.dismiss("project-form")
    
      return
    }
    const payload = validation.data
    try {
      if (mode === 'create') {
        console.log("Creating project with payload:", payload)
        const {data, error ,} = await api.project.create.post(payload)
        if (error) {
         if (error.status === 422){
            toast.error("Validation error: " + error.value.message, {id:"project-form"})
         }
         if (error.status === 500){
          toast.error("Server error: " + error.value.message, {id:"project-form"})
         }

        } else {
          toast.success("Project created successfully!" , {id:"project-form"})
        }
      } else {
        if (!id) {
          toast.error("Project ID is missing for update." , {id:"project-form"})
          console.error("Project ID is missing for update.")
          setLoading(false)
          return
        }
        console.log("Updating project with ID:", id, "and payload:", payload)
        const {data, error} = await api.project.update({id}).put(payload)
        if (error) {
          if (error.status === 422){
             toast.error("Validation error: " + error.value.message, {id:"project-form"})
          }
          if (error.status === 500){
           toast.error("Server error: " + error.value.message, {id:"project-form"})
          }
 
         } else {
           toast.success("Project updated successfully!" , {id:"project-form"})
         }
      }
    } catch (err) {
      console.error(err)
      toast.error("An error occurred while saving the project." , {id:"project-form"})
    } finally {
      toast.dismiss("project-form")
      setLoading(false)
      if (mode === 'create'){
          ClearForm()
      }else{
        // Optionally, you can refetch the project data to ensure the form is up-to-date
      }
    
    }

  }
  function ClearForm() {
    setFormData({
      id: '',
      title: '',
      description: '',
      tags: [],
      files: [],
      url: '',
      githubUrl: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      videos: [],
    })
    setError({})

  }
  return (
    <div
      className="flex flex-col gap-4 max-w-5xl mx-auto p-4"
    >

      <div className=' flex flex-row gap-4  sm:flex-col sm:gap-1.5 md:gap-2'>
        <Field>
          <FieldLabel>Title</FieldLabel>
          <FieldContent>
            <InputGroup>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                disabled={loading}

              />
            </InputGroup>
            {error.title && <FieldError>{error.title}</FieldError>}
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel>Url</FieldLabel>
          <FieldContent>
            <InputGroup>
              <Input
                type="text"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                disabled={loading}
              />
            </InputGroup>
            {error.url && <FieldError>{error.url}</FieldError>}
          </FieldContent>
        </Field>

      </div>


      <div className=' flex flex-row gap-4  sm:flex-col sm:gap-1.5 md:gap-2'>
        <Field>
          <FieldLabel>Github Url</FieldLabel>
          <FieldContent>
            <InputGroup>
              <Input
                type="text"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                disabled={loading}
              />
            </InputGroup>
            {error.githubUrl && <FieldError>{error.githubUrl}</FieldError>}
          </FieldContent>
        </Field>




        <Field>
          <FieldLabel>Tags</FieldLabel>
          <FieldContent>

            <Tagform
              tags={formData.tags}
              onAddTag={(tag) => setFormData({ ...formData, tags: [...formData.tags, tag] })}
              onRemoveTag={(tag) => setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) })}
              isDisabled={loading}
            />

            {error.tags && <FieldError>{error.tags}</FieldError>}
          </FieldContent>
        </Field>


      </div>


      <Field>
        <FieldLabel>Videos</FieldLabel>
        <FieldContent>

          <VideoLinkForm
            videos={formData.videos}
            AddVideo={(video) => {
              setFormData({ ...formData, videos: [...formData.videos, { ...video }] })
            }}
            RemoveVideo={(id) => setFormData({ ...formData, videos: formData.videos.filter(v => v.id !== id) })}
            isDisabled={loading}
          />

          {error.videos && <FieldError>{error.videos}</FieldError>}
        </FieldContent>
      </Field>


      <div className="grid w-full  gap-4">
        <InputGroup>
          <InputGroupTextarea
            id="textarea-code-32"
            placeholder="Project description, technologies used, challenges faced, etc."
            className="min-h-90"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            disabled={loading}
          />

          <InputGroupAddon align="block-start" className="border-b">
            <InputGroupText className="font-mono font-medium">
              <IconBrandJavascript />
              Description.js
            </InputGroupText>
            <InputGroupButton onClick={() => setFormData(pre => ({ ...pre, description: "" }))} className="ml-auto" size="icon-xs">
              <IconRefresh />
            </InputGroupButton>

          </InputGroupAddon>
        </InputGroup>
      </div>


      <ImageForm
        images={formData.files ?? []}
        onDelete={(id) =>
          setFormData((prev) => ({
            ...prev,
            files: prev.files .filter((f) => f.id !== id),
          }))
        }
        onSubmit={(file) =>
          setFormData((prev) => ({
            ...prev,
            files: [...prev.files, file],
          }))
        }
        changeImageStatus={(id, status, ) =>
          setFormData((prev) => ({
            ...prev,
            files:prev.files .map((f) =>
              f.id === id
                ? {
                  ...f,
                  uploadStatus: status,
                }
                : f
            ),
          }))
        }
        isDisabled={loading}
      />










      {mode === 'edit' && (<>

        <Button
          onClick={Submit}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>




      </>)}


      {mode === 'create' && (<>
        <div className="flex flex-row gap-2">
          <Button
            onClick={Submit}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Project'}
          </Button>
          <Button
            variant="outline"
            onClick={ClearForm}
            disabled={loading}
          >
            Clear Form
          </Button>
        </div>


      </>)}

    </div>
  )
}
