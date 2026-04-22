"use client"
import { VideoLink, VideoLinkSchema } from "@/lib/Zod/project"
import React, { useState } from "react"
import { Field, FieldError, FieldLabel } from "./ui/field"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { X } from "lucide-react"

type VideoLinkFormProps = {
  videos: VideoLink[]
  AddVideo: (video: Omit<VideoLink, "id" | "createdAt" | "updatedAt">) => void
  RemoveVideo: (id: string) => void
}

export default function VideoLinkForm({
  videos,
  AddVideo,
  RemoveVideo,
}: VideoLinkFormProps) {
  const [data, setData] = useState<
    Omit<VideoLink, "id" | "createdAt" | "updatedAt">
  >({
    url: "",
    capture: "",
  })

  const [error, setError] = useState<Partial<Record<keyof VideoLink, string>>>(
    {}
  )

  function handleSubmit() {
    const validated = VideoLinkSchema.safeParse(data)
    if (validated.success) {
      AddVideo(validated.data)
      setData({
        url: "",
        capture: "",
      })
      setError({})
    } else {
      console.error(validated.error)
      const errors = validated.error.flatten().fieldErrors
      const errorObject = Object.fromEntries(
        Object.entries(errors).map(([key, value]) => [key, value?.[0] || ""])
      )
      setError(errorObject)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_1fr_auto] md:items-start">
        <Field>
          <FieldLabel htmlFor="url">URL</FieldLabel>
          <Input
            id="url"
            value={data.url}
            onChange={(e) => setData({ ...data, url: e.target.value })}
          />
          <FieldError>{error.url}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="capture">Capture</FieldLabel>
          <Input
            id="capture"
            value={data.capture}
            onChange={(e) => setData({ ...data, capture: e.target.value })}
          />
          <FieldError>{error.capture}</FieldError>
        </Field>

        <div className="flex md:pt-6">
          <Button onClick={handleSubmit} className="w-full md:w-auto">
            Add Video
          </Button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto pr-1">
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {videos.map((video, index) => (
              <Card key={video.id ?? index} className="min-w-0 relative">
                <Button
                  type="button"
                  size="icon-xs"
                  variant="ghost"
                  className="absolute top-2 right-2 z-10"
                  onClick={() => RemoveVideo(video.id)}
                >
                  <X className="size-3.5" />
                </Button>

                <CardContent className="space-y-2 pr-10">
                  <p className="break-all">
                    <strong>URL:</strong> {video.url}
                  </p>
                  <p className="break-words">
                    <strong>Capture:</strong> {video.capture}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No videos added yet.</p>
        )}
      </div>
    </div>
  )
}