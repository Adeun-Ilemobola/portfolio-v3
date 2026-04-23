import { ProjectStored, ProjectStoredSchema } from '@/lib/Zod/project'
import { t } from 'elysia'
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
    const validation = ProjectStoredSchema.safeParse(formData)
    if (!validation.success) {
      const zodErrors = validation.error.flatten()
      const fieldErrors: Partial<Record<keyof ProjectStored, string>> = {}
      setError(fieldErrors)
      setLoading(false)
      return
    }
    const payload = validation.data
    try {
      if (mode === 'create') {
        // Call API to create project
      } else {
        // Call API to update project
      }
    } catch (err) {
      // Handle API error
    } finally {
      setLoading(false)
      ClearForm()
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
