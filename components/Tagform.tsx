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
    // Changed to border-border/30 and bg-muted/10 for theme-aware glass
    <Card className="rounded-2xl border border-border/30 bg-muted/10 p-4 backdrop-blur-xl">
      <div className="flex flex-col gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Tags</h3>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Add keywords to organize this project.
          </p>
        </div>

        <ButtonGroup className="w-full">
          {/* Stripped custom classes so it inherits your root Input styling perfectly */}
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a tag"
            disabled={isDisabled}
          />
          <Button
            type="button"
            onClick={submitTag}
            disabled={isDisabled}
            // Removed hardcoded cyan, using theme primary
            className="border-primary/20 bg-primary/10 text-primary hover:bg-primary/20"
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
                  border border-border/30 bg-background/50
                  px-3 py-1.5 text-sm text-foreground/80
                  transition-all duration-300
                  hover:border-primary/30 hover:bg-primary/10 hover:text-primary
                "
              >
                <span>{tag}</span>
                <X className="h-3.5 w-3.5 opacity-60 transition-opacity group-hover:opacity-100" />
              </button>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-border/30 px-3 py-2 text-xs text-muted-foreground/60">
              No tags added yet
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}