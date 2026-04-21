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
        <div className="flex items-center gap-2 text-white">
          <ChevronDown className="h-4 w-4 text-cyan-200" />
          <Braces className="h-5 w-5 text-cyan-200" />
          <h2 className="font-mono text-2xl font-semibold tracking-tight">
            skills<span className="text-cyan-200">.json</span>
          </h2>
        </div>

        <p className="ml-11 mt-1 text-xs uppercase tracking-[0.2em] text-white/40">
          structured data
        </p>

        <div className="mt-5 rounded-xl border border-white/8 bg-black/10 p-4 font-mono text-sm leading-7 text-white/85">
          <div className="text-white/35">{"{"}</div>

          <div className="ml-4 flex flex-col gap-3">
            {groups.map((group, index) => (
              <div key={group.label}>
                <div className="flex flex-wrap items-start gap-2">
                  <span className="text-sky-300">"{group.label}"</span>
                  <span className="text-white/45">:</span>
                  <span className="text-white/45">[</span>
                </div>

                <div className="ml-6 mt-2 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="
                        rounded-full border border-cyan-300/15
                        bg-cyan-300/8 px-3 py-1
                        text-xs text-cyan-100/90
                        transition-colors duration-300
                        hover:bg-cyan-300/14
                      "
                    >
                      "{item}"
                    </span>
                  ))}
                </div>

                <div className="ml-2 mt-2 text-white/45">
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