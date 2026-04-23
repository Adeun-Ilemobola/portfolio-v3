import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { Plus, Tag, X } from "lucide-react";

type Props = {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  isDisabled?: boolean;
};

export default function Tagform({ tags, onAddTag, onRemoveTag , isDisabled=false }: Props) {
  const [inputValue, setInputValue] = useState("");

  const submitTag = () => {
    const value = inputValue.trim();
    if (!value) return;
    onAddTag(value);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      submitTag();
    }
  };

  return (
    <Card className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
      <div className="flex flex-col gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-cyan-200" />
            <h3 className="text-sm font-semibold text-white">Tags</h3>
          </div>
          <p className="mt-1 text-xs text-white/50">
            Add keywords to organize this project.
          </p>
        </div>

        <ButtonGroup className="w-full">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a tag"
            className="border-white/10 bg-white/[0.03] text-white placeholder:text-white/35"
            disabled={isDisabled}
          />
          <Button
            type="button"
            onClick={submitTag}
            className="border-cyan-300/20 bg-cyan-300/12  hover:bg-cyan-300/18"
            disabled={isDisabled}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </ButtonGroup>

        <div className="flex min-h-10 flex-wrap gap-2">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => onRemoveTag(tag)}
                disabled={isDisabled}
                className="
                  group inline-flex items-center gap-2 rounded-full
                  border border-white/10 bg-white/[0.05]
                  px-3 py-1.5 text-sm text-white/85
                  transition-all duration-200
                  hover:border-cyan-300/20 hover:bg-cyan-300/10 hover:text-cyan-100
                "
              >
                <span>{tag}</span>
                <X className="h-3.5 w-3.5 opacity-60 transition-opacity group-hover:opacity-100" />
              </button>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-white/10 px-3 py-2 text-xs text-white/40">
              No tags added yet
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}