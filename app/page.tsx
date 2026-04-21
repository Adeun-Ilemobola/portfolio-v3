"use client"

import ProjectListing from "@/components/ProjectListing"
import SkillsPanel from "@/components/SkillsPanel"
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ContactData, ContactSchema } from "@/lib/Zod/Contact"
import { LocalFile } from "@/lib/Zod/file"
import {
  Field,
  FieldError,
  FieldLabel,
  FieldContent
} from "@/components/ui/field"

import {
  IconBrandJavascript,
  IconCopy,
  IconCornerDownLeft,
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
    items: ["Next.js", "React", "Tailwind CSS", "shadcn/ui", "TypeScript"],
  },
  {
    label: "backend",
    items: ["Elysia", "Node.js", "Bun", "Prisma"],
  },
  {
    label: "tools",
    items: ["Git", "Figma", "Postman", "VS Code"],
  },
  {
    label: "systems",
    items: ["ESP32", "Arduino", "Fusion 360", "3D Printing"],
  },
];
export default function Page() {
  const [images, setImages] = useState<LocalFile[]>([]);
  // const [tags, setTags] = useState<string[]>([]);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    console.log("Current images:", images);
  }, [images]);




  return (
    <div className="flex flex-col  min-h-screen">
      <div className="backdrop-blur-xs w-dvw min-h-dvh flex justify-center items-center">

        <ContactPopup show={showContact} SetShow={setShowContact} />
        <div className="flex max-w-4xl flex-col items-start gap-5">
  <div className="space-y-2">
    <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">
      About Me
    </p>

    <h1 className="text-5xl font-bold tracking-tight text-white">
      Hi, I&apos;m Adeun <span className="text-cyan-200">(AD)</span> 👋
    </h1>
  </div>

  <div className="max-w-3xl space-y-4 text-[17px] leading-8 text-white/72">
    <p>
      I enjoy building practical systems that connect design, software, and
      hands-on technical problem-solving. A lot of what interests me lives in
      that middle space between clean user experience and real underlying
      functionality.
    </p>

    <p>
      I&apos;m currently studying toward an Associate of Science at Douglas College,
      and I keep growing through personal builds, experimentation, and technical
      projects. I work with tools like Next.js, TypeScript, and C++, and I learn
      best by making things that have a clear purpose.
    </p>

    <p>
      One project that reflects that well is a custom 2-axis LiDAR scanning
      system I built using sensors, servo motors, a Raspberry Pi, control
      software, and custom 3D-printed components. I like projects that require
      iteration, troubleshooting, and structure.
    </p>

    <p>
      At the core, I care about building things that feel thoughtful, reliable,
      and well put together.
    </p>
  </div>

  <div className="flex flex-wrap gap-3 pt-2">
    <Button
      variant="outline"
      size="lg"
      className="
        rounded-xl border-white/10
        bg-white/[0.04] text-white
        hover:border-cyan-300/25 hover:bg-cyan-300/10 hover:text-cyan-100
      "
      asChild
    >
      <a href="/resume.pdf" target="_blank" rel="noreferrer">
        Resume
      </a>
    </Button>

    <Button
      variant="outline"
      size="lg"
      className="
        rounded-xl border-white/10
        bg-white/[0.04] text-white
        hover:border-cyan-300/25 hover:bg-cyan-300/10 hover:text-cyan-100
      "
      asChild
    >
      <a href="https://github.com/your-username" target="_blank" rel="noreferrer">
        GitHub
      </a>
    </Button>

    <Button
      size="lg"
      onClick={() => setShowContact(true)}
      className="
        rounded-xl border border-cyan-300/20
        bg-cyan-300 text-[#04131A]
        hover:bg-cyan-200
      "
    >
      Contact / Get in Touch
    </Button>
  </div>
</div>








      </div>


      <div className="backdrop-blur-xs w-full min-h-dvh grid gap-0.5 md:grid-cols-2 max-w-7xl mx-auto p-4 justify-items-center">
        <SkillsPanel groups={skillGroups} />



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


    </div>
  )
}

type ContactPopupProps = {
  SetShow: React.Dispatch<React.SetStateAction<boolean>>;
  show: boolean;
}
function ContactPopup({ SetShow, show }: ContactPopupProps) {
  const [payload, setPayload] = useState<ContactData>({
    name: "",
    email: "",
    message: "",
    company: "",
    phone: "",
  });
  const [payloadErrors, setPayloadErrors] = useState<Partial<Record<keyof ContactData, string>>>({});
  const [isSending, setIsSending] = useState(false);




  async function SendMsg() {
    setIsSending(true);
    const vaidation = ContactSchema.safeParse(payload);
    if (!vaidation.success) {
      console.error("Validation failed:", vaidation.error);
      const errors = vaidation.error.flatten().fieldErrors;
      setPayloadErrors(Object.fromEntries(Object.entries(errors).map(([key, value]) => [key, value?.[0] || ""])));
      setIsSending(false);
      return;
    }
    try {
      const { data, error } = await api.contact.post(payload);
      if (error || !data || !data.success) {
        console.error("Failed to send message:", error);
        setIsSending(false);
        toast.error("Failed to send message. Please try again later.");
        return;
      }
      toast.success("Message sent successfully!");
      setIsSending(false);
    } catch (error) {
      console.error("Failed to send message:", error);
      setIsSending(false);
      toast.error("Failed to send message. Please try again later.");

    }


  }




  return (
    <Dialog
      open={show}
      onOpenChange={() => SetShow(false)}
      onOpenChangeComplete={(open) => {
        if (!open) {
          setPayload(ContactSchema.parse({}));
          setPayloadErrors({});
          setIsSending(false);
        }
      }}
    >
      <DialogOverlay
        className="
        bg-[#081120]/36
        backdrop-blur-lg
        backdrop-saturate-125
      "
      />

      <DialogContent
        className="
        overflow-hidden rounded-2xl border border-white/10
        bg-[#101b2f]/85 p-0 text-white
        shadow-[0_18px_60px_rgba(0,0,0,0.38)]
        backdrop-blur-2xl
        sm:max-w-3xl
      "
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.10),rgba(255,255,255,0.02))]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(88,199,255,0.10),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(122,108,255,0.10),transparent_25%)]" />

        <div className="relative z-10 flex flex-col gap-5 p-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-wide text-white">
              Contact Me
            </h2>
            <p className="text-sm text-white/55">
              Feel free to reach out for collaborations or just a friendly hello.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="name" className="text-white/85">
                  Name
                </FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Max Leiter"
                  value={payload.name ?? ""}
                  onChange={(e) =>
                    setPayload((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="
                   border-white/10
                  bg-white/[0.04] text-white
                  placeholder:text-white/35
                  focus-visible:border-cyan-300/25
                  focus-visible:ring-2 focus-visible:ring-cyan-300/20
                "
                />
                <FieldError className="text-red-300/85">
                  {payloadErrors.name}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="email" className="text-white/85">
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
                  className="
                   border-white/10
                  bg-white/[0.04] text-white
                  placeholder:text-white/35
                  focus-visible:border-cyan-300/25
                  focus-visible:ring-2 focus-visible:ring-cyan-300/20
                "
                />
                <FieldError className="text-red-300/85">
                  {payloadErrors.email}
                </FieldError>
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="company" className="text-white/85">
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
                  className="
                   border-white/10
                  bg-white/[0.04] text-white
                  placeholder:text-white/35
                  focus-visible:border-cyan-300/25
                  focus-visible:ring-2 focus-visible:ring-cyan-300/20
                "
                />
                <FieldError className="text-red-300/85">
                  {payloadErrors.company}
                </FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="phone" className="text-white/85">
                  Phone (optional)
                </FieldLabel>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 234 567 8901"
                  value={payload.phone ?? ""}
                  onChange={(e) =>
                    setPayload((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="
                   border-white/10
                  bg-white/[0.04] text-white
                  placeholder:text-white/35
                  focus-visible:border-cyan-300/25
                  focus-visible:ring-2 focus-visible:ring-cyan-300/20
                "
                />
                <FieldError className="text-red-300/85">
                  {payloadErrors.phone}
                </FieldError>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="message" className="text-white/85">
                Message
              </FieldLabel>

              <FieldContent>
                <InputGroup
                  className="
                  overflow-hidden 
                  border border-white/10
                  bg-[#0d1628]/70
                  shadow-[0_12px_30px_rgba(0,0,0,0.24)]
                  backdrop-blur-xl
                "
                >
                  <InputGroupAddon
                    align="block-start"
                    className="
                    border-b border-white/10
                    bg-white/[0.03]
                  "
                  >
                    <InputGroupText
                      className="
                      border-0 bg-transparent
                      font-mono font-medium text-cyan-100/90
                    "
                    >
                      <IconBrandJavascript className="text-cyan-200" />
                      script.js
                    </InputGroupText>

                    <InputGroupButton
                      onClick={() =>
                        setPayload((prev) => ({ ...prev, message: "" }))
                      }
                      className="
                      ml-auto border-white/10
                      bg-white/[0.03] text-white/70
                      hover:bg-cyan-300/10 hover:text-cyan-100
                    "
                      size="icon-xs"
                    >
                      <IconRefresh />
                    </InputGroupButton>

                    <InputGroupButton
                      variant="ghost"
                      size="icon-xs"
                      className="
                      text-white/70
                      hover:bg-cyan-300/10 hover:text-cyan-100
                    "
                    >
                      <IconCopy />
                    </InputGroupButton>
                  </InputGroupAddon>

                  <InputGroupTextarea
                    id="message"
                    placeholder="// Tell me about your project, idea, or collaboration request..."
                    className="
                    min-h-[220px]
                    border-0 bg-transparent
                    px-4 py-4
                    font-mono text-[14px] leading-7 text-white/90
                    placeholder:text-white/28
                    focus-visible:ring-0 focus-visible:outline-none
                  "
                    value={payload.message ?? ""}
                    onChange={(e) =>
                      setPayload((prev) => ({ ...prev, message: e.target.value }))
                    }
                  />

                  <InputGroupAddon
                    align="block-end"
                    className="
                    border-t border-white/10
                    bg-white/[0.025]
                  "
                  >
                    <InputGroupText
                      className="
                      border-0 bg-transparent
                      font-mono text-xs text-white/45
                    "
                    >
                      Line {(payload.message ?? "").length}, Column {(payload.message ?? "").length}
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </FieldContent>

              <FieldError className="text-red-300/85">
                {payloadErrors.message}
              </FieldError>
            </Field>

            <Button
              onClick={SendMsg}
              disabled={isSending}
              className="
              self-end  border border-cyan-300/20
              bg-cyan-300 text-[#04131A]
              hover:bg-cyan-200
            "
            >
              {isSending ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
