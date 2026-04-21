import { ChevronDown, FolderOpen, FileCode2 } from "lucide-react";
import Link from "next/link";

type Props = {
  listing: {
    title: string;
    projectUrl: string;
  }[];
};

export default function ProjectListing({ listing }: Props) {
  return (
    <section
      className="
        relative z-10 w-full max-w-md
        rounded-2xl border border-white/10
        bg-white/[0.045]
        p-4
        shadow-[0_10px_30px_rgba(0,0,0,0.22)]
        backdrop-blur-xl
      "
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(to_bottom,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]" />

      <div className="relative z-10">
        {/* Folder header */}
        <div className="flex items-center gap-2 text-white">
          <ChevronDown className="h-4 w-4 text-cyan-200" />
          <FolderOpen className="h-5 w-5 text-cyan-200" />
          <h2 className="font-mono text-2xl font-semibold tracking-tight">
            projects<span className="text-cyan-200">/</span>
          </h2>
        </div>

        <p className="ml-11 mt-1 text-xs uppercase tracking-[0.2em] text-white/40">
          directory
        </p>

        {/* File tree */}
        <div className="relative mt-5 ml-5">
          <div className="absolute left-3 top-0 h-full w-px bg-gradient-to-b from-cyan-300/20 via-white/10 to-transparent" />

          <div className="flex flex-col gap-2">
            {listing.map((project, index) => (
              <Link
                key={index}
                href={project.projectUrl}
                className="
                  group relative ml-4 flex items-center gap-3 rounded-lg
                  border border-transparent
                  px-3 py-2
                  font-mono text-[1rem] text-white/82
                  transition-all duration-300
                  hover:border-cyan-300/15
                  hover:bg-white/[0.045]
                  hover:text-cyan-200
                "
              >
                <span className="absolute -left-1 top-1/2 h-px w-1 -translate-y-1/2 bg-white/15 group-hover:bg-cyan-300/30" />

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/8 bg-white/[0.04] transition-colors duration-300 group-hover:border-cyan-300/20 group-hover:bg-cyan-300/10">
                  <FileCode2 className="h-4 w-4 text-white/70 group-hover:text-cyan-200" />
                </div>

                <span className="truncate">
                  {project.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}