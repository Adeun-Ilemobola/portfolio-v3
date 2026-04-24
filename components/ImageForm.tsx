import { Badge } from "@/components/ui/badge";
import React, { useRef, useState, useEffect } from "react";
import { Card } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import { ImagePlus, UploadCloud, X } from "lucide-react";
import {
  ClientFile,
  createClientFile,
  PersistedFile,
  PersistedFileSchema,
  UploadStatus,
} from "@/lib/Zod/file";
import { deleteSingleFile, uploadSingleFile } from "@/lib/r2-helpers";
import { api } from "@/lib/eden";

type Props = {
  onDelete: (id: string) => void;
  onSubmit: (image: PersistedFile) => void;
  images: PersistedFile[];
  changeImageStatus: (id: string, status: UploadStatus) => void;
  isDisabled?: boolean;
};

export default function ImageForm({
  onDelete,
  onSubmit,
  images,
  changeImageStatus,
  isDisabled = false
}: Props) {
  const [mode, setMode] = useState<"view" | "hover">("view");
  const [ClientFiles, setClientFiles] = useState<ClientFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const displayImages = [...ClientFiles, ...images];
  const deletingRef = useRef(new Set<string>());

  function updateClientFileStatus(
    fileId: string,
    status: UploadStatus,
  ) {
    setClientFiles((prev) =>
      prev.map((file) =>
        file.id === fileId
          ? { ...file, uploadStatus: status }
          : file
      )
    );
  }

  async function handleFile(files: File[]) {
    if (files.length === 0) return;
    const newLocalFiles = files.map((file) => createClientFile(file));
    const noDuplicates = newLocalFiles.filter(
      (nf) =>
        !images.some(
          (img) =>
            img.name === nf.localFile?.name &&
            img.size === nf.localFile?.size
        )
    );
    setClientFiles((prev) => [...prev, ...noDuplicates]);
    if (noDuplicates.length > 0) {
      void SaveFile(noDuplicates);
    }
  }

  async function SaveFile(files: ClientFile[]) {
    for (const file of files) {
      try {
        const { url, key } = await uploadSingleFile(file.localFile!, file.id);
        updateClientFileStatus(file.id, "uploading");
        const savedFile = PersistedFileSchema.parse({
          ...file,
          remoteUrl: url,
          cloudKey: key,
          uploadStatus: "uploaded",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        setClientFiles((prev) => prev.filter((f) => f.id !== file.id));
        onSubmit(savedFile);
      } catch (error) {
        console.error("Failed to upload file:", error);
      }
    }
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    if (isDisabled) return;
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFile(files);
  }

 async function Remove(id: string) {
  if (isDisabled) return;
  if (deletingRef.current.has(id)) return;

  deletingRef.current.add(id);
  changeImageStatus(id, "deleting");

  const img = images.find((i) => i.id === id);

  if (!img) {
    deletingRef.current.delete(id);
    onDelete(id);
    return;
  }

  try {
    if (!img.id.startsWith("local-")) {
      const { success } = await deleteSingleFile(img.cloudKey, id);

      if (!success) {
        changeImageStatus(id, "failed");
        return;
      }
    }

    changeImageStatus(id, "deleted");

    setTimeout(() => {
      onDelete(id);
      deletingRef.current.delete(id);
    }, 600);
  } catch (err) {
    console.error(err);
    changeImageStatus(id, "failed");
    deletingRef.current.delete(id);
  }
}

  return (
    <Card
      className={`
        relative w-full overflow-hidden rounded-2xl
        border border-border/30 bg-muted/10
        shadow-[0_12px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.24)]
        backdrop-blur-xl transition-colors duration-300
        ${isDisabled ? "pointer-events-none opacity-50" : "cursor-pointer"}
      `}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setMode("hover");
      }}
      onDrop={onDrop}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setMode("view");
      }}
      onClick={() => fileInputRef.current?.click()}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-foreground/[0.05] to-transparent" />

      {mode === "hover" && !isDisabled && (
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl border border-primary/25 bg-background/80 backdrop-blur-md">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10">
              <UploadCloud className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">
                Drop images here
              </p>
              <p className="text-sm text-muted-foreground">
                Release to add them to your media collection
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Project Images
            </h2>
            <p className="text-sm text-muted-foreground">
              Upload preview images for this project.
            </p>
          </div>

          <Button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="border border-primary/20 bg-primary/10 text-primary hover:bg-primary/20"
          >
            <ImagePlus className="mr-2 h-4 w-4" />
            Add Images
          </Button>
        </div>

        {displayImages.length > 0 ? (
          <div
            className="grid max-h-[28rem] grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3 lg:grid-cols-4 custom-scrollbar"
            
          >
            {displayImages.map((img) => (
              <ImageCard
                key={img.id}
                image={{
                  id: img.id,
                  name: img.name,
                  remoteUrl: img.remoteUrl,
                  uploadStatus: img.uploadStatus,
                }}
                onDelete={(id) => Remove(id)}
                isDisabled={isDisabled || img.uploadStatus === "uploading"}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[22rem] flex-col items-center justify-center rounded-2xl border border-dashed border-border/30 bg-muted/5 px-6 text-center transition-colors">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
              <ImagePlus className="h-8 w-8 text-primary" />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-foreground">
              No images uploaded yet
            </h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Drag and drop your images here, or click below to browse and add files manually.
            </p>

            <Button
              type="button"
              className="mt-5"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Upload Images
            </Button>
          </div>
        )}
      </div>

      <input
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={(e) => {
          if (isDisabled) return;
          const files = Array.from(e.target.files || []);
          handleFile(files);
          e.target.value = "";
        }}
      />
    </Card>
  );
}

function Status({ uploadStatus }: { uploadStatus: UploadStatus }) {
  if (uploadStatus === "uploading") {
    return (
      <Badge className="absolute z-40 bottom-8 right-1 border border-border/30 bg-background/80 text-foreground backdrop-blur-md">
        Uploading...
      </Badge>
    );
  }

  if (uploadStatus === "uploaded") {
    return (
      <Badge className="absolute z-40 bottom-8 right-1 border border-primary/20 bg-primary/20 text-primary backdrop-blur-md">
        Uploaded
      </Badge>
    );
  }

  if (uploadStatus === "failed") {
    return (
      <Badge
        variant="destructive"
        className="absolute z-40 bottom-48 right-2 backdrop-blur-md"
      >
        Failed
      </Badge>
    );
  }

  if (uploadStatus === "deleting") {
    return (
      <Badge
        variant="destructive"
        className="absolute z-40 bottom-48 right-2 backdrop-blur-md"
      >
        Deleting...
      </Badge>
    );
  }

  if (uploadStatus === "deleted") {
    return (
      <Badge
        variant="destructive"
        className="absolute z-40 bottom-48 right-2 backdrop-blur-md"
      >
        Deleted
      </Badge>
    );
  }

  return (
    <Badge className="absolute z-40 bottom-8 right-2 border border-border/30 bg-background/80 text-foreground backdrop-blur-md">
      Idle
    </Badge>
  );
}

function ImageCard({
  image,
  onDelete,
  isDisabled = false
}: {
  image: {
    id: string;
    name: string;
    remoteUrl: string;
    uploadStatus: UploadStatus;
  };
  onDelete: (id: string) => void;
  isDisabled?: boolean;
}) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      className="group relative aspect-square overflow-hidden rounded-xl border border-border/30 bg-muted/10 shadow-[0_8px_24px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 z-20 h-8 w-8 rounded-full bg-background/60 text-foreground backdrop-blur-md hover:bg-destructive hover:text-destructive-foreground transition-all duration-300"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDelete(image.id);
        }}
        disabled={isDisabled}
      >
        <X className="h-4 w-4" />
      </Button>

      <Image
        src={image.remoteUrl || ""}
        alt={image.name || "Uploaded image"}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background/90 to-transparent" />

      <div className="absolute bottom-2 left-2 right-2 z-10">
        <p className="truncate text-xs font-medium text-foreground">
          {image.name}
        </p>
      </div>

      <Status uploadStatus={image.uploadStatus} />
    </div>
  );
}