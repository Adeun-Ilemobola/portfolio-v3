"use client"

import ProjectListing from "@/components/ProjectListing"
import SkillsPanel from "@/components/SkillsPanel"
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ContactData, ContactSchema } from "@/lib/Zod/Contact"
import {
  Field,
  FieldError,
  FieldLabel,
  FieldContent,
} from "@/components/ui/field"

import {
  IconBrandJavascript,
  IconCopy,
  IconRefresh,
} from "@tabler/icons-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { api } from "@/lib/eden"

const skillGroups = [
  {
    label: "frontend",
    items: ["Next.js", "React", "Tailwind CSS", "shadcn/ui", "TypeScript", "JavaScript"], 
  },
  {
    label: "backend",
    items: ["Elysia", "Node.js", "Bun", "Prisma", "C++" , "Express.js"  , "better-auth"], 
  },
  {
    label: "tools",
    items: [
      "Git", 
      "Figma", 
      "Postman", 
      "VS Code", 
      "Onshape", 
      "Adobe Photoshop", 
      "Lightroom", 
      "Microsoft Excel" 
    ],
  },
  {
    label: "systems",
    items: [
      "ESP32", 
      "Arduino", 
      "Fusion 360", 
      "3D Printing", 
      "Raspberry Pi", 
      "A/V Equipment" 
    ],
  },
]

export default function Page() {
  const [showContact, setShowContact] = useState(false)
  const [projects, setProjects] = useState<{title: string , projectUrl: string , id: string}[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function fetchProjects() {
      setIsLoading(true)
      try {
        const { data, error } = await api.project.ShowCase.get()
        if (error || !data) {
          console.error("Failed to fetch projects:", error)
          toast.error("Failed to load projects. Please try again later.")
          return
        }

        setProjects(data.response.map((project: any) => ({
          title: project.title,
          projectUrl: `/project/${project.id}`,
          id: project.id,

        })))
      } catch (error) {
        console.error("Failed to fetch projects:", error)
        toast.error("Failed to load projects. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return (
    <main className="flex min-h-screen flex-col backdrop-blur-[2px]">
      <ContactPopup show={showContact} SetShow={setShowContact} />

      <section className="w-full min-h-svh flex justify-center items-center px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
        <div className="mx-auto flex w-full max-w-6xl">
          <div className="max-w-4xl space-y-5 sm:space-y-6">
            <div className="space-y-2">
              {/* Theme-aware primary text */}
              <p className="text-xs uppercase tracking-[0.22em] text-primary/80">
                About Me
              </p>

              {/* Theme-aware foreground and primary span */}
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Hi, I&apos;m Adeun <span className="text-primary">(AD)</span> 👋
              </h1>
            </div>

            {/* Theme-aware muted foreground */}
            <div className="max-w-3xl space-y-4 text-base leading-7 text-foreground/80 sm:text-[17px] sm:leading-8">
              <p>
                I enjoy building practical systems that connect design, software,
                and hands-on technical problem-solving. A lot of what interests me
                lives in that middle space between clean user experience and real
                underlying functionality.
              </p>

              <p>
                I&apos;m currently studying toward an Associate of Science at
                Douglas College, and I keep growing through personal builds,
                experimentation, and technical projects. I work with tools like
                Next.js, TypeScript, and C++, and I learn best by making things
                that have a clear purpose.
              </p>

              <p>
                One project that reflects that well is a custom 2-axis LiDAR
                scanning system I built using sensors, servo motors, a Raspberry Pi,
                control software, and custom 3D-printed components. I like projects
                that require iteration, troubleshooting, and structure.
              </p>

              <p>
                At the core, I care about building things that feel thoughtful,
                reliable, and well put together.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
              <Button variant="outline" size="lg"  className="w-full sm:w-auto">
                <a href="/resume.pdf" target="_blank" rel="noreferrer">
                  Resume
                </a>
              </Button>

              <Button variant="outline" size="lg"  className="w-full sm:w-auto">
                <a
                  href="https://github.com/your-username"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              </Button>

              <Button
                size="lg"
                onClick={() => setShowContact(true)}
                className="w-full sm:w-auto"
              >
                Contact / Get in Touch
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full min-h-svh px-4 pb-10 sm:px-6 sm:pb-14 lg:px-8 lg:pb-20">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:gap-6">
          <SkillsPanel groups={skillGroups} />

          <ProjectListing
            listing={[
              ...projects
            ]}
            isLoading={isLoading}
          />
        </div>
      </section>
    </main>
  )
}

type ContactPopupProps = {
  SetShow: React.Dispatch<React.SetStateAction<boolean>>
  show: boolean
}

function ContactPopup({ SetShow, show }: ContactPopupProps) {
  const [payload, setPayload] = useState<ContactData>({
    name: "",
    email: "",
    message: "",
    company: "",
  })
  const [payloadErrors, setPayloadErrors] = useState<
    Partial<Record<keyof ContactData, string>>
  >({})
  const [isSending, setIsSending] = useState(false)

  async function SendMsg() {
    setIsSending(true)
    const vaidation = ContactSchema.safeParse(payload)

    if (!vaidation.success) {
      console.error("Validation failed:", vaidation.error)
      const errors = vaidation.error.flatten().fieldErrors
      setPayloadErrors(
        Object.fromEntries(
          Object.entries(errors).map(([key, value]) => [key, value?.[0] || ""])
        )
      )
      setIsSending(false)
      return
    }

    try {
      const { data, error } = await api.contact.post(payload)
      if (error || !data || !data.success) {
        console.error("Failed to send message:", error)
        setIsSending(false)
        toast.error("Failed to send message. Please try again later.")
        return
      }

      toast.success("Message sent successfully!")
      setPayload({
        name: "",
        email: "",
        message: "",
        company: "",
      })
      setPayloadErrors({})
      setIsSending(false)
      SetShow(false)
    } catch (error) {
      console.error("Failed to send message:", error)
      setIsSending(false)
      toast.error("Failed to send message. Please try again later.")
    }
  }

  return (
    <Dialog
      open={show}
      onOpenChange={() => SetShow(false)}
      onOpenChangeComplete={(open) => {
        if (!open) {
          setPayload({
            name: "",
            email: "",
            message: "",
            company: "",
          })
          setPayloadErrors({})
          setIsSending(false)
        }
      }}
    >
      {/* Root Dialog component handles the frosted overlay now */}
      <DialogOverlay />

      <DialogContent
        className="
          overflow-hidden rounded-2xl
          sm:max-w-3xl
          sm:max-h-[75vh]
        "
      >
        {/* Subtle theme-aware inner sheen */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-foreground/[0.05] to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(var(--primary),0.05),transparent_30%)]" />

        <div className="relative z-10 flex flex-col gap-5 p-4 sm:p-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-wide text-foreground">
              Contact Me
            </h2>
            <p className="text-sm text-muted-foreground">
              Feel free to reach out for collaborations or just a friendly hello.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="name" className="text-foreground/90">
                  Name
                </FieldLabel>
                {/* Notice how clean this is now! The root component does the glass styling. */}
                <Input
                  id="name"
                  type="text"
                  placeholder="Max Leiter"
                  value={payload.name ?? ""}
                  onChange={(e) =>
                    setPayload((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
                <FieldError>{payloadErrors.name}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="email" className="text-foreground/90">
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="max.leiter@example.com"
                  value={payload.email ?? ""}
                  onChange={(e) =>
                    setPayload((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
                <FieldError>{payloadErrors.email}</FieldError>
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="company" className="text-foreground/90">
                  Company (optional)
                </FieldLabel>
                <Input
                  id="company"
                  type="text"
                  placeholder="Acme Corp"
                  value={payload.company ?? ""}
                  onChange={(e) =>
                    setPayload((prev) => ({ ...prev, company: e.target.value }))
                  }
                />
                <FieldError>{payloadErrors.company}</FieldError>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="message" className="text-foreground/90">
                Message
              </FieldLabel>

              <FieldContent>
                {/* Editor Metaphor updated with theme tokens */}
                <InputGroup
                  className="
                    overflow-hidden
                    border-border/30
                    bg-muted/10
                    shadow-lg
                  "
                >
                  <InputGroupAddon
                    align="block-start"
                    className="
                      border-b border-border/20
                      bg-muted/5
                    "
                  >
                    <InputGroupText
                      className="
                        border-0 bg-transparent
                        font-mono font-medium text-foreground/80
                      "
                    >
                      <IconBrandJavascript className="text-primary mr-1" size={16}/>
                      script.js
                    </InputGroupText>

                    <InputGroupButton
                      onClick={() =>
                        setPayload((prev) => ({ ...prev, message: "" }))
                      }
                      className="ml-auto text-muted-foreground hover:text-foreground"
                      size="icon-xs"
                    >
                      <IconRefresh size={14}/>
                    </InputGroupButton>

                    <InputGroupButton
                      variant="ghost"
                      size="icon-xs"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <IconCopy size={14}/>
                    </InputGroupButton>
                  </InputGroupAddon>

                  <InputGroupTextarea
                    id="message"
                    placeholder="// Tell me about your project, idea, or collaboration request..."
                    className="
                      min-h-[180px] sm:min-h-[220px]
                      border-0 bg-transparent
                      px-4 py-4
                      font-mono text-[14px] leading-7 text-foreground/90
                      placeholder:text-muted-foreground/50
                    "
                    value={payload.message ?? ""}
                    onChange={(e) =>
                      setPayload((prev) => ({ ...prev, message: e.target.value }))
                    }
                  />

                  <InputGroupAddon
                    align="block-end"
                    className="
                      border-t border-border/20
                      bg-muted/5
                    "
                  >
                    <InputGroupText
                      className="
                        border-0 bg-transparent
                        font-mono text-xs text-muted-foreground/70
                      "
                    >
                      Line {(payload.message ?? "").split('\n').length}, Column {(payload.message ?? "").length}
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </FieldContent>

              <FieldError>{payloadErrors.message}</FieldError>
            </Field>

            <div className="flex justify-end gap-3 mt-2">
              <Button
                variant="destructive"
                onClick={() => {
                  SetShow(false);
                  setPayload({
                    name: "",
                    email: "",
                    message: "",
                    company: "",
                  });
                  setPayloadErrors({});
                  setIsSending(false);
                }}
              >
                Cancel
              </Button>

              <Button
                onClick={SendMsg}
                disabled={isSending}
                className="min-w-[120px]"
              >
                {isSending ? "Sending..." : "Send Message"}
              </Button>
            </div>
            
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}