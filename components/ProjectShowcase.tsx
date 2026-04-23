"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/eden";
import type { ProjectStored } from "@/lib/Zod/project";
import {
  ExternalLink,
  Play,
  Terminal,
  FileCode,
  LayoutPanelLeft,
  Activity,
  Box,
  Image as ImageIcon,
  AlertCircle,
  FileText,
} from "lucide-react";
import { SiGithub } from "react-icons/si";

type Props = {
  projectId: string;
};

export default function ProjectShowcase({ projectId }: Props) {
  const [project, setProject] = useState<ProjectStored | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProject() {
      try {
        setIsLoading(true);
        const { data, error } = await api.project({ id: projectId }).get();

        if (!active) return;

        if (error || !data) {
          setHasError(true);
          setProject(null);
          return;
        }

        setProject(data.response);
        setSelectedImageIndex(0);
      } catch (error) {
        console.error("Failed to load project:", error);
        if (!active) return;
        setHasError(true);
        setProject(null);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadProject();

    return () => {
      active = false;
    };
  }, [projectId]);

  const galleryImages = useMemo(() => {
    if (!project) return [];
    return (project.files ?? []).filter((file) => !!file.remoteUrl);
  }, [project]);

  const selectedImage =
    galleryImages.length > 0 ? galleryImages[selectedImageIndex] : null;

  // --- Loading State (Terminal Boot Metaphor) ---
  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 font-sans">
        <div className="flex items-center gap-2 pl-2 font-mono text-sm text-muted-foreground/70">
          <Terminal className="h-4 w-4 animate-pulse text-primary/70" />
          <span>[sys] initializing workspace module...</span>
        </div>
        <Card className="flex min-h-[50vh] w-full flex-col items-center justify-center space-y-4 border-border/40 bg-background/20 p-0 shadow-2xl backdrop-blur-md">
          <div className="h-1 w-48 overflow-hidden rounded-full bg-muted/20">
            <div className="h-full w-1/3 animate-pulse rounded-full bg-primary/50" />
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            Awaiting data stream...
          </span>
        </Card>
      </div>
    );
  }

  // --- Error State ---
  if (hasError || !project) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 font-sans">
        <Card className="flex w-full flex-col items-center justify-center gap-3 border-destructive/30 bg-destructive/5 p-12 backdrop-blur-md">
          <AlertCircle className="h-8 w-8 text-destructive/80" />
          <div className="text-center">
            <h3 className="text-lg font-medium tracking-tight text-foreground">
              ERR_PROJECT_NOT_FOUND
            </h3>
            <p className="text-sm text-muted-foreground">
              The requested directory could not be accessed or does not exist.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const slug = project.title.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 font-sans sm:px-6 lg:px-8">
      
      {/* CLI / Breadcrumb Overlay */}
      <div className="flex items-center gap-2 pl-2 font-mono text-sm text-muted-foreground/80">
        <Terminal className="h-4 w-4 text-primary/80" />
        <span className="hidden sm:inline">visitor@portfolio</span>
        <span className="hidden text-border/50 sm:inline">~</span>
        <span>cd ~/projects/{slug}</span>
      </div>

      {/* Main Unified Interface Window */}
      <Card className="flex flex-col overflow-hidden border-border/40 bg-background/20 p-0 shadow-2xl backdrop-blur-md">
        
        {/* Editor Tab Bar */}
        <div className="flex flex-col gap-3 border-b border-border/40 bg-muted/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 font-mono text-sm font-medium text-foreground/90">
              <FileCode className="h-4 w-4 text-primary" />
              <span>project_manifest.tsx</span>
            </div>
            
            {/* Inline Technical Tags */}
            {project.tags.length > 0 && (
              <div className="hidden items-center gap-2 border-l border-border/40 pl-4 md:flex">
                {project.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="border-primary/20 bg-primary/5 font-mono text-[10px] uppercase tracking-wider text-primary/80"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Action Toolbar */}
          <div className="flex shrink-0 items-center gap-2">
            {project.url && (
              <Button size="sm" variant="default" className="h-8 gap-2 bg-primary/90 hover:bg-primary">
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Live Deploy</span>
              </Button>
            )}
            {project.githubUrl && (
              <Button size="sm" variant="outline" className="h-8 gap-2 border-border/50 bg-background/50 backdrop-blur-sm hover:bg-muted/20">
                <SiGithub className="h-3.5 w-3.5" />
                <span>Source Code</span>
              </Button>
            )}
          </div>
        </div>

        {/* TOP SECTION: Split Pane Workspace (Media + Meta) */}
        <div className="grid grid-cols-1 divide-y divide-border/40 xl:grid-cols-[1.6fr_0.8fr] xl:divide-x xl:divide-y-0">
          
          {/* LEFT PANE: Media Inspector */}
          <div className="flex flex-col bg-background/5">
            <div className="flex items-center gap-2 border-b border-border/20 bg-muted/5 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              <LayoutPanelLeft className="h-3.5 w-3.5" />
              <span>Viewport_Inspector</span>
            </div>
            
            <div className="flex flex-col gap-4 p-4 sm:p-6">
              {selectedImage ? (
                <>
                  {/* Main Display Window */}
                  <div className="group relative overflow-hidden rounded-xl border border-border/40 bg-black/30 shadow-inner">
                    <img
                      src={selectedImage.remoteUrl}
                      alt={selectedImage.alt || selectedImage.name || project.title}
                      className="h-[280px] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02] sm:h-[400px] lg:h-[500px]"
                    />
                    {/* Hover Meta Tag */}
                    <div className="absolute right-3 top-3 rounded border border-border/40 bg-background/70 px-2 py-1 font-mono text-[10px] text-muted-foreground opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
                      IMG_REF: {selectedImageIndex + 1}/{galleryImages.length}
                    </div>
                  </div>

                  {/* Scrollable Y-Axis Thumbnail Dock */}
                  {/* Fixed height with internal scroll prevents the component from expanding indefinitely */}
                  <div className="h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-4 2xl:grid-cols-5">
                      {galleryImages.map((file, index) => {
                        const isActive = index === selectedImageIndex;
                        return (
                          <button
                            key={file.id || `${file.remoteUrl}-${index}`}
                            type="button"
                            onClick={() => setSelectedImageIndex(index)}
                            className={[
                              "relative overflow-hidden rounded-lg border transition-all duration-300",
                              isActive
                                ? "border-primary/60 ring-1 ring-primary/40 shadow-[0_0_15px_rgba(var(--primary),0.15)]"
                                : "border-border/30 opacity-70 hover:border-border/60 hover:opacity-100",
                            ].join(" ")}
                          >
                            <img
                              src={file.remoteUrl}
                              alt={file.alt || file.name || `Thumbnail ${index + 1}`}
                              className="aspect-video w-full object-cover"
                            />
                            {isActive && <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/40 bg-muted/5 text-sm text-muted-foreground">
                  <ImageIcon className="h-6 w-6 opacity-50" />
                  <span>No visual assets located.</span>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANE: Runtime Details & Logs (No Description Here) */}
          <div className="flex flex-col bg-background/5">
            <div className="flex items-center gap-2 border-b border-border/20 bg-muted/5 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              <Activity className="h-3.5 w-3.5" />
              <span>Runtime_Telemetry</span>
            </div>

            <div className="flex flex-col gap-6 p-6">
              {/* Data Struct (Metadata) */}
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-primary/80">
                  <Box className="h-3.5 w-3.5" />
                  sys.config
                </h3>
                <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border/40 bg-border/40">
                  <div className="bg-background/40 p-4 backdrop-blur-sm">
                    <div className="font-mono text-[10px] text-muted-foreground uppercase">Assets_IMG</div>
                    <div className="mt-1 font-mono text-sm text-foreground">{galleryImages.length} items</div>
                  </div>
                  <div className="bg-background/40 p-4 backdrop-blur-sm">
                    <div className="font-mono text-[10px] text-muted-foreground uppercase">Assets_VID</div>
                    <div className="mt-1 font-mono text-sm text-foreground">{project.videos.length} items</div>
                  </div>
                  <div className="bg-background/40 p-4 backdrop-blur-sm">
                    <div className="font-mono text-[10px] text-muted-foreground uppercase">Compile_Date</div>
                    <div className="mt-1 font-mono text-sm text-foreground">
                      {new Date(project.createdAt).toISOString().split('T')[0]}
                    </div>
                  </div>
                  <div className="bg-background/40 p-4 backdrop-blur-sm">
                    <div className="font-mono text-[10px] text-muted-foreground uppercase">Last_Patch</div>
                    <div className="mt-1 font-mono text-sm text-foreground">
                      {new Date(project.updatedAt).toISOString().split('T')[0]}
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Logs */}
              {project.videos.length > 0 && (
                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-primary/80">
                    <Play className="h-3.5 w-3.5" />
                    video_logs
                  </h3>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                    {project.videos.map((video) => (
                      <a
                        key={video.id}
                        href={video.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center gap-3 rounded-lg border border-border/30 bg-muted/5 p-3 transition-colors hover:border-primary/30 hover:bg-primary/5"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-border/40 bg-background/50 text-muted-foreground group-hover:text-primary">
                          <Play className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-mono text-xs font-medium text-foreground/90">
                            {video.capture}
                          </div>
                          <div className="truncate font-mono text-[10px] text-muted-foreground">
                            {video.url}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Full Width Canvas for Infinite Text */}
        <div className="flex flex-col border-t border-border/40 bg-background/5">
          <div className="flex items-center gap-2 border-b border-border/20 bg-muted/5 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            <FileText className="h-3.5 w-3.5" />
            <span>README.md</span>
          </div>
          
          <div className="flex flex-col gap-6 p-6 sm:p-8">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
                {project.title}
              </h1>
              
              {/* Mobile tags fallback */}
              {project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1 md:hidden">
                  {project.tags.map((tag) => (
                    <Badge key={`mob-${tag}`} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 font-mono text-[10px]">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="prose prose-invert max-w-none whitespace-pre-wrap text-sm leading-relaxed text-foreground/80 sm:text-base">
              {project.description}
            </div>
          </div>
        </div>

      </Card>
    </div>
  );
}