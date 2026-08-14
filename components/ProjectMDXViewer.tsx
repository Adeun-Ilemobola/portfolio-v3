"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ProjectMarkdownViewerProps = {
  content: string;
};

export function ProjectMarkdownViewer({ content }: ProjectMarkdownViewerProps) {
  return (
    <article className="max-w-none text-sm leading-relaxed  sm:text-base">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mt-12 mb-6 scroll-m-20 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2 className="mt-10 mb-4 scroll-m-20 border-b border-border/30 pb-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3 className="mt-8 mb-4 scroll-m-20 text-xl font-semibold tracking-tight text-foreground/90">
              {children}
            </h3>
          ),

          h4: ({ children }) => (
            <h4 className="mt-8 mb-4 scroll-m-20 text-lg font-semibold tracking-tight text-foreground/80">
              {children}
            </h4>
          ),

          p: ({ children }) => (
            <p className="leading-7 text-foreground/80 [&:not(:first-child)]:mt-6">
              {children}
            </p>
          ),

          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="rounded-sm px-0.5 font-medium text-primary underline underline-offset-4 transition-colors hover:bg-primary/5 hover:text-primary/80"
            >
              {children}
            </a>
          ),

          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
          ),

          em: ({ children }) => (
            <em className="italic text-foreground/90">{children}</em>
          ),

          ul: ({ children }) => (
            <ul className="my-6 ml-6 list-disc space-y-2 text-foreground/80 marker:text-primary/60">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="my-6 ml-6 list-decimal space-y-2 text-foreground/80 marker:text-primary/60">
              {children}
            </ol>
          ),

          li: ({ children }) => <li className="leading-7">{children}</li>,

          blockquote: ({ children }) => (
            <blockquote className="my-6 overflow-hidden rounded-r-lg border-l-4 border-primary/50 bg-primary/5 py-3 pl-6 pr-4 italic text-muted-foreground transition-colors duration-300 hover:border-primary/70 hover:bg-primary/10">
              {children}
            </blockquote>
          ),

          hr: () => <hr className="my-10 border-border/30" />,

          table: ({ children }) => (
            <div className="custom-scrollbar my-6 w-full overflow-x-auto rounded-xl border border-border/30 bg-muted/5 backdrop-blur-sm">
              <table className="w-full text-sm">{children}</table>
            </div>
          ),

          thead: ({ children }) => (
            <thead className="bg-muted/10">{children}</thead>
          ),

          tbody: ({ children }) => <tbody>{children}</tbody>,

          tr: ({ children }) => (
            <tr className="m-0 border-b border-border/20 p-0 transition-colors even:bg-muted/5 hover:bg-muted/10">
              {children}
            </tr>
          ),

          th: ({ children }) => (
            <th className="border-r border-border/20 px-4 py-3 text-left font-semibold text-foreground last:border-0">
              {children}
            </th>
          ),

          td: ({ children }) => (
            <td className="border-r border-border/20 px-4 py-3 text-left text-foreground/80 last:border-0">
              {children}
            </td>
          ),

          code: ({ children, className }) => {
            const isCodeBlock = Boolean(className);

            if (isCodeBlock) {
              return (
                <code className={`${className ?? ""} text-foreground/90`}>
                  {children}
                </code>
              );
            }

            return (
              <code className="relative rounded border border-border/30 bg-muted/50 px-[0.4rem] py-[0.2rem] font-mono text-sm font-semibold text-primary backdrop-blur-sm">
                {children}
              </code>
            );
          },

          pre: ({ children }) => (
            <div className=" relative overflow-hidden  bg-muted/10 shadow-sm backdrop-blur-md ">
             

              <pre className="custom-scrollbar overflow-x-auto font-mono text-[13px] text-foreground/90 sm:text-sm">
                {children}
              </pre>
            </div>
          ),

          img: ({ src, alt }) => (
            <span className="relative my-8 block overflow-hidden rounded-xl border border-border/30 bg-muted/10 shadow-[0_8px_24px_rgba(0,0,0,0.1)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.2)]">
              <img
                src={src ?? ""}
                alt={alt ?? "Markdown Image"}
                className="mx-auto block max-h-[600px] w-auto object-contain transition-transform duration-500 hover:scale-[1.02]"
              />
            </span>
          ),
        }}
      >
        {content || "No description provided."}
      </ReactMarkdown>
    </article>
  );
}