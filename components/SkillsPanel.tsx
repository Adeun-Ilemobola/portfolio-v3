import React from "react";
import { Braces, ChevronDown } from "lucide-react";

type SkillGroup = {
  label: string;
  items: string[];
};

type Props = {
  groups: SkillGroup[];
};

export default function SkillsPanel({ groups }: Props) {
  return (
    <section
      className="
        relative z-10 w-full min-w-0
        rounded-2xl
        p-3 sm:p-4
      "
    >
     
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-foreground/[0.05] to-transparent backdrop-blur-sm" />

      <div className="relative z-10 min-w-0">
        <div className="flex items-center gap-2 text-foreground">
          <ChevronDown className="h-4 w-4 shrink-0 text-primary" />
          <Braces className="h-5 w-5 shrink-0 text-primary" />
          <h2 className="min-w-0 font-mono text-xl font-semibold tracking-tight sm:text-2xl">
            skills<span className="text-primary">.json</span>
          </h2>
        </div>

        <p className="ml-10 mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:ml-11 sm:text-xs">
          structured data
        </p>

        <div
          className="
            mt-4 sm:mt-5
            max-h-[32rem] overflow-y-auto custom-scrollbar
            rounded-xl 
            bg-muted/10 p-3 sm:p-4
            font-mono text-xs leading-6 text-foreground/80
            backdrop-blur-md
            sm:text-sm sm:leading-7
          "
        >
          <div className="text-muted-foreground/60">{"{"}</div>

          <div className="ml-3 flex flex-col gap-3 sm:ml-4">
            {groups.map((group, index) => (
              <div key={group.label} className="min-w-0">
                <div className="flex flex-wrap items-start gap-2">
                  {/* Theme-aware key coloring */}
                  <span className="break-words text-secondary-foreground dark:text-sky-300">
                    "{group.label}"
                  </span>
                  <span className="text-muted-foreground/60">:</span>
                  <span className="text-muted-foreground/60">[</span>
                </div>

                <div className="ml-3 mt-2 flex flex-wrap gap-2 sm:ml-6">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="
                        max-w-full break-words rounded-full
                        border border-primary/20
                        bg-primary/10 px-2.5 py-1
                        text-[11px] text-foreground/90
                        transition-all duration-300
                        hover:border-primary/40 hover:bg-primary/20
                        hover:shadow-[0_0_10px_rgba(var(--primary),0.1)]
                        sm:px-3 sm:text-xs
                      "
                    >
                      "{item}"
                    </span>
                  ))}
                </div>

                <div className="ml-1 mt-2 text-muted-foreground/60 sm:ml-2">
                  ]{index < groups.length - 1 ? "," : ""}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2 text-muted-foreground/60">{"}"}</div>
        </div>
      </div>
    </section>
  );
}