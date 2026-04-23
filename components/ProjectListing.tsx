import { ChevronDown, FolderOpen, FileCode2, Eye, Pencil } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

type Props = {
  listing: {
    title: string;
    projectUrl: string;
  }[];
  edit?: boolean;
  isLoading?: boolean;
};

export default function ProjectListing({ listing, edit = false, isLoading = false }: Props) {
  return (
    <section
      className="
        relative z-10 w-full min-w-0
        rounded-2xl
        p-3 sm:p-4
      "
    >
      {/* Fluid Glass Panel overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-foreground/[0.05] to-transparent backdrop-blur-sm" />

      <div className="relative z-10 min-w-0">
        <div className="flex items-center gap-2 text-foreground">
          <ChevronDown className="h-4 w-4 shrink-0 text-primary" />
          <FolderOpen className="h-5 w-5 shrink-0 text-primary" />
          <h2 className="min-w-0 font-mono text-xl font-semibold tracking-tight sm:text-2xl">
            projects<span className="text-primary">/</span>
          </h2>
        </div>

        <p className="ml-10 mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:ml-11 sm:text-xs">
          directory
        </p>

        <div className="relative mt-4 ml-2 sm:mt-5 sm:ml-5">
          {/* Theme-aware directory tree line */}
          <div className="absolute left-3 top-0 h-full w-px bg-gradient-to-b from-primary/30 via-border/50 to-transparent" />

          <div className="flex max-h-[32rem] flex-col gap-2 overflow-y-auto pr-1 custom-scrollbar">
            {!isLoading && listing.map((project, index) => (
              <LinkMode key={index} url={project.projectUrl} isLink={edit}>
                {edit && (<div
                  className="
                    absolute right-2 top-2
                    flex flex-row items-center gap-1
                    opacity-100 sm:opacity-0
                    pointer-events-auto sm:pointer-events-none
                    sm:top-1/2 sm:-translate-y-1/2
                    group-hover:opacity-100 group-hover:pointer-events-auto
                  "
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-md"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(project.projectUrl, "_blank");
                    }}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-md"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(project.projectUrl, "_blank");
                    }}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                </div>)}

                {/* Theme-aware horizontal connector */}
                <span className="absolute -left-1 top-1/2 h-px w-1 -translate-y-1/2 bg-border/60 transition-colors duration-300 group-hover:bg-primary/50" />

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border/40 bg-muted/10 transition-colors duration-300 group-hover:border-primary/40 group-hover:bg-primary/15">
                  <FileCode2 className="h-4 w-4 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
                </div>

                <span className="min-w-0 flex-1 truncate pr-0 text-sm transition-colors duration-300 sm:text-[1rem] sm:pr-14">
                  {project.title}
                </span>
              </LinkMode>
            ))}

            {listing.length === 0 && !isLoading && (
              <div className="flex items-center gap-2 rounded-md border border-border/30 bg-muted/10 p-3 text-sm text-muted-foreground backdrop-blur-sm">
                No projects found.
              </div>
            )}

            {isLoading && (
              <div className="flex items-center gap-2 rounded-md border border-border/30 bg-muted/10 p-3 text-sm text-muted-foreground backdrop-blur-sm">
                Loading directory...
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function LinkMode({
  url,
  isLink,
  children,
}: {
  url: string;
  isLink: boolean;
  children: React.ReactNode;
}) {
  const sharedClassName = `
    group relative ml-4 flex min-w-0 items-center gap-3 rounded-lg
    border border-transparent
    px-3 py-2
    pr-16 sm:pr-3
    font-mono text-foreground/80
    transition-all duration-300
    hover:border-primary/30
    hover:bg-muted/30
    hover:text-primary
    hover:shadow-[0_0_15px_rgba(var(--primary),0.05)]
  `;

  if (!isLink) {
    return (
      <Link href={url} className={sharedClassName}>
        {children}
      </Link>
    );
  }

  return <div className={sharedClassName}>{children}</div>;
}