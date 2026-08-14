"use client";
import { useParams } from 'next/navigation'
import useAuthGuard from "@/hooks/useAuthGuard";
import React, { useState , useEffect } from "react";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProjectForm from '@/components/ProjectForm';
import { api } from '@/lib/eden';
import ProjectListing from '@/components/ProjectListing';

export default function Page() {
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<{ title: string; projectUrl: string , id: string }[]>([]);
  const [projectId, setProjectId] = useState<string | null>(null);
  const  [mode, setMode] = useState<"create" | "update"  |null>(null);

  const { isAuthenticated, sendAuthRequest, createSession } = useAuthGuard({
    ShowAuthPopup: setShowAuthPopup,
  });

  async function handleAuthRequest() {
    return await sendAuthRequest();
  }

  async function handleCreateSession(code: string) {
    return await createSession(code);
  }

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
    <div className="flex min-h-dvh w-dvw backdrop-blur-xs bg-background/5 text-foreground">
      <AuthPopup
        ShowAuthPopup={setShowAuthPopup}
        show={showAuthPopup}
        onClick={handleAuthRequest}
        onSendCode={handleCreateSession}
      />

      {isAuthenticated ? (<>
        <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
          <Tabs defaultValue="project" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="project">Create / Update project</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="project">
              {mode ===  null && (
                <div className="flex flex-col items-start gap-4">
                  <Button onClick={() => setMode("create")}>Create New Project</Button>
                  <ProjectListing 
                    listing={projects} 
                    edit={true} 
                    isLoading={isLoading} 
                    onEdit={(projectID) => {
                      setProjectId(projectID);
                      setMode("update");
                    }}
                    onView={(projectUrl) => {
                      window.open(projectUrl, "_blank");
                    }}
                    onDelete={(projectID) => {
                      // Handle delete logic here
                    }}
                  />
                </div>
              )}
              {mode !== null && (
                <Button 
                variant="ghost" 
                onClick={() => setMode(null)}
                className={""}
                >
                  Back to project list
                </Button>
              )}
              {(mode === "create" || mode === "update") && (
                <ProjectForm 
                id={projectId} 
                onfinish={() => {
                  setMode(null);
                  setProjectId(null);
                }}
                />
              )}
            </TabsContent>
            <TabsContent value="password">Change your password here.</TabsContent>
          </Tabs>
        </div>
      </>) : null
      }
    </div>
  );
}

type AuthPopupProps = {
  ShowAuthPopup: React.Dispatch<React.SetStateAction<boolean>>;
  show: boolean;
  onClick: () => Promise<boolean>;
  onSendCode: (code: string) => Promise<boolean>;
};

function AuthPopup({ ShowAuthPopup, show, onClick, onSendCode }: AuthPopupProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isRequestingCode, setIsRequestingCode] = useState(false);

  async function handleClick() {
    setIsRequestingCode(true);
    toast.loading("Requesting login code...", { id: "auth" });
    const result = await onClick();
    if (!result) {
      toast.error("Failed to request login code. Please try again.", { id: "auth" });
      setIsRequestingCode(false);
      return;
    }
    setIsProcessing(true);
    setIsRequestingCode(false);
    toast.success("Login code sent! Please check your email.", { id: "auth" });
  }

  async function handleSend() {
    setIsSendingCode(true);
    if (inputCode.trim() === "") {
      toast.error("Please enter a valid code.", { id: "auth" });
      setIsSendingCode(false);
      return;
    }

    const result = await onSendCode(inputCode);

    if (!result) {
      toast.error("Failed to create session. Please check the code and try again.", { id: "auth" });
      setIsSendingCode(false);
      return;
    }
    toast.success("Session created successfully!", { id: "auth" });
    setIsSendingCode(false);
  }

  return (
    <Dialog open={show} onOpenChange={ShowAuthPopup}>
      <DialogOverlay />
      
      <DialogContent
        className="
          overflow-hidden rounded-2xl border border-border/40
          bg-background/50 p-0 text-foreground
          shadow-2xl backdrop-blur-2xl sm:max-w-md
        "
      >
        {/* Theme-aware fluid glass lighting */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-foreground/[0.05] to-transparent" />
        <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-5 p-6">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.22em] text-primary/80">
              Admin Access
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Sign in to continue
            </h2>
            <p className="text-sm text-muted-foreground">
              Request a login code, then enter it to create your session.
            </p>
          </div>

          {!isProcessing ? (
            <Button
              onClick={handleClick}
              size="lg"
              className="w-full"
            >
              {isRequestingCode ? "Requesting..." : "Request Login Code"}
            </Button>
          ) : (
            <div className="space-y-4">
              {/* Removed ALL custom class overrides. Let the root input component shine. */}
              <Input
                placeholder="Enter code"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
              />

              <Button
                onClick={handleSend}
                size="lg"
                className="w-full"
              >
                {isSendingCode ? "Sending..." : "Send"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}