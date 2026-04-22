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
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(to_bottom,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]" />

      <div className="relative z-10 min-w-0">
        <div className="flex items-center gap-2 text-white">
          <ChevronDown className="h-4 w-4 shrink-0 text-cyan-200" />
          <Braces className="h-5 w-5 shrink-0 text-cyan-200" />
          <h2 className="min-w-0 font-mono text-xl font-semibold tracking-tight sm:text-2xl">
            skills<span className="text-cyan-200">.json</span>
          </h2>
        </div>

        <p className="ml-10 mt-1 text-[10px] uppercase tracking-[0.2em] text-white/40 sm:ml-11 sm:text-xs">
          structured data
        </p>

        <div
          className="
            mt-4 sm:mt-5
            max-h-[32rem] overflow-y-auto
            rounded-xl border border-white/8
            bg-black/10 p-3 sm:p-4
            font-mono text-xs leading-6 text-white/85
            sm:text-sm sm:leading-7
          "
        >
          <div className="text-white/35">{"{"}</div>

          <div className="ml-3 flex flex-col gap-3 sm:ml-4">
            {groups.map((group, index) => (
              <div key={group.label} className="min-w-0">
                <div className="flex flex-wrap items-start gap-2">
                  <span className="break-words text-sky-300">
                    "{group.label}"
                  </span>
                  <span className="text-white/45">:</span>
                  <span className="text-white/45">[</span>
                </div>

                <div className="ml-3 mt-2 flex flex-wrap gap-2 sm:ml-6">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="
                        max-w-full break-words rounded-full
                        border border-cyan-300/15
                        bg-cyan-300/8 px-2.5 py-1
                        text-[11px] text-cyan-100/90
                        transition-colors duration-300
                        hover:bg-cyan-300/14
                        sm:px-3 sm:text-xs
                      "
                    >
                      "{item}"
                    </span>
                  ))}
                </div>

                <div className="ml-1 mt-2 text-white/45 sm:ml-2">
                  ]{index < groups.length - 1 ? "," : ""}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2 text-white/35">{"}"}</div>
        </div>
      </div>
    </section>
  );
}