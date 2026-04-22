import { ProjectStored } from '@/lib/Zod/project'
import { t } from 'elysia'
import React , {useState
    ,useEffect
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
type ProjectFormProps = {
  id: string | null
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
    })
    const [error, setError] = useState<Partial<Record<keyof ProjectStored, string>>>({})
    const [mode, setMode] = useState<'create' | 'edit'>(id ? 'edit' : 'create')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (id) {
           
        }
    }, [id])
  return (
    <div
        className="flex flex-col gap-4 "
    >




        {mode === 'edit'&&(<>
        
        
        </>)}


        {mode === 'create'&&(<>
        
        
        </>)}
      
    </div>
  )
}
